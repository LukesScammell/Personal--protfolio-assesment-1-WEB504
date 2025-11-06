// Authentication logic for login, registration and sign out.
import { auth } from './firebaseConfig.js';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

// Utility to show/hide UI elements
function showEl(el) {
  if (el) el.style.display = '';
}
function hideEl(el) {
  if (el) el.style.display = 'none';
}

// Initialize authentication listeners
export function initAuthUI() {
  // Forms and containers may not exist on every page.
  const loginForm = document.querySelector('#login-form');
  const registerForm = document.querySelector('#register-form');
  const toggleToRegister = document.querySelector('#show-register');
  const toggleToLogin = document.querySelector('#show-login');
  const authContainer = document.querySelector('#auth-container');
  const userInfo = document.querySelector('#user-info');
  const logoutBtn = document.querySelector('#logout-btn');

  // Toggle between login and registration forms
  if (toggleToRegister) {
    toggleToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      hideEl(loginForm);
      showEl(registerForm);
    });
  }
  if (toggleToLogin) {
    toggleToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      hideEl(registerForm);
      showEl(loginForm);
    });
  }

  // Register user
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = registerForm.querySelector('input[name="email"]').value;
      const password = registerForm.querySelector('input[name="password"]').value;
      const confirm = registerForm.querySelector('input[name="confirm"]').value;
      const messageEl = registerForm.querySelector('.message');
      if (password !== confirm) {
        if (messageEl) messageEl.textContent = 'Passwords do not match.';
        return;
      }
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(cred.user);
        if (messageEl) {
          messageEl.textContent =
            'Registration successful! A verification email has been sent.';
        }
        // Reset form
        registerForm.reset();
      } catch (err) {
        if (messageEl) messageEl.textContent = err.message;
      }
    });
  }

  // Log in user
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('input[name="email"]').value;
      const password = loginForm.querySelector('input[name="password"]').value;
      const messageEl = loginForm.querySelector('.message');
      try {
        await signInWithEmailAndPassword(auth, email, password);
        loginForm.reset();
      } catch (err) {
        if (messageEl) messageEl.textContent = err.message;
      }
    });
  }

  // Sign out
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await signOut(auth);
    });
  }

  // Listen for auth state changes
  onAuthStateChanged(auth, (user) => {
    // Update UI based on user's authentication state
    if (user) {
      // Hide auth forms
      hideEl(authContainer);
      // Show user info
      if (userInfo) {
        userInfo.innerHTML = `
          <span class="email">${user.email}</span>
          <button id="logout-btn" type="button">Sign out</button>
        `;
        // Re-attach logout handler for dynamically inserted button
        const logoutButton = userInfo.querySelector('#logout-btn');
        if (logoutButton) {
          logoutButton.addEventListener('click', async () => {
            await signOut(auth);
          });
        }
        userInfo.style.display = '';
      }
    } else {
      // Not logged in: show forms and hide user info
      showEl(authContainer);
      if (userInfo) hideEl(userInfo);
    }
    // Dispatch custom event so other modules can react
    document.dispatchEvent(new CustomEvent('authChanged', { detail: { user } }));
  });
}

// Immediately call init when this module is imported
initAuthUI();