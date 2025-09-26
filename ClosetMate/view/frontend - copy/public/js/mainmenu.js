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
const chatInput = document.getElementById("chatInput");
if (chatInput) {
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && chatInput.value.trim() !== "") {
      const userMsg = chatInput.value.trim();
      addChatMessage(userMsg, "user");
      chatInput.value = "";

      // fake AI reply
      setTimeout(() => {
        addChatMessage("Something hot,prolly", "ai");
      }, 600);
    }
  });
}
