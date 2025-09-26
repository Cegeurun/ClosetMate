// login.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const passwordToggle = document.getElementById('passwordToggle');
  const submitButton = form.querySelector('.login-btn');
  const successMessage = document.getElementById('successMessage');

  // Setup floating labels
  FormUtils.setupFloatingLabels(form);

  // Setup password toggle
  FormUtils.setupPasswordToggle(passwordInput, passwordToggle);

  // Validate email on blur
  emailInput.addEventListener('blur', () => {
    const result = FormUtils.validateEmail(emailInput.value.trim());
    if (!result.isValid) {
      FormUtils.showError('email', result.message);
    } else {
      FormUtils.clearError('email');
    }
  });

  // Validate password on blur
  passwordInput.addEventListener('blur', () => {
    const result = FormUtils.validatePassword(passwordInput.value);
    if (!result.isValid) {
      FormUtils.showError('password', result.message);
    } else {
      FormUtils.clearError('password');
    }
  });

  // Clear error while typing
  emailInput.addEventListener('input', () => FormUtils.clearError('email'));
  passwordInput.addEventListener('input', () => FormUtils.clearError('password'));

  // Handle form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailResult = FormUtils.validateEmail(emailInput.value.trim());
    const passResult = FormUtils.validatePassword(passwordInput.value);

    if (!emailResult.isValid) FormUtils.showError('email', emailResult.message);
    if (!passResult.isValid) FormUtils.showError('password', passResult.message);

    if (!emailResult.isValid || !passResult.isValid) return;

    // Add loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;

    try {
      await FormUtils.simulateLogin(emailInput.value, passwordInput.value);

      // Hide the form and show success message
      form.style.display = 'none';
      successMessage.classList.add('show');

      // Optional: redirect after 2.5s
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2500);

    } catch (err) {
      FormUtils.showError('password', err.message);
    } finally {
      submitButton.classList.remove('loading');
      submitButton.disabled = false;
    }
  });

  // Animate form entrance
  FormUtils.addEntranceAnimation(form, 200);
  FormUtils.addSharedAnimations();
});
