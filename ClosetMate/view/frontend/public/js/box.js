// box.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("Sustainable Box page loaded ✅");

  const boxGrid = document.querySelector(".box-grid");
  let deleteMode = false;
  let editMode = false;

  // ========== AUTO-INJECT DECISION BUTTONS FOR UNASSIGNED ==========
  function prepareUnassignedItems() {
    boxGrid.querySelectorAll(".box-item").forEach(item => {
      if (!item.dataset.status || item.dataset.status === "none") {
        item.dataset.status = "unassigned";
      }
      if (item.dataset.status === "unassigned") {
        if (!item.querySelector(".suggestion")) {
          const msg = document.createElement("p");
          msg.classList.add("suggestion");
          msg.textContent =
            "This item is unassigned. Please choose Reduce, Reuse, or Recycle.";
          item.appendChild(msg);
        }
        addDecisionButtons(item);
      }
    });
  }
  prepareUnassignedItems();

  // ========== ADD ==========
  const addBtn = [...document.querySelectorAll(".action-btn")]
    .find(btn => btn.textContent.includes("Add"));

  addBtn.addEventListener("click", () => {
    const closetItems = [...document.querySelectorAll(".closet-item img")];
    if (closetItems.length === 0) {
      alert("No closet items found.");
      return;
    }

    // Closet picker (with optional leave unassigned)
    const closetGallery = closetItems
      .map(img => `
        <div class="closet-pick" data-src="${img.src}" data-name="${img.alt}">
          <img src="${img.src}" alt="${img.alt}">
          <div class="decision-buttons">
            <label><input type="radio" name="rrr-${img.alt}" value="reuse"> Reuse</label>
            <label><input type="radio" name="rrr-${img.alt}" value="reduce"> Reduce</label>
            <label><input type="radio" name="rrr-${img.alt}" value="recycle"> Recycle</label>
            <label><input type="radio" name="rrr-${img.alt}" value="unassigned"> Leave Unassigned</label>
          </div>
        </div>
      `).join("");

    openModal(`
      <h2>Select Clothes and Assign RRR</h2>
      <div class="closet-gallery">${closetGallery}</div>
      <button id="confirm-add">Confirm</button>
    `);
  });

  // Confirm Add
  document.addEventListener("click", e => {
    if (e.target.id === "confirm-add") {
      const picks = [...document.querySelectorAll(".closet-pick")];
      let added = 0;

      picks.forEach(pick => {
        const src = pick.dataset.src;
        const name = pick.dataset.name;
        const choice = pick.querySelector("input[type=radio]:checked");

        if (choice) {
          const status = choice.value;
          const newItem = document.createElement("div");
          newItem.classList.add("box-item");
          newItem.dataset.id = Date.now();
          newItem.dataset.name = name;
          newItem.dataset.status = status;
          newItem.innerHTML = `
            <img src="${src}" alt="${name}">
            <p class="suggestion">${
              status === "unassigned"
                ? "This item is unassigned. Please choose Reduce, Reuse, or Recycle."
                : `${status.toUpperCase()}: ${name}`
            }</p>
          `;
          boxGrid.appendChild(newItem);

          if (status === "reuse") {
            setTimeout(() => newItem.remove(), 200);
          } else if (status === "unassigned") {
            addDecisionButtons(newItem);
          }

          added++;
        }
      });

      if (added === 0) {
        alert("Pick at least one item.");
        return;
      }

      modal.classList.remove("active");
    }
  });

  // ========== EDIT ==========
  const editBtn = [...document.querySelectorAll(".action-btn")]
    .find(btn => btn.textContent.includes("Edit"));

  editBtn.addEventListener("click", () => {
    editMode = !editMode;
    editBtn.textContent = editMode ? "Confirm Edit" : "Edit";

    boxGrid.querySelectorAll(".box-item").forEach(item => {
      if (editMode) {
        if (!item.querySelector(".item-checkbox")) {
          const cb = document.createElement("input");
          cb.type = "checkbox";
          cb.classList.add("item-checkbox");
          item.prepend(cb);
        }
      } else {
        const cb = item.querySelector(".item-checkbox");
        if (cb) cb.remove();
        const btns = item.querySelector(".decision-buttons");
        if (btns) btns.remove();
      }
    });
  });

  // Show decision buttons when checkbox is checked
  document.addEventListener("change", e => {
    if (e.target.classList.contains("item-checkbox") && editMode) {
      const item = e.target.closest(".box-item");
      if (e.target.checked) {
        addDecisionButtons(item);
      } else {
        const btns = item.querySelector(".decision-buttons");
        if (btns) btns.remove();
      }
    }
  });

  // ========== DELETE ==========
  const deleteBtn = [...document.querySelectorAll(".action-btn")]
    .find(btn => btn.textContent.includes("Delete"));

  deleteBtn.addEventListener("click", () => {
    if (!deleteMode) {
      deleteMode = true;
      deleteBtn.textContent = "Confirm Delete";
      boxGrid.querySelectorAll(".box-item").forEach(item => {
        if (!item.querySelector(".item-checkbox")) {
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.classList.add("item-checkbox");
          item.prepend(checkbox);
        }
      });
    } else {
      const selected = boxGrid.querySelectorAll(".item-checkbox:checked");
      if (selected.length === 0) {
        alert("Select items to delete.");
        return;
      }
      if (confirm(`Delete ${selected.length} item(s)?`)) {
        selected.forEach(cb => cb.closest(".box-item").remove());
      }
      deleteMode = false;
      deleteBtn.textContent = "Delete";
      boxGrid.querySelectorAll(".item-checkbox").forEach(cb => cb.remove());
    }
  });

  // ========== FILTERS ==========
  const filterBtns = document.querySelectorAll(".filter-btn");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      boxGrid.querySelectorAll(".box-item").forEach(item => {
        const status = item.dataset.status || "unassigned";
        if (filter === "all" || status === filter) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // ========== DECISION BUTTON HANDLER ==========
  function addDecisionButtons(item) {
    if (item.querySelector(".decision-buttons")) return;
    const btns = document.createElement("div");
    btns.classList.add("decision-buttons");
    btns.innerHTML = `
      <button class="reuse" data-status="reuse">Reuse</button>
      <button class="reduce" data-status="reduce">Reduce</button>
      <button class="recycle" data-status="recycle">Recycle</button>
    `;
    item.appendChild(btns);
  }

  document.addEventListener("click", e => {
    if (e.target.closest(".decision-buttons button")) {
      const btn = e.target;
      const item = btn.closest(".box-item");
      const status = btn.dataset.status;
      const name = item.dataset.name || item.querySelector("img").alt;

      item.dataset.status = status;
      item.querySelector(".suggestion").textContent =
        `${status.toUpperCase()}: ${name}`;

      const btns = item.querySelector(".decision-buttons");
      if (btns) btns.remove();
    }
  });

  // ========== MODAL ==========
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content glass-card">
      <span class="modal-close">&times;</span>
      <div class="modal-body"></div>
    </div>
  `;
  document.body.appendChild(modal);
  const modalBody = modal.querySelector(".modal-body");
  const closeModal = () => modal.classList.remove("active");
  modal.querySelector(".modal-close").addEventListener("click", closeModal);
  function openModal(content) {
    modalBody.innerHTML = content;
    modal.classList.add("active");
  }
});
