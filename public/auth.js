// Authentication logic for login, registration, Google registration, and sign out.
// IMPORTANT: Must be a RELATIVE import (./ NOT / )
import { auth } from './firebaseConfig.js';

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

// Google provider (for "Register with Google")
const googleProvider = new GoogleAuthProvider();

// Utility functions
function showEl(el) {
  if (el) el.style.display = '';
}
function hideEl(el) {
  if (el) el.style.display = 'none';
}

export function initAuthUI() {
  const loginForm = document.querySelector('#login-form');
  const registerForm = document.querySelector('#register-form');
  const toggleToRegister = document.querySelector('#show-register');
  const toggleToLogin = document.querySelector('#show-login');
  const authContainer = document.querySelector('#auth-container');
  const userInfo = document.querySelector('#user-info');
  const googleRegisterBtn = document.querySelector('#google-register');
  const logoutBtn = document.querySelector('#logout-btn');

  // FORM TOGGLE (login <-> register)
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

  // ⭐ GOOGLE REGISTRATION BUTTON ⭐
  if (googleRegisterBtn) {
    googleRegisterBtn.addEventListener('click', async () => {
      try {
        await signInWithPopup(auth, googleProvider);
        // Google accounts ALWAYS have emailVerified = true
      } catch (err) {
        console.error('Google registration error:', err);
        alert('Google registration failed: ' + err.message);
      }
    });
  }

  // ⭐ EMAIL + PASSWORD REGISTRATION ⭐
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = registerForm.querySelector('input[name="email"]').value;
      const password = registerForm.querySelector('input[name="password"]').value;
      const confirm = registerForm.querySelector('input[name="confirm"]').value;
      const captchaResponse = grecaptcha.getResponse();
      const messageEl = registerForm.querySelector('.message');

      // CAPTCHA check
      if (!captchaResponse) {
        messageEl.textContent = "Please complete the CAPTCHA.";
        return;
      }

      // Password match check
      if (password !== confirm) {
        messageEl.textContent = 'Passwords do not match.';
        return;
      }

      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(cred.user);

        messageEl.textContent =
          'Registration successful! A verification email has been sent.';

        registerForm.reset();
        grecaptcha.reset();

      } catch (err) {
        messageEl.textContent = err.message;
      }
    });
  }

  // ⭐ EMAIL + PASSWORD LOGIN ⭐
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
        messageEl.textContent = err.message;
      }
    });
  }

  // ⭐ SIGN OUT ⭐
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await signOut(auth);
    });
  }

  // ⭐ AUTH STATE LISTENER ⭐
  onAuthStateChanged(auth, (user) => {
    if (user) {
      hideEl(authContainer);

      if (userInfo) {
        userInfo.innerHTML = `
          <span class="email">${user.email}</span>
          <button id="logout-btn" type="button">Sign out</button>
        `;

        const logoutButton = userInfo.querySelector('#logout-btn');
        if (logoutButton) {
          logoutButton.addEventListener('click', async () => await signOut(auth));
        }

        showEl(userInfo);
      }

    } else {
      showEl(authContainer);
      hideEl(userInfo);
    }

    // Notify comments.js that auth changed
    document.dispatchEvent(new CustomEvent("authChanged", { detail: { user } }));
  });
}

initAuthUI();
