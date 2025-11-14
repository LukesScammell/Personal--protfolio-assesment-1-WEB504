# WEB504 Assessment Two – Firebase Integration (Portfolio Comments)

This repo contains my WEB504 Assessment Two project: a personal portfolio website with a **Firebase-powered comment system**.

The site is a static front end (HTML, CSS, JavaScript) with Firebase used for:

- User authentication (email + password)
- Email verification
- Secure, real-time comments stored in Firestore
- Basic security using reCAPTCHA on registration
- Hosting the live site with Firebase Hosting

---

## 🔍 Overview

The portfolio includes:

- **Home page** – introduction and overview
- **Projects page** – examples of my work
- **Skills page** – technologies and tools I’m familiar with
- **Comments page** – login/register and real-time comment system integrated with Firebase

The Firebase parts of the project are focused on the **Comments** page. Users can:

- Register an account (with email verification and reCAPTCHA)
- Log in and log out
- Post comments in real time
- Edit and delete **only their own** comments

All comments are stored in **Cloud Firestore**, and changes appear immediately on every connected client.

---

## 🧱 Tech Stack

**Frontend**

- HTML5 (semantic structure)
- CSS3 with custom properties (`variables.css`) and shared mixins
- Vanilla JavaScript (no frameworks)

**Backend / Services**

- [Firebase Authentication](https://firebase.google.com/docs/auth) (email/password)
- [Cloud Firestore](https://firebase.google.com/docs/firestore) (NoSQL, real-time database)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Google reCAPTCHA v2](https://developers.google.com/recaptcha/docs/display) on the registration form

---

## 📁 Project Structure

_This may vary slightly, but the core idea is:_

```text
.
├── index.html           # Home
├── projects.html        # Projects
├── skills.html          # Skills
├── contact.html         # Comments (auth + Firestore)
├── variables.css        # Global CSS variables/theme
├── mixins.css           # Shared CSS helpers (if used)
├── firebaseConfig.js    # Firebase SDK initialisation
├── auth.js              # Login / registration / auth state handling
└── comments.js          # Real-time comment system (CRUD + UI)
