// RETRIEVE VALUES FROM BACKEND
async function loadUser() {
  try {
    const res = await fetch("/test"); // call backend
    const data = await res.json();        // parse JSON

    // --- Insert into DOM
    document.querySelector("#testtest").textContent = 
      `Dashboard - Welcome, ${data.username}`;

    document.querySelector(".count").textContent = 
      `${data.username}'s Closet Summary`;

  } catch (err) {
    console.error("Failed to load user:", err);
  }
}

// --- Run on page load
loadUser();  