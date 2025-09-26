// closet.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("Closet page loaded ✅");

  // ========== DATA STRUCTURES ==========
  const categories = {
    "Tops": [
      "T-Shirts (basic, graphic, polo, henley)",
      "Shirts (dress shirt, casual shirt, flannel, button-down, overshirt)",
      "Blouses (peplum, wrap, tie-front, off-shoulder)",
      "Sweaters (crewneck, v-neck, turtleneck, cardigan, pullover)",
      "Sweatshirts & Hoodies (crewneck, zip-up, oversized)",
      "Tank Tops & Camisoles",
      "Crop Tops"
    ],
    "Bottoms": [
      "Jeans (skinny, straight, bootcut, wide-leg, ripped)",
      "Trousers (chinos, slacks, joggers, cargo pants, leggings)",
      "Shorts (denim, chino, cargo, biker, athletic)",
      "Skirts (mini, midi, maxi, pencil, pleated, wrap, skort)"
    ],
    "Dresses & Jumpsuits": [
      "Casual (sundress, slip dress, wrap dress)",
      "Formal (cocktail, evening gown, ball gown)",
      "Workwear (shirt dress, sheath, shift)",
      "Jumpsuits",
      "Rompers/Playsuits"
    ],
    "Outerwear": [
      "Jackets (denim, bomber, biker, puffer, varsity, windbreaker)",
      "Coats (trench, peacoat, parka, wool coat, duster)",
      "Blazers & Suit Jackets",
      "Vests (denim, padded, tailored)"
    ],
    "Activewear": [
      "Sports Bras", "Leggings & Yoga Pants", "Joggers & Sweatpants",
      "Gym Shorts", "Performance Tops (tank, tee, long sleeve)",
      "Tracksuits", "Compression Wear"
    ],
    "Loungewear": [
      "Pajamas (sets, nightgown, sleep shirt)", "Robes",
      "Lounge Pants & Shorts", "Sweatshirts & Lounge Tops"
    ],
    "Underwear": [
      "Bras (t-shirt, push-up, bralette, sports bra)",
      "Panties (briefs, bikini, thong, hipster, boyshort)",
      "Undershirts", "Shapewear", "Slips & Camisoles"
    ],
    "Suits & Formalwear": [
      "Business Suits (blazer + trousers/skirt)", "Tuxedos",
      "Dress Shirts & Ties", "Waistcoats / Vests",
      "Formal Dresses & Gowns"
    ],
    "Accessories": [
      "Hats & Caps", "Scarves & Shawls", "Gloves & Mittens",
      "Belts", "Ties & Bowties", "Socks & Stockings"
    ],
    "Footwear": [
      "Sneakers", "Boots (ankle, knee-high, combat, Chelsea)",
      "Sandals (slides, gladiator, flip-flops)",
      "Flats (ballet, loafers, espadrilles)",
      "Heels (pumps, wedges, stilettos)",
      "Formal Shoes (oxfords, derbies, monk straps)"
    ]
  };

  const metadataTags = {
    "Occasion / Use": ["Casual","Formal","Business / Office","Party / Club","Wedding / Evening","Sports / Gym","Loungewear","Travel","Seasonal / Holiday"],
    "Style / Aesthetic": ["Minimalist","Streetwear","Vintage","Y2K","Bohemian","Preppy","Grunge","Elegant / Chic","Athleisure","Smart Casual"],
    "Fit / Cut": ["Slim Fit","Regular Fit","Oversized","Relaxed","Cropped","High-Waist","Mid-Waist","Low-Rise","Bodycon","Flared / Wide-Leg"],
    "Fabric / Material": ["Cotton","Denim","Wool","Linen","Silk","Polyester","Leather","Satin","Knit","Fleece"],
    "Pattern / Print": ["Solid / Plain","Stripes","Plaid","Floral","Animal Print","Polka Dot","Graphic / Logo","Tie-Dye","Camouflage"],
    "Color Metadata": ["Black","White","Grey","Navy","Brown","Beige","Red","Blue","Green","Yellow","Purple","Pink","Orange","Pastel","Neon","Earth Tones","Metallic","Neutral"],
    "Seasonality": ["Spring","Summer","Autumn / Fall","Winter","All-Season"],
    "Special Features": ["Waterproof","Breathable","Stretch","Thermal","Lightweight","Eco-Friendly","Limited Edition","Designer / Luxury"],
    "Gender / Target": ["Menswear","Womenswear","Unisex","Kids"],
    "Care / Maintenance": ["Machine Washable","Hand Wash Only","Dry Clean Only","Wrinkle-Free","Easy Iron"]
  };

  // ========== FILTERS ==========
  const categoryBtns = document.querySelectorAll(".filter-btn");
  const subCategoryBtns = document.querySelectorAll(".sub-filter-btn");
  const closetItems = document.querySelectorAll(".closet-item");

  function filterCloset(keyword) {
    closetItems.forEach(item => {
      const alt = item.querySelector("img").alt.toLowerCase();
      item.style.display = (keyword === "All" || alt.includes(keyword.toLowerCase())) ? "flex" : "none";
    });
  }

  categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      categoryBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      filterCloset(btn.textContent.trim());
    });
  });

  subCategoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      subCategoryBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      filterCloset(btn.textContent.trim());
    });
  });

  // ========== DELETE MODE ==========
  const deleteBtn = document.querySelector(".action-btn.danger");
  const closetGrid = document.querySelector(".closet-grid");
  let deleteMode = false;

  deleteBtn.addEventListener("click", () => {
    if (!deleteMode) {
      deleteMode = true;
      closetGrid.classList.add("delete-mode");
      deleteBtn.textContent = "Confirm Delete";

      closetGrid.querySelectorAll(".closet-item").forEach(item => {
        if (!item.querySelector(".item-checkbox")) {
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.classList.add("item-checkbox");
          item.prepend(checkbox);
        }
      });
    } else {
      const selected = closetGrid.querySelectorAll(".item-checkbox:checked");
      if (selected.length === 0) {
        alert("Select items to delete.");
        return;
      }

      const confirmDelete = confirm(`Are you sure you want to delete ${selected.length} item(s)?`);
      if (confirmDelete) {
        selected.forEach(cb => cb.closest(".closet-item").remove());
      }

      deleteMode = false;
      closetGrid.classList.remove("delete-mode");
      deleteBtn.textContent = "Delete";
      closetGrid.querySelectorAll(".item-checkbox").forEach(cb => cb.remove());
    }
  });

  // ========== MODALS ==========
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

  // ========== ADD/EDIT FORMS ==========
  function getItemForm(existingItem = null) {
    const categoryOptions = Object.keys(categories)
      .map(c => `<option value="${c}">${c}</option>`).join("");

    let tagGroups = "";
    for (let group in metadataTags) {
      tagGroups += `
        <h4>${group}</h4>
        <div class="tag-selector">
          ${metadataTags[group].map(tag => `<button type="button" class="tag-option">${tag}</button>`).join("")}
        </div>
      `;
    }

    return `
      <h2>${existingItem ? "Edit Item" : "Add New Item"}</h2>
      <form id="item-form">
        <div class="form-group neu-input">
          <input type="text" id="item-name" placeholder=" " value="${existingItem ? existingItem.name : ""}" required>
          <label for="item-name">Item Name</label>
        </div>

        <div class="form-group neu-input">
          <select id="category" required>
            <option value="" disabled selected>Select Category</option>
            ${categoryOptions}
          </select>
          <label for="category">Category</label>
        </div>

        <div class="form-group neu-input">
          <select id="subcategory" required>
            <option value="" disabled selected>Select Subcategory</option>
          </select>
          <label for="subcategory">Subcategory</label>
        </div>

        <h3>Tags</h3>
        ${tagGroups}

        <button type="submit" class="neu-button accent">${existingItem ? "Save Changes" : "Add Item"}</button>
      </form>
    `;
  }

  // Hook up Add/Edit buttons
  document.querySelectorAll(".actions .action-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.textContent.includes("Add")) {
        openModal(getItemForm());
      }
      if (btn.textContent.includes("Edit")) {
        openModal(getItemForm({ name: "Grey Hoodie" }));
      }
    });
  });

  // Dynamic subcategories
  document.addEventListener("change", e => {
    if (e.target.id === "category") {
      const subcat = document.getElementById("subcategory");
      subcat.innerHTML = `<option value="" disabled selected>Select Subcategory</option>`;
      categories[e.target.value].forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        subcat.appendChild(opt);
      });
    }
  });

  // Handle tags (toggle only predefined)
  document.addEventListener("click", e => {
    if (e.target.classList.contains("tag-option")) {
      e.target.classList.toggle("active");
    }
  });
