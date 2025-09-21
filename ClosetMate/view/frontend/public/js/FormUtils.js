// Neumorphism Login Form JavaScript (Refactored with FormUtils)
class NeumorphismLoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.submitButton = this.form.querySelector('.login-btn');
        this.successMessage = document.getElementById('successMessage');
        this.socialButtons = document.querySelectorAll('.neu-social');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupPasswordToggle();
        this.setupSocialButtons();
        this.setupNeumorphicEffects();
        FormUtils.addSharedAnimations(); // load shared keyframes
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.emailInput.addEventListener('input', () => FormUtils.clearError('email'));
        this.passwordInput.addEventListener('input', () => FormUtils.clearError('password'));
        
        // Soft press on focus/blur
        [this.emailInput, this.passwordInput].forEach(input => {
            input.addEventListener('focus', (e) => this.addSoftPress(e));
            input.addEventListener('blur', (e) => this.removeSoftPress(e));
        });
    }
    
    setupPasswordToggle() {
        FormUtils.setupPasswordToggle(this.passwordInput, this.passwordToggle);
    }
    
    setupSocialButtons() {
        this.socialButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.animateSoftPress(button);
                let provider = 'Social';
                const svgPath = button.querySelector('svg path')?.getAttribute('d') || '';
                if (svgPath.includes('22.56')) provider = 'Google';
                else if (svgPath.includes('github')) provider = 'GitHub';
                else if (svgPath.includes('23.953')) provider = 'Twitter';
                this.handleSocialLogin(provider, button);
            });
        });
    }
    
    setupNeumorphicEffects() {
        const neuElements = document.querySelectorAll('.neu-icon, .neu-checkbox, .neu-social');
        neuElements.forEach(element => {
            element.addEventListener('mouseenter', () => element.style.transform = 'scale(1.05)');
            element.addEventListener('mouseleave', () => element.style.transform = 'scale(1)');
        });
        
        document.addEventListener('mousemove', (e) => this.updateAmbientLight(e));
    }
    
    updateAmbientLight(e) {
        const card = document.querySelector('.glass-card');
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const angleX = (x - rect.width / 2) / (rect.width / 2);
        const angleY = (y - rect.height / 2) / (rect.height / 2);
        
        const shadowX = angleX * 30;
        const shadowY = angleY * 30;
        
        card.style.boxShadow = `
            ${shadowX}px ${shadowY}px 60px #bec3cf,
            ${-shadowX}px ${-shadowY}px 60px #ffffff
        `;
    }
    
    addSoftPress(e) {
        const inputGroup = e.target.closest('.neu-input');
        if (inputGroup) inputGroup.style.transform = 'scale(0.98)';
    }
    
    removeSoftPress(e) {
        const inputGroup = e.target.closest('.neu-input');
        if (inputGroup) inputGroup.style.transform = 'scale(1)';
    }
    
    animateSoftPress(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => element.style.transform = 'scale(1)', 150);
    }
    
    validateEmail() {
        const result = FormUtils.validateEmail(this.emailInput.value.trim());
        if (!result.isValid) {
            FormUtils.showError('email', result.message);
            return false;
        }
        FormUtils.clearError('email');
        return true;
    }
    
    validatePassword() {
        const result = FormUtils.validatePassword(this.passwordInput.value);
        if (!result.isValid) {
            FormUtils.showError('password', result.message);
            return false;
        }
        FormUtils.clearError('password');
        return true;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        if (!isEmailValid || !isPasswordValid) {
            this.animateSoftPress(this.submitButton);
            return;
        }
        
        this.setLoading(true);
        
        try {
            await FormUtils.simulateLogin(this.emailInput.value, this.passwordInput.value);
            this.showNeumorphicSuccess();
        } catch (error) {
            FormUtils.showError('password', error.message);
        } finally {
            this.setLoading(false);
        }
    }
    
    async handleSocialLogin(provider, button) {
        console.log(`Initiating ${provider} login...`);
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.7';
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log(`Redirecting to ${provider} authentication...`);
        } catch (error) {
            console.error(`${provider} authentication failed: ${error.message}`);
        } finally {
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
        }
    }
    
    setLoading(loading) {
        this.submitButton.classList.toggle('loading', loading);
        this.submitButton.disabled = loading;
        this.socialButtons.forEach(button => {
            button.style.pointerEvents = loading ? 'none' : 'auto';
            button.style.opacity = loading ? '0.6' : '1';
        });
    }
    
    showNeumorphicSuccess() {
        this.form.style.transform = 'scale(0.95)';
        this.form.style.opacity = '0';
        
        setTimeout(() => {
            this.form.style.display = 'none';
            document.querySelector('.social-login')?.style.display = 'none';
            document.querySelector('.signup-link')?.style.display = 'none';
            this.successMessage.classList.add('show');
            const successIcon = this.successMessage.querySelector('.neu-icon');
            if (successIcon) successIcon.style.animation = 'successPulse 0.6s ease-out';
        }, 300);
        
        setTimeout(() => {
            console.log('Redirecting to dashboard...');
        }, 2500);
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    new NeumorphismLoginForm();
});
