// ============================================================================
// CLOSET.JS - Virtual Closet Management System
// ============================================================================
// This script handles the core functionality of the digital closet:
// - Filtering items by category and subcategory
// - Adding/editing clothing items with metadata tags
// - Delete mode with multi-select checkboxes
// - Modal system for forms and item details
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("Closet page loaded ✅");

  async function loadClosetItems() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("User ID not found in localStorage.");
      return;
    }

    try {
      const response = await fetch(`/user/${userId}/items`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const items = await response.json();
      const closetGrid = document.querySelector(".closet-grid");

      items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'closet-item';
        itemElement.dataset.id = item.id;
        itemElement.dataset.name = item.name;
        itemElement.dataset.category = item.category;
        itemElement.dataset.subcategory = item.subcategory;
        itemElement.dataset.tags = JSON.stringify(item.style_tags);

        const img = document.createElement('img');
        img.src = item.image_url;
        img.alt = item.name;
        
        itemElement.appendChild(img);
        closetGrid.appendChild(itemElement);
      });

    } catch (error) {
      console.error('Failed to load closet items:', error);
    }
  }

  loadClosetItems();

  // ==========================================================================
  // DATA STRUCTURES
  // ==========================================================================
  // These define the clothing hierarchy and available metadata tags
  
  // Main categories and their subcategories
  // Used to populate dropdown menus and filter items
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

  // Metadata tagging system organized by category
  // Users can select multiple tags from each group to describe their items
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

  // ==========================================================================
  // FILTERING SYSTEM
  // ==========================================================================
  // Handles category and subcategory filtering of closet items
  
  // Get all filter buttons and closet items
  const categoryBtns = document.querySelectorAll(".filter-btn");
  const subCategoryBtns = document.querySelectorAll(".sub-filter-btn");
  const closetItems = document.querySelectorAll(".closet-item");

  /**
   * Filters closet items based on keyword match in image alt text
   * @param {string} keyword - The filter keyword ("All" shows everything)
   */
  function filterCloset(keyword) {
    closetItems.forEach(item => {
      const alt = item.querySelector("img").alt.toLowerCase();
      item.style.display = (keyword === "All" || alt.includes(keyword.toLowerCase())) ? "flex" : "none";
    });
  }

  // Main category filter buttons
  categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active state from all buttons
      categoryBtns.forEach(b => b.classList.remove("active"));
      // Set clicked button as active
      btn.classList.add("active");
      // Filter items based on button text
      filterCloset(btn.textContent.trim());
    });
  });

  // Subcategory filter buttons (secondary filtering)
  subCategoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active state from all subcategory buttons
      subCategoryBtns.forEach(b => b.classList.remove("active"));
      // Set clicked button as active
      btn.classList.add("active");
      // Filter items based on button text
      filterCloset(btn.textContent.trim());
    });
  });

  // ==========================================================================
  // DELETE MODE
  // ==========================================================================
  // Allows users to select multiple items and delete them in batch
  
  const deleteBtn = document.querySelector(".action-btn.danger");
  const closetGrid = document.querySelector(".closet-grid");
  let deleteMode = false; // Tracks whether delete mode is active

  deleteBtn.addEventListener("click", () => {
    // Toggle delete mode on/off
    if (!deleteMode) {
      // ===== ENTERING DELETE MODE =====
      deleteMode = true;
      closetGrid.classList.add("delete-mode"); // Visual styling
      deleteBtn.textContent = "Confirm Delete";

      // Add checkboxes to all closet items
      closetGrid.querySelectorAll(".closet-item").forEach(item => {
        if (!item.querySelector(".item-checkbox")) {
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.classList.add("item-checkbox");
          item.prepend(checkbox); // Add checkbox at the beginning
        }
      });
    } else {
      // ===== CONFIRMING DELETION =====
      const selected = closetGrid.querySelectorAll(".item-checkbox:checked");
      
      // Validate that at least one item is selected
      if (selected.length === 0) {
        alert("Select items to delete.");
        return;
      }

      // Confirm deletion with user
      const confirmDelete = confirm(`Are you sure you want to delete ${selected.length} item(s)?`);
      if (confirmDelete) {
        // Remove each selected item from DOM
        selected.forEach(cb => cb.closest(".closet-item").remove());
      }

      // Exit delete mode
      deleteMode = false;
      closetGrid.classList.remove("delete-mode");
      deleteBtn.textContent = "Delete";
      
      // Remove all checkboxes
      closetGrid.querySelectorAll(".item-checkbox").forEach(cb => cb.remove());
    }
  });

  // ==========================================================================
  // MODAL SYSTEM
  // ==========================================================================
  // Creates a reusable modal for forms and item details
  
  // Create modal structure and append to body
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content glass-card">
      <span class="modal-close">&times;</span>
      <div class="modal-body"></div>
    </div>
  `;
  document.body.appendChild(modal);

  // Get modal body element for content injection
  const modalBody = modal.querySelector(".modal-body");
  
  // Close modal function
  const closeModal = () => modal.classList.remove("active");
  
  // Attach close handler to X button
  modal.querySelector(".modal-close").addEventListener("click", closeModal);

  /**
   * Opens modal with provided HTML content
   * @param {string} content - HTML string to display in modal
   */
  function openModal(content) {
    modalBody.innerHTML = content;
    modal.classList.add("active");
  }

  // ==========================================================================
  // ADD/EDIT ITEM FORM GENERATION
  // ==========================================================================
  // Generates the HTML for adding or editing a closet item
  
  /**
   * Generates form HTML for adding or editing an item
   * @param {Object|null} existingItem - If provided, pre-fills form with item data
   * @returns {string} HTML string of the form
   */
  function getItemForm(existingItem = null) {
    // Generate category dropdown options
    const categoryOptions = Object.keys(categories)
      .map(c => `<option value="${c}">${c}</option>`).join("");

    // Generate tag selection buttons for all metadata groups
    let tagGroups = "";
    for (let group in metadataTags) {
      tagGroups += `
        <h4>${group}</h4>
        <div class="tag-selector">
          ${metadataTags[group].map(tag => `<button type="button" class="tag-option">${tag}</button>`).join("")}
        </div>
      `;
    }

    // Return complete form HTML
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


        <div class="form-group">
          <label for="image-upload" class="neu-button">
            Upload Image
          </label>
          <input type="file" id="image-upload" accept="image/*" style="display: none;">
          <span id="file-name"></span>
        </div>
        
        <h3>Tags</h3>
        ${tagGroups}

      <button type="submit" class="neu-button accent">${existingItem ? "Save Changes" : "Add Item"}</button>
    </form>
  `;
}

  // ==========================================================================
  // ACTION BUTTON HANDLERS
  // ==========================================================================
  // Connects Add/Edit buttons to modal forms
  
  document.querySelectorAll(".actions .action-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      // Open add form
      if (btn.textContent.includes("Add")) {
        openModal(getItemForm());
      }
      // Open edit form (with placeholder data)
      if (btn.textContent.includes("Edit")) {
        openModal(getItemForm({ name: "Grey Hoodie" }));
      }
    });
  });

  // ==========================================================================
  // DYNAMIC SUBCATEGORY POPULATION
  // ==========================================================================
  // Updates subcategory dropdown based on selected main category
  
  document.addEventListener("change", e => {
    if (e.target.id === "category") {
      const subcat = document.getElementById("subcategory");
      // Reset subcategory dropdown
      subcat.innerHTML = `<option value="" disabled selected>Select Subcategory</option>`;
      
      // Populate with subcategories for selected main category
      categories[e.target.value].forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        subcat.appendChild(opt);
      });
    }
  });

  // ==========================================================================
  // TAG SELECTION HANDLER
  // ==========================================================================
  // Toggles active state on tag buttons (predefined tags only)
  
  document.addEventListener("click", e => {
    if (e.target.classList.contains("tag-option")) {
      e.target.classList.toggle("active"); // Toggle visual active state
    }
  });

  // ==========================================================================
  // FORM SUBMISSION HANDLER
  // ==========================================================================
  // Processes add/edit form submission and updates closet grid
  
  document.addEventListener("submit", e => {
    if (e.target.id === "item-form") {
      e.preventDefault();
      
        // Collect form data
  const name = document.getElementById("item-name").value;
  const category = document.getElementById("category").value;
  const subcategory = document.getElementById("subcategory").value;
  const tags = [...document.querySelectorAll(".tag-option.active")].map(t => t.textContent);
  const imageFile = document.getElementById("image-upload").files[0];

  // Create FormData to send multipart data
  const formData = new FormData();
  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  formData.append('userId', userId); // Add userId to the form data
  formData.append('name', name);
  formData.append('category', category);
  formData.append('subcategory', subcategory);
  formData.append('tags', JSON.stringify(tags)); // Send tags as a JSON string
  if (imageFile) {
    formData.append('image', imageFile);
  }

  // Determine if editing existing item or adding new one
  let targetItem;
  if (e.target.dataset.editingId) {
    // ===== EDITING EXISTING ITEM =====
    targetItem = document.querySelector(`.closet-item[data-id="${e.target.dataset.editingId}"]`);
    formData.append('id', e.target.dataset.editingId);

    // ===== EDITING EXISTING ITEM: POST REQUEST =====
    fetch('/edit-item', { // Replace '/edit-item' with your actual endpoint
      method: 'POST',
      body: formData, // Send FormData
    })
    .then(response => response.json()) // Parse the JSON response
    
        .then(data => {
          console.log('Success:', data); // Log the successful response
          // Handle success (e.g., display a success message)
        })
        .catch((error) => {
          console.error('Error:', error); // Log any errors
          // Handle errors (e.g., display an error message)
        });
      } else {
        // ===== ADDING NEW ITEM =====
        targetItem = document.createElement("div");
        targetItem.classList.add("closet-item");
        targetItem.dataset.id = Date.now(); // Generate unique timestamp ID
        targetItem.innerHTML = `
          <img src="../frontend/public/clothes/default.jpg" alt="${name}">
          <div class="item-preview">
            <h3 class="preview-name">${name}</h3>
            <div class="tags"></div>
          </div>
        `;
        // Append new item to grid
        document.querySelector(".closet-grid").appendChild(targetItem);

            // ===== ADDING NEW ITEM: POST REQUEST =====
        fetch('/user/addItem', { // The endpoint that uses multer
          method: 'POST',
          body: formData, // Send FormData
        })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
          console.log('Success:', data); // Log the successful response
          if (data.success && data.imagePath) {
            // Update the new item's image source
            targetItem.querySelector('img').src = data.imagePath;
          }
        })
        .catch((error) => {
          console.error('Error:', error); // Log any errors
          // Handle errors (e.g., display an error message)
        });
      }

  // Update item's data attributes
      targetItem.dataset.name = name;
      targetItem.dataset.category = category;
      targetItem.dataset.subcategory = subcategory;
      targetItem.dataset.tags = JSON.stringify(tags);

      // Update inline preview (visible in grid)
      targetItem.querySelector(".preview-name").textContent = name;
      const tagContainer = targetItem.querySelector(".tags");
      tagContainer.innerHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join("");

      // Notify user and close modal
      alert("Item saved!");
      modal.classList.remove("active");
    }
  });

  // ==========================================================================
  // ITEM DETAILS MODAL
  // ==========================================================================
  // Opens detailed view when clicking on a closet item
  
  document.addEventListener("click", e => {
    const item = e.target.closest(".closet-item");
    
    // Don't open details if:
    // - Click wasn't on an item
    // - In delete mode and clicking checkbox
    if (!item || (deleteMode && e.target.classList.contains("item-checkbox"))) return;

    // Extract item data from element
    const img = item.querySelector("img");
    const name = item.dataset.name || img.alt;
    const category = item.dataset.category || "—";
    const subcategory = item.dataset.subcategory || "—";
    const tags = item.dataset.tags ? JSON.parse(item.dataset.tags) : [];

    // Display item details in modal
    openModal(`
      <h2>${name}</h2>
      <img src="${img.src}" alt="${img.alt}" style="max-width:100%; border-radius:12px; margin-bottom:1rem;" />
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Subcategory:</strong> ${subcategory}</p>
      <p><strong>Tags:</strong> ${tags.length ? tags.join(", ") : "—"}</p>
    `);
  });

});