// Firebase configuration and initialization
// Replace the placeholder strings with your actual Firebase project configuration.
// See https://console.firebase.google.com/ to obtain your project settings.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

// Update the following configuration with your actual Firebase project settings.
// These values are taken from the Firebase console after creating a web app.
const firebaseConfig = {
  apiKey: "AIzaSyB9Za020eM40OAt9r3NN2nArDBmWgsXyHg",
  authDomain: "web502-portfolio-project.firebaseapp.com",
  projectId: "web502-portfolio-project",
  storageBucket: "web502-portfolio-project.firebasestorage.app",
  messagingSenderId: "1048854933962",
  appId: "1:1048854933962:web:af8712e74c29c2cf1b5f33",
  measurementId: "G-80BMH2LV9F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };