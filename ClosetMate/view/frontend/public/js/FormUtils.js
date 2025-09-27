// ===========================
// FormUtils.js (Updated)
// ===========================
const FormUtils = {
  // Email validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return { isValid: false, message: "Email is required" };
    if (!emailRegex.test(email)) return { isValid: false, message: "Enter a valid email address" };
    return { isValid: true };
  },

  // Password validation (basic rules, can be extended)
  validatePassword(password) {
    if (!password) return { isValid: false, message: "Password is required" };
    if (password.length < 6) return { isValid: false, message: "Password must be at least 6 characters" };
    return { isValid: true };
  },

  // Show and clear error messages
  showError(fieldId, message) {
    const errorEl = document.getElementById(`${fieldId}Error`);
    if (errorEl) errorEl.textContent = message;
  },
  clearError(fieldId) {
    const errorEl = document.getElementById(`${fieldId}Error`);
    if (errorEl) errorEl.textContent = "";
  },

  // Simulated login (fake delay)
  async simulateLogin(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "test@example.com" && password === "password123") {
          resolve("Login success");
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 1000);
    });
  },

  // ===========================
  // 🔑 Password Toggle
  // ===========================
  setupPasswordToggle(input, toggleBtn) {
    const eyeIcon = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>`;
    const eyeOffIcon = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8
        a21.77 21.77 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4
        c7 0 11 8 11 8a21.77 21.77 0 0 1-5.06 5.94M9.9 4.24L4.22 9.92
        m15.56 0l-5.68 5.68M1 1l22 22"/>
      </svg>`;

    // Initial state
    toggleBtn.innerHTML = eyeIcon;

    toggleBtn.addEventListener("click", () => {
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      toggleBtn.innerHTML = isHidden ? eyeOffIcon : eyeIcon;
    });
  },
  initPasswordToggles() {
    document.querySelectorAll(".password-group").forEach(group => {
      const input = group.querySelector("input[type='password']");
      const toggleBtn = group.querySelector(".password-toggle");
      if (input && toggleBtn) {
        this.setupPasswordToggle(input, toggleBtn);
      }
    });
  }
};

// Auto-init on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  FormUtils.initPasswordToggles();
});
