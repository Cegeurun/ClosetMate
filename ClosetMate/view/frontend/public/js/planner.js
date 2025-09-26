// planner.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("Planner page loaded ✅");

  /* -----------------------
     Elements
     ----------------------- */
  const chatInput = document.getElementById("chatInput");
  const chatContainer = document.getElementById("chatContainer");
  const aiOutfits = document.getElementById("aiOutfits");
  const boardView = document.getElementById("boardView");
  const tableView = document.getElementById("tableView");
  const calendarView = document.getElementById("calendarView");
  const manualBuilder = document.getElementById("manualBuilder");
  const quickActions = document.querySelector(".quick-actions");
  const viewSwitch = document.querySelector(".view-switch");
  const actions = document.querySelector(".actions");

  let plannedOutfits = []; // { id, date, time, categories: [{label, imgSrc}], html }

  /* -----------------------
     Mock closet (categories -> subcategories -> images)
     Replace with your DB results in real app
     ----------------------- */
  const closetDB = {
    Top: {
      "Blouses": ["top 1.jpg", "top 2.jpg"],
      "Tees": ["top 3.jpg"]
    },
    Bottom: {
      "Jeans": ["bottom 1.jpg", "bottom 2.jpg"],
      "Skirts": ["bottom 3.jpg"]
    },
    Shoes: {
      "Sneakers": ["shoes 1.jpg", "shoes 2.jpg"],
      "Heels": ["shoes 3.jpg"]
    },
    Jacket: {
      "Light Jacket": ["outerwear 1.jpg"],
      "Coat": ["outerwear 2.jpg"]
    },
    Accessories: {
      "Hat": ["acc 1.jpg"],
      "Scarf": ["acc 2.jpg"]
    }
  };

  // Flattened quick-access arrays per "category key" used by builder indices
  const closetArrays = {}; // e.g. { top_blouses: [...], bottom_jeans: [...] }
  Object.keys(closetDB).forEach(category => {
    Object.keys(closetDB[category]).forEach(sub => {
      const key = `${category.toLowerCase()}_${slug(sub)}`;
      closetArrays[key] = closetDB[category][sub].slice();
    });
  });

  // default builder categories (top, bottom, shoes) map to first subcategory existing
  function defaultKeyFor(categoryName) {
    const cat = Object.keys(closetDB).find(c => c.toLowerCase() === categoryName);
    if (!cat) return null;
    const firstSub = Object.keys(closetDB[cat])[0];
    return `${cat.toLowerCase()}_${slug(firstSub)}`;
  }

  const indices = {}; // dynamic per builder slot key e.g. { top_blouses: 0 }

  // helpers
  function slug(s) { return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, ""); }
  function wrapPhoto(src, alt = "") {
    return `<div class="outfit-photo"><img src="/media/clothes/${src}" alt="${alt}"></div>`;
  }
  function uuid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

  /* -----------------------
     Chat + AI suggestions
     ----------------------- */
  chatInput.addEventListener("keypress", e => {
    if (e.key === "Enter" && chatInput.value.trim() !== "") {
      const msg = chatInput.value.trim();
      addMessage("user", msg);
      chatInput.value = "";
      // Mock AI response and suggestions
      setTimeout(() => {
        addMessage("ai", `Here are some outfit ideas for "${msg}"`);
        generateAISuggestions(msg);
      }, 350);
    }
  });

  function addMessage(sender, text) {
    const div = document.createElement("div");
    div.className = `chat-message ${sender}`;
    div.textContent = text;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function generateAISuggestions(promptText = "") {
    aiOutfits.innerHTML = ""; // clear

    // For demo, pick three pseudo-random keys from closetArrays
    const keys = Object.keys(closetArrays);
    for (let i = 0; i < 3; i++) {
      const pickTopKey = keys[(i*3) % keys.length];
      const pickBottomKey = keys[(i*3 + 1) % keys.length];
      const pickShoesKey = keys[(i*3 + 2) % keys.length];

      const topImg = closetArrays[pickTopKey] ? closetArrays[pickTopKey][0] : null;
      const bottomImg = closetArrays[pickBottomKey] ? closetArrays[pickBottomKey][0] : null;
      const shoesImg = closetArrays[pickShoesKey] ? closetArrays[pickShoesKey][0] : null;

      const card = document.createElement("div");
      card.className = "outfit-card";
      card.dataset.generated = "true";
      // store structured categories for easier scheduling/inspection later
      card.dataset.outfit = JSON.stringify([
        { label: pickTopKey || "top", src: topImg },
        { label: pickBottomKey || "bottom", src: bottomImg },
        { label: pickShoesKey || "shoes", src: shoesImg }
      ]);

      card.innerHTML = `
        <div><strong>AI Outfit ${i + 1}</strong></div>
        <div style="display:flex;justify-content:center;gap:.5rem;margin-top:.5rem;">
          ${ topImg ? wrapPhoto(topImg, "Top") : '' }
          ${ bottomImg ? wrapPhoto(bottomImg, "Bottom") : '' }
          ${ shoesImg ? wrapPhoto(shoesImg, "Shoes") : '' }
        </div>
        <div class="actions" style="margin-top:.5rem;">
          <button class="neu-button accent approve-btn">Approve</button>
          <button class="neu-button danger decline-btn">Decline</button>
        </div>
      `;
      aiOutfits.appendChild(card);
    }
  }

  // allow clicking approve / decline
  aiOutfits.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const card = e.target.closest(".outfit-card");
    if (btn.classList.contains("approve-btn")) {
      // parse structured outfit from dataset where available, else take innerHTML
      const outfitData = card.dataset.outfit ? JSON.parse(card.dataset.outfit) : null;
      const contentHTML = outfitData
        ? outfitData.map(c => c.src ? wrapPhoto(c.src) : "").join("")
        : card.innerHTML;
      promptDateTimeThenSchedule(contentHTML, outfitData);
      card.remove();
    } else if (btn.classList.contains("decline-btn")) {
      card.style.opacity = "0.45";
      const actionsDiv = card.querySelector(".actions");
      actionsDiv.innerHTML = `<span style="color:#ff6b6b">Declined</span>`;
    }
  });

  /* -----------------------
     Manual Builder initialization
     ----------------------- */
  // builder initial slots are inside manualBuilder as .builder-row elements with .builder-slot and data-label
  function initBuilderSlots() {
    const rows = manualBuilder.querySelectorAll(".builder-row");
    rows.forEach(row => {
      const slot = row.querySelector(".builder-slot");
      const labelAttr = slot.dataset.label; // e.g. "top"
      // find a default key to drive images
      const defaultKey = defaultKeyFor(labelAttr) || Object.keys(closetArrays)[0];
      const indexKey = defaultKey;
      if (!(indexKey in indices)) indices[indexKey] = 0;

      // save mapping on the slot so nav works even if new categories added
      slot.dataset.key = indexKey;

      // set first image if available
      const arr = closetArrays[indexKey] || [];
      if (arr.length) {
        slot.innerHTML = wrapPhoto(arr[0], labelAttr);
      } else {
        slot.innerHTML = `<span style="font-size:.85rem;color:var(--text-muted)">${labelAttr}</span>`;
      }

      // attach row click handlers for nav buttons
      row.querySelectorAll(".nav-btn").forEach(btn => {
        btn.addEventListener("click", ev => {
          ev.stopPropagation();
          const dir = btn.textContent === "<" ? -1 : 1;
          const key = slot.dataset.key;
          if (!key || !closetArrays[key]) return;
          indices[key] = (indices[key] + dir + closetArrays[key].length) % closetArrays[key].length;
          slot.innerHTML = wrapPhoto(closetArrays[key][indices[key]]);
        });
      });
    });
  }

  initBuilderSlots();

  /* -----------------------
     Add / Delete Category (modal with dropdowns)
     ----------------------- */
  quickActions.addEventListener("click", e => {
    const t = e.target;
    if (t.textContent.includes("Add Category")) {
      openAddCategoryModal();
    } else if (t.textContent.includes("Delete Category")) {
      const rows = manualBuilder.querySelectorAll(".builder-row");
      if (rows.length > 3) {
        rows[rows.length - 1].remove();
      } else {
        alert("Keep at least Top, Bottom, Shoes.");
      }
    } else if (t.textContent.includes("Finalize")) {
      // build contentHTML from builder-slot innerHTML
      const slotEls = Array.from(manualBuilder.querySelectorAll(".builder-slot"));
      const contentHTML = slotEls.map(s => s.innerHTML).join("");
      promptDateTimeThenSchedule(contentHTML, null, slotEls.map(s => ({label: s.dataset.label, key: s.dataset.key})));
    } else if (t.textContent.includes("Cancel")) {
      // clear builder slots to pure label
      manualBuilder.querySelectorAll(".builder-slot").forEach(s => {
        const label = s.dataset.label || "";
        s.innerHTML = `<span style="font-size:.85rem;color:var(--text-muted)">${label}</span>`;
      });
    }
  });

  function openAddCategoryModal() {
    // Build modal DOM
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.innerHTML = `
      <div class="modal-content glass-card" style="max-width:420px;">
        <span class="modal-close" style="cursor:pointer;font-size:20px;float:right;">&times;</span>
        <h3>Add Category</h3>
        <div style="display:flex;flex-direction:column;gap:.75rem;margin-top:1rem;">
          <label>Category
            <select id="modal-category-select"></select>
          </label>
          <label>Subcategory
            <select id="modal-subcategory-select"></select>
          </label>
          <div style="display:flex;gap:.5rem;justify-content:flex-end;">
            <button id="modal-add-confirm" class="neu-button accent">Add</button>
            <button id="modal-add-cancel" class="neu-button">Cancel</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const catSel = modal.querySelector("#modal-category-select");
    const subSel = modal.querySelector("#modal-subcategory-select");
    // populate category options
    Object.keys(closetDB).forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.text = cat;
      catSel.appendChild(opt);
    });

    // populate subcategories when category changes
    function populateSubcats() {
      subSel.innerHTML = "";
      const subcats = Object.keys(closetDB[catSel.value] || {});
      subcats.forEach(s => {
        const o = document.createElement("option");
        o.value = s;
        o.text = s;
        subSel.appendChild(o);
      });
    }
    catSel.addEventListener("change", populateSubcats);
    populateSubcats(); // initial

    // handlers
    modal.querySelector(".modal-close").addEventListener("click", () => modal.remove());
    modal.querySelector("#modal-add-cancel").addEventListener("click", () => modal.remove());

    modal.querySelector("#modal-add-confirm").addEventListener("click", () => {
      const chosenCat = catSel.value;
      const chosenSub = subSel.value;
      if (!chosenCat || !chosenSub) return alert("Choose both category and subcategory.");

      const key = `${chosenCat.toLowerCase()}_${slug(chosenSub)}`;
      // ensure closetArrays has this key (from closetDB)
      closetArrays[key] = closetDB[chosenCat][chosenSub].slice();
      if (!(key in indices)) indices[key] = 0;

      // create builder row
      const row = document.createElement("div");
      row.className = "builder-row";
      const labelLower = chosenCat.toLowerCase();
      row.innerHTML = `
        <button class="nav-btn">&lt;</button>
        <div class="builder-slot outfit-photo" data-label="${chosenSub}" data-key="${key}">
          <span style="font-size:.85rem;color:var(--text-muted)">${chosenSub}</span>
        </div>
        <button class="nav-btn">&gt;</button>
      `;
      manualBuilder.appendChild(row);
      initBuilderSlots(); // re-init to attach nav handlers
      modal.remove();
    });
  }

  /* -----------------------
     Prompt date/time modal and schedule, handling duplicate slot
     ----------------------- */
  function promptDateTimeThenSchedule(contentHTML, outfitData = null, slotInfo = null) {
    // modal with date and time input
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.innerHTML = `
      <div class="modal-content glass-card" style="max-width:420px;">
        <span class="modal-close" style="cursor:pointer;font-size:20px;float:right;">&times;</span>
        <h3>Set Date & Time</h3>
        <div style="display:flex;flex-direction:column;gap:.75rem;margin-top:1rem;">
          <label>Date <input id="modal-date" type="date" /></label>
          <label>Time <input id="modal-time" type="time" /></label>
          <div style="display:flex;gap:.5rem;justify-content:flex-end;">
            <button id="modal-when-confirm" class="neu-button accent">Save</button>
            <button id="modal-when-cancel" class="neu-button">Cancel</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector(".modal-close").addEventListener("click", close);
    modal.querySelector("#modal-when-cancel").addEventListener("click", close);

    modal.querySelector("#modal-when-confirm").addEventListener("click", () => {
      const date = modal.querySelector("#modal-date").value;
      const time = modal.querySelector("#modal-time").value;
      if (!date || !time) return alert("Pick both date and time.");

      // check duplicate
      const duplicateIndex = plannedOutfits.findIndex(p => p.date === date && p.time === time);
      if (duplicateIndex !== -1) {
        // show replace or cancel confirm
        const replace = confirm("Already planned an outfit for this date/time. Replace it?");
        if (!replace) {
          close();
          return;
        }
        // remove existing
        plannedOutfits.splice(duplicateIndex, 1);
        // also remove from views (rebuild views after)
        rebuildAllViews();
      }

      // build categories structured array for board/table summary
      let categories = [];
      if (outfitData) {
        // outfitData from AI (structured)
        categories = outfitData.map(c => ({ label: c.label, src: c.src }));
      } else if (slotInfo) {
        // from manual builder slot info
        categories = slotInfo.map(si => {
          const arr = closetArrays[si.key] || [];
          const idx = indices[si.key] || 0;
          const src = arr[idx] || null;
          return { label: si.label || si.key, src };
        });
      } else {
        // fallback - parse images in contentHTML
        const temp = document.createElement("div");
        temp.innerHTML = contentHTML;
        const imgs = Array.from(temp.querySelectorAll("img")).map(img => img.getAttribute("src").split("/").pop());
        categories = imgs.map((src, i) => ({ label: `item${i+1}`, src }));
      }

      // final contentHTML should be uniform (outfit-photo wrappers)
      const finalHTML = categories.map(c => c.src ? wrapPhoto(c.src) : "").join("");

      // create planned outfit entry
      const id = uuid();
      plannedOutfits.push({ id, date, time, categories, html: finalHTML });

      // update views
      appendPlannedToViews({ id, date, time, categories, html: finalHTML });

      close();
    });
  }

  /* -----------------------
     Append planned outfit to board/table and refresh calendar
     ----------------------- */
  function appendPlannedToViews(outfit) {
    // Board (grid of cards) — show basic info: primary category & time
    const card = document.createElement("div");
    card.className = "outfit-card";
    const primaryCat = outfit.categories[0] ? outfit.categories[0].label.split("_").join(" ") : "Outfit";
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <strong>${formatDate(outfit.date)}</strong>
        <small>${outfit.time}</small>
      </div>
      <div style="display:flex;gap:.5rem;margin-top:.5rem;justify-content:center;">
        ${outfit.html}
      </div>
    `;
    card.dataset.id = outfit.id;
    boardView.appendChild(card);

    // Table view (list row)
    const row = document.createElement("div");
    row.className = "item";
    row.dataset.id = outfit.id;
    row.innerHTML = `
      <div class="date" style="width:120px">${formatDate(outfit.date)}</div>
      <div style="flex:1;display:flex;gap:.5rem;align-items:center;">
        ${outfit.html}
      </div>
      <div style="min-width:80px;text-align:right;padding-right:8px;"><small>${outfit.time}</small></div>
    `;
    tableView.appendChild(row);

    // Calendar refresh (will rebuild full calendar)
    renderCalendar();
  }

  function rebuildAllViews() {
    boardView.innerHTML = "";
    tableView.innerHTML = "";
    plannedOutfits.forEach(p => appendPlannedToViews(p));
    renderCalendar();
  }

  function formatDate(iso) {
    // iso YYYY-MM-DD -> human e.g. Sep 25, 2025
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  /* -----------------------
     Calendar rendering (monthly grid)
     ----------------------- */
  function renderCalendar(monthOffset = 0) {
    // monthOffset: 0 -> current month; +1 next etc.
    const base = new Date();
    base.setMonth(base.getMonth() + monthOffset);
    const year = base.getFullYear();
    const month = base.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarView.innerHTML = "";
    calendarView.classList.add("calendar-grid");

    // headers
    const headers = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    headers.forEach(h => {
      const head = document.createElement("div");
      head.className = "day-header";
      head.textContent = h;
      calendarView.appendChild(head);
    });

    // blanks
    for (let i = 0; i < firstDay; i++) {
      const blank = document.createElement("div");
      blank.className = "day empty";
      calendarView.appendChild(blank);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayDiv = document.createElement("div");
      dayDiv.className = "day";
      dayDiv.innerHTML = `<strong>${d}</strong>`;

      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

      // append planned outfits for that date (basic info only: category + time)
      plannedOutfits.filter(p => p.date === dateStr).forEach(p => {
        const note = document.createElement("div");
        note.className = "calendar-note";
        const primary = p.categories[0] ? p.categories[0].label.split("_").join(" ") : "Outfit";
        note.innerHTML = `<div style="display:flex;gap:.4rem;align-items:center;">
          <div style="width:28px;height:28px">${p.html ? p.html.replace(/(^<div class="outfit-photo">|<\/div>$)/g, "") : ""}</div>
          <div style="font-size:.78rem;">${primary} • <small>${p.time}</small></div>
        </div>`;
        dayDiv.appendChild(note);
      });

      calendarView.appendChild(dayDiv);
    }

    calendarView.style.display = "grid";
    calendarView.style.gridTemplateColumns = "repeat(7, 1fr)";
    calendarView.style.gap = "6px";
  }

  // initial render
  renderCalendar();

  /* -----------------------
     View switcher
     ----------------------- */
  viewSwitch.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const view = btn.textContent.trim().toLowerCase();
    boardView.style.display = view === "board" ? "grid" : "none";
    tableView.style.display = view === "table" ? "flex" : "none";
    calendarView.style.display = view === "calendar" ? "grid" : "none";

    if (view === "calendar") renderCalendar();
  });

  /* -----------------------
     CRUD stubs
     ----------------------- */
  actions.addEventListener("click", e => {
    const t = e.target;
    if (t.textContent.includes("Add")) {
      // open manual builder modal or focus manual builder
      alert("Use Manual Builder to create and Finalize an outfit.");
    } else if (t.textContent.includes("Edit")) {
      alert("Select an outfit to edit (not implemented).");
    } else if (t.textContent.includes("Delete")) {
      // delete last planned outfit as quick action (example)
      if (!plannedOutfits.length) return alert("No planned outfits to delete.");
      if (!confirm("Delete last planned outfit?")) return;
      const last = plannedOutfits.pop();
      rebuildAllViews();
    }
  });

  /* -----------------------
     Small helpers for UI stability
     ----------------------- */
  // ensure boardView defaults to grid
  boardView.style.display = "grid";
  boardView.style.gridTemplateColumns = "repeat(auto-fit,minmax(220px,1fr))";
  boardView.style.gap = "12px";

  // expose generateAISuggestions for debug
  window.generateAISuggestions = generateAISuggestions;
});
