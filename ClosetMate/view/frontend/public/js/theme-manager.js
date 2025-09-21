// theme-manager.js
document.addEventListener("DOMContentLoaded", () => {
  const themes = ["theme-default", "theme-midnight", "theme-ivory", "theme-earth"];

  function applyTheme(theme) {
    document.documentElement.classList.remove(...themes);
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }

  // Load saved theme (or default)
  const savedTheme = localStorage.getItem("theme") || "theme-default";
  applyTheme(savedTheme);

  // Hook dropdown if present (Settings page)
  const themeSelect = document.getElementById("theme");
  if (themeSelect) {
    themeSelect.value = savedTheme;
    themeSelect.addEventListener("change", (e) => applyTheme(e.target.value));
  }
});
