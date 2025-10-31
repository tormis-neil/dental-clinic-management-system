/* login.js
   Production-ready frontend login behavior.
   - Replaced hardcoded credentials with fetch() to backend API (/api/auth/login)
   - "Remember me" persists username only (NOT password)
   - Accessible password toggle and CapsLock warning
   - Expects backend to set secure httpOnly cookie or return token for client storage
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

  // Form submit (POST to backend)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const username = usernameEl.value.trim();
    const password = passwordEl.value;

    if (!username || !password) {
      showFieldErrors(!username, !password);
      return;
    }

    // UI: loading
    btn.disabled = true;
    btnText.textContent = 'Logging in...';
    spinner.classList.add('show');

    try {
      // IMPORTANT: ensure backend serves this endpoint over HTTPS and sets secure cookies/CSRF as needed.
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include', // allow server to set httpOnly cookie if implemented
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!resp.ok) {
        // server returned 4xx/5xx
        const text = await safeJsonText(resp);
        throw new Error(text || `Server returned ${resp.status}`);
      }

      const data = await resp.json();

      if (data && data.success) {
        // Handle remember-me (store username only)
        if (rememberEl.checked) {
          localStorage.setItem('clinic_remember_username', username);
        } else {
          localStorage.removeItem('clinic_remember_username');
        }

        // Backend should set a secure, httpOnly session cookie or return a short-lived token.
        // If server returns a token and you must store it client-side (less secure), do so carefully.
        // Example: if data.token received and your security model requires localStorage token:
        // localStorage.setItem('clinic_auth_token', data.token);

        spinner.classList.remove('show');
        btnText.textContent = 'Success';
        check.classList.add('show');
        btn.classList.add('success');

        // redirect based on server suggestion or role
        const redirect = data.redirect || (data.role === 'manager' ? '/manager/dashboard' : '/dashboard');
        setTimeout(() => {
          window.location.href = redirect;
        }, 600);
      } else {
        // Login failed (bad credentials, locked, etc.)
        const message = (data && data.message) ? data.message : 'Invalid username or password.';
        throw new Error(message);
      }
    } catch (err) {
      // friendly error
      spinner.classList.remove('show');
      btn.disabled = false;
      btnText.textContent = 'Log In';
      showError(err.message || 'Login failed. Please try again.');
    }
  });

  function showFieldErrors(usernameMissing, passwordMissing) {
    if (usernameMissing) usernameEl.classList.add('error');
    if (passwordMissing) passwordEl.classList.add('error');
    showError('Please fill out required fields.');
  }

  function showError(message) {
    errorText.textContent = message;
    errorMessage.hidden = false;
  }

  function clearError() {
    errorMessage.hidden = true;
    errorText.textContent = '';
    usernameEl.classList.remove('error');
    passwordEl.classList.remove('error');
  }

  async function safeJsonText(response) {
    try {
      const t = await response.text();
      // try parse JSON message if available
      try { const j = JSON.parse(t); return j.message || t; } catch { return t; }
    } catch { return null; }
  }
});
