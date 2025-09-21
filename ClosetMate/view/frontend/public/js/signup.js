// signup.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('signupEmail');
  const passwordInput = document.getElementById('signupPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const passwordToggle = document.getElementById('signupPasswordToggle');
  const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
  const submitButton = form.querySelector('.login-btn');
  const successMessage = document.getElementById('signupSuccessMessage');

  // Setup floating labels
  FormUtils.setupFloatingLabels(form);

  // Setup password toggles
  FormUtils.setupPasswordToggle(passwordInput, passwordToggle);
  FormUtils.setupPasswordToggle(confirmPasswordInput, confirmPasswordToggle);

  // Username validation
  usernameInput.addEventListener('blur', () => {
    if (!usernameInput.value.trim()) {
      FormUtils.showError('username', 'Username is required');
    } else {
      FormUtils.clearError('username');
    }
  });

  // Email validation
  emailInput.addEventListener('blur', () => {
    const result = FormUtils.validateEmail(emailInput.value.trim());
    if (!result.isValid) {
      FormUtils.showError('signupEmail', result.message);
    } else {
      FormUtils.clearError('signupEmail');
    }
  });

  // Password validation
  passwordInput.addEventListener('blur', () => {
    const result = FormUtils.validatePassword(passwordInput.value);
    if (!result.isValid) {
      FormUtils.showError('signupPassword', result.message);
    } else {
      FormUtils.clearError('signupPassword');
    }
  });

  // Confirm password validation
  confirmPasswordInput.addEventListener('blur', () => {
    if (confirmPasswordInput.value !== passwordInput.value) {
      FormUtils.showError('confirmPassword', 'Passwords do not match');
    } else {
      FormUtils.clearError('confirmPassword');
    }
  });

  // Clear errors on input
  [usernameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
    input.addEventListener('input', () => FormUtils.clearError(input.id));
  });

  // Handle form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;

    if (!usernameInput.value.trim()) {
      FormUtils.showError('username', 'Username is required');
      valid = false;
    }
    const emailResult = FormUtils.validateEmail(emailInput.value.trim());
    if (!emailResult.isValid) {
      FormUtils.showError('signupEmail', emailResult.message);
      valid = false;
    }
    const passResult = FormUtils.validatePassword(passwordInput.value);
    if (!passResult.isValid) {
      FormUtils.showError('signupPassword', passResult.message);
      valid = false;
    }
    if (confirmPasswordInput.value !== passwordInput.value) {
      FormUtils.showError('confirmPassword', 'Passwords do not match');
      valid = false;
    }

    if (!valid) return;

    // Add loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;

    try {
      // Fake signup simulation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Hide form and show success
      form.style.display = 'none';
      successMessage.classList.add('show');

      // Optional redirect
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2500);

    } catch (err) {
      FormUtils.showNotification('Signup failed. Please try again.', 'error', form);
    } finally {
      submitButton.classList.remove('loading');
      submitButton.disabled = false;
    }
  });

  // Animate entrance
  FormUtils.addEntranceAnimation(form, 200);
  FormUtils.addSharedAnimations();
});
