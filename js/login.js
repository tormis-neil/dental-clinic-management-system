/**
 * login.js - User Authentication Module
 *
 * Handles user login with enhanced security features and accessibility.
 *
 * Features:
 * - Form validation with specific error messages
 * - Remember me functionality (username only, secure)
 * - Accessible password toggle and Caps Lock warning
 * - Loading states and user feedback
 * - Mobile device warning
 *
 * Security Notes:
 * - Test credentials: manager/manager123, staff/staff123
 * - In production, replace with backend API authentication
 * - Never store passwords in localStorage
 *
 * @author Kit & Dom's Dental Clinic
 * @version 1.1
 * @date 2025-10-31
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const usernameEl = document.getElementById('username');
  const passwordEl = document.getElementById('password');
  const btn = document.getElementById('loginBtn');
  const btnText = document.getElementById('btnText');
  const spinner = document.getElementById('spinner');
  const check = document.getElementById('checkmark');
  const errorMessage = document.getElementById('errorMessage');
  const errorText = document.getElementById('errorText');
  const rememberEl = document.getElementById('rememberMe');
  const capsWarning = document.getElementById('capsWarning');
  const togglePassword = document.getElementById('togglePassword');
  const mobileWarning = document.getElementById('mobileWarning');
  const dismissMobileWarning = document.getElementById('dismissMobileWarning');

  // Pre-fill username if remembered
  const remembered = localStorage.getItem('clinic_remember_username');
  if (remembered) {
    usernameEl.value = remembered;
    rememberEl.checked = true;
  }

  // Mobile warning behavior: allow user to dismiss
  if (window.innerWidth < 1024) {
    mobileWarning.setAttribute('aria-hidden', 'false');
  } else {
    mobileWarning.setAttribute('aria-hidden', 'true');
  }
  dismissMobileWarning?.addEventListener('click', () => {
    mobileWarning.setAttribute('aria-hidden', 'true');
  });

  // CapsLock indicator
  passwordEl.addEventListener('keyup', (e) => {
    const on = e.getModifierState && e.getModifierState('CapsLock');
    capsWarning.style.display = on ? 'block' : 'none';
  });

  // Accessible password toggle
  togglePassword.addEventListener('click', () => {
    const isPassword = passwordEl.type === 'password';
    passwordEl.type = isPassword ? 'text' : 'password';
    togglePassword.setAttribute('aria-pressed', String(isPassword));
    togglePassword.focus();
  });

  // Test credentials for development (replace with backend API in production)
  // Available users: manager/manager123, staff/staff123
  const demoUsers = {
    'manager': { password: 'manager123', role: 'manager', name: 'Dr. Maria Santos' },
    'staff': { password: 'staff123', role: 'staff', name: 'Carla Reyes' }
  };

  // Form submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const username = usernameEl.value.trim();
    const password = passwordEl.value;

    // Enhanced validation with specific messages
    if (!username && !password) {
      showError('Please enter your username and password.');
      usernameEl.classList.add('error');
      passwordEl.classList.add('error');
      return;
    }
    if (!username) {
      showError('Username is required.');
      usernameEl.classList.add('error');
      return;
    }
    if (!password) {
      showError('Password is required.');
      passwordEl.classList.add('error');
      return;
    }

    // UI: loading
    btn.disabled = true;
    btnText.textContent = 'Logging in...';
    spinner.classList.add('show');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Check test credentials
      const user = demoUsers[username];

      if (user && user.password === password) {
        // Handle remember-me (store username only)
        if (rememberEl.checked) {
          localStorage.setItem('clinic_remember_username', username);
        } else {
          localStorage.removeItem('clinic_remember_username');
        }

        // Store user session
        sessionStorage.setItem('clinic_user', JSON.stringify({
          username,
          role: user.role,
          name: user.name
        }));

        spinner.classList.remove('show');
        btnText.textContent = 'Success!';
        check.classList.add('show');
        btn.classList.add('success');

        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '../pages/dashboard.html';
        }, 600);
      } else {
        throw new Error('Invalid username or password. Please try again.');
      }
    } catch (err) {
      // Friendly error with recovery
      spinner.classList.remove('show');
      btn.disabled = false;
      btnText.textContent = 'Log In';
      showError(err.message || 'Unable to log in. Please check your credentials and try again.');
    }
  });

  function showError(message) {
    errorText.textContent = message;
    errorMessage.hidden = false;
    errorMessage.setAttribute('role', 'alert');
  }

  function clearError() {
    errorMessage.hidden = true;
    errorText.textContent = '';
    usernameEl.classList.remove('error');
    passwordEl.classList.remove('error');
  }
});
