// settings.js
document.addEventListener("DOMContentLoaded", () => {
  const settings = {
    name: document.getElementById("name"),
    planningRange: document.getElementById("planning-range"),
    aiSuggestions: document.getElementById("ai-suggestions"),
    strictness: document.getElementById("strictness"),
    dailyReminder: document.getElementById("daily-reminder"),
    reminderTime: document.getElementById("reminder-time"),
    eventReminders: document.getElementById("event-reminders"),
    // theme is handled by theme-manager.js globally
  };

  // Load other saved settings
  for (const key in settings) {
    const el = settings[key];
    if (!el) continue;

    const stored = localStorage.getItem(key);
    if (stored !== null) {
      if (el.type === "checkbox") {
        el.checked = stored === "true";
      } else {
        el.value = stored;
      }
    }

    // Save changes
    el.addEventListener("change", () => {
      if (el.type === "checkbox") {
        localStorage.setItem(key, el.checked);
      } else {
        localStorage.setItem(key, el.value);
      }
    });
  }
});
