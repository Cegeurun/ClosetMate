// =========================
// mainmenu.js
// =========================

// FAB Toggle
const fab = document.querySelector(".fab");
const fabMenu = document.querySelector(".fab-menu");

if (fab && fabMenu) {
  fab.addEventListener("click", () => {
    fabMenu.classList.toggle("open");
  });
}

// Section Switching
const menuCards = document.querySelectorAll(".menu-card");
const sections = document.querySelectorAll(".main-section");

menuCards.forEach(card => {
  card.addEventListener("click", () => {
    const target = card.querySelector("h3").innerText.toLowerCase(); // e.g. "Closet"

    sections.forEach(sec => {
      sec.classList.remove("active");
      if (sec.dataset.section === target) {
        sec.classList.add("active");
      }
    });
  });
});

// Theme Switching
const themeSelect = document.querySelector("#theme-select");

if (themeSelect) {
  themeSelect.addEventListener("change", e => {
    document.documentElement.setAttribute("data-theme", e.target.value);
    localStorage.setItem("theme", e.target.value); // Save preference
  });

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    themeSelect.value = savedTheme;
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
}

// Chat Scroll (auto-scroll to bottom on new message)
function scrollChatToBottom() {
  const chatArea = document.querySelector(".ai-chat-container"); // FIXED
  if (chatArea) {
    chatArea.scrollTop = chatArea.scrollHeight;
  }
}

// Add a new message
function addChatMessage(text, sender = "user") {
  const chatArea = document.querySelector(".ai-chat-container"); // FIXED
  if (!chatArea) return;

  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = text;
  chatArea.appendChild(msg);

  scrollChatToBottom();
}

// AI Chat
const chatInput = document.getElementById("chatInput");
if (chatInput) {
  chatInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter" && chatInput.value.trim() !== "") {
      const userMsg = chatInput.value.trim();
      addChatMessage(userMsg, "user");
      chatInput.value = "";

      // call backend instead of fake reply
      try {
        const res = await fetch("/ask-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: userMsg }),
        });

        const data = await res.json();
        addChatMessage(data.reply, "ai"); // show AI reply in chat
      } catch (err) {
        addChatMessage("Error: " + err.message, "ai");
      }
    }
  });
}


// Greetings on top of app
// RETRIEVE VALUES FROM BACKEND
async function loadUser() {
  try {
    const res = await fetch("/test"); // call backend
    const data = await res.json();    // parse JSON
    document.querySelector("#greetings").textContent = 
      `Hello, ${data.username}`;

  } catch (err) {
    console.error("Failed to load user:", err);
  }
}




loadUser();

// // AI Reply
// document.getElementById("ask-form").addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const question = document.getElementById("question").value;
//   const responseDiv = document.getElementById("response");

//   responseDiv.textContent = "Thinking...";

//   try {
//     const res = await fetch("/ask-ai", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ question }),
//     });

//     const data = await res.json();
//     responseDiv.textContent = data.reply;
//   } catch (err) {
//     responseDiv.textContent = "Error: " + err.message;
//   }
// });
