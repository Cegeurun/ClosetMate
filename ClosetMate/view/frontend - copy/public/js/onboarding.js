// onboarding.js
document.addEventListener('DOMContentLoaded', () => {
  const formCard = document.querySelector('.glass-card');
  const profilePicInput = document.getElementById('profilePic');
  const profilePicPreview = document.getElementById('profilePicPreview');
  const closetUpload = document.getElementById('closetUpload');
  const closetFiles = document.getElementById('closetFiles');
  const nameInput = document.getElementById('name');
  const dobInput = document.getElementById('dob');
  const genderSelect = document.getElementById('gender');
  const saveButton = document.querySelector('.form-actions .neu-button:first-child');

  // Setup floating labels (reuses FormUtils helper)
  FormUtils.setupFloatingLabels(formCard);

  // Profile picture preview
  profilePicInput.addEventListener('change', () => {
    profilePicPreview.innerHTML = '';
    const file = profilePicInput.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Profile Preview';
        profilePicPreview.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });

  // Closet upload filenames
  closetUpload.addEventListener('change', () => {
    if (closetUpload.files.length === 0) {
      closetFiles.textContent = 'No files chosen';
    } else {
      const fileNames = Array.from(closetUpload.files).map(f => f.name).join(', ');
      closetFiles.textContent = fileNames;
    }
  });

  // Save button validation
  saveButton.addEventListener('click', (e) => {
    let valid = true;

    // Validate nickname
    if (!nameInput.value.trim()) {
      FormUtils.showError('name', 'Nickname is required');
      valid = false;
    } else {
      FormUtils.clearError('name');
    }

    // Validate gender
    if (!genderSelect.value) {
      FormUtils.showError('gender', 'Please select your gender');
      valid = false;
    } else {
      FormUtils.clearError('gender');
    }

    if (!valid) {
      e.preventDefault();
      return;
    }

    // Simulate saving data
    const onboardingData = {
      nickname: nameInput.value.trim(),
      dob: dobInput.value,
      gender: genderSelect.value,
    };
    console.log('Onboarding Data:', onboardingData);

    FormUtils.showNotification('Profile saved successfully!', 'success', formCard);
  });

  // Add entrance animation
  FormUtils.addEntranceAnimation(formCard, 150);
  FormUtils.addSharedAnimations();
});