// Handle form submit
document.addEventListener("submit", e => {
  if (e.target.id === "item-form") {
    e.preventDefault();
    const name = document.getElementById("item-name").value;
    const category = document.getElementById("category").value;
    const subcategory = document.getElementById("subcategory").value;
    const tags = [...document.querySelectorAll(".tag-option.active")].map(t => t.textContent);

    // Check if editing or adding
    let targetItem;
    if (e.target.dataset.editingId) {
      targetItem = document.querySelector(`.closet-item[data-id="${e.target.dataset.editingId}"]`);
    } else {
      targetItem = document.createElement("div");
      targetItem.classList.add("closet-item");
      targetItem.dataset.id = Date.now(); // unique id
      targetItem.innerHTML = `
        <img src="../frontend/public/clothes/default.jpg" alt="${name}">
        <div class="item-preview">
          <h3 class="preview-name">${name}</h3>
          <div class="tags"></div>
        </div>
      `;
      document.querySelector(".closet-grid").appendChild(targetItem);
    }

    // Update dataset
    targetItem.dataset.name = name;
    targetItem.dataset.category = category;
    targetItem.dataset.subcategory = subcategory;
    targetItem.dataset.tags = JSON.stringify(tags);

    // Update inline preview
    targetItem.querySelector(".preview-name").textContent = name;
    const tagContainer = targetItem.querySelector(".tags");
    tagContainer.innerHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join("");

    alert("Item saved!");
    modal.classList.remove("active");
  }
});

// Item details modal
document.addEventListener("click", e => {
  const item = e.target.closest(".closet-item");
  if (!item || (deleteMode && e.target.classList.contains("item-checkbox"))) return;

  const img = item.querySelector("img");
  const name = item.dataset.name || img.alt;
  const category = item.dataset.category || "—";
  const subcategory = item.dataset.subcategory || "—";
  const tags = item.dataset.tags ? JSON.parse(item.dataset.tags) : [];

  openModal(`
    <h2>${name}</h2>
    <img src="${img.src}" alt="${img.alt}" style="max-width:100%; border-radius:12px; margin-bottom:1rem;" />
    <p><strong>Category:</strong> ${category}</p>
    <p><strong>Subcategory:</strong> ${subcategory}</p>
    <p><strong>Tags:</strong> ${tags.length ? tags.join(", ") : "—"}</p>
  `);
});

});
