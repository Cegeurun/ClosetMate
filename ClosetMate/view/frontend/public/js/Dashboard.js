// RETRIEVE VALUES FROM BACKEND
async function loadUser() {
  try {
    const res = await fetch("/test"); // call backend
    const data = await res.json();    // parse JSON

    // --- Insert into DOMx
    document.querySelector(".top-bar h1").textContent = 
      `Dashboard - Welcome, ${data.username}`;

    document.querySelector(".count").textContent = 
      `You have ${data.idle_items} unused items`;

  } catch (err) {
    console.error("Failed to load user:", err);
  }
}

async function loadWeather(){
     try {
    const res = await fetch("/api/weather/${city}"); // call backend
    const data = await res.json();
console.log("Weather response:", data);

    

    document.querySelector("#weather").textContent = 
      `${data.temperature} This is the temperature bitch`;

  } catch (err) {
    console.error("Failed to load user:", err);
  }
}

// --- Run on page load
document.addEventListener("DOMContentLoaded", () => {
  loadWeather();
  loadUser();
});
