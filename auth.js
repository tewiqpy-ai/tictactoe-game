import { auth, db, googleProvider } from './firebase-config.js';
import { onAuthStateChanged, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

let currentUser = null;

function initAuth() {
  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    updateAuthUI();
    window.dispatchEvent(new CustomEvent('authchange', { detail: { user } }));
    if (user) {
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: serverTimestamp()
        });
      }
    }
  });
}

function updateAuthUI() {
  const container = document.getElementById('auth-container');
  if (!container) return;

  if (currentUser) {
    const photo = currentUser.photoURL || '';
    container.innerHTML = `
      <div class="auth-avatar" id="auth-avatar">
        <img src="${photo}" alt="avatar" referrerpolicy="no-referrer">
        <div class="auth-dropdown" id="auth-dropdown">
          <div class="auth-dropdown-name">${currentUser.displayName || ''}</div>
          <div class="auth-dropdown-email">${currentUser.email || ''}</div>
          <button class="auth-dropdown-btn" id="auth-logout">Выйти</button>
        </div>
      </div>
    `;
    document.getElementById('auth-logout').addEventListener('click', handleLogout);
    document.getElementById('auth-avatar').addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('auth-dropdown').classList.toggle('open');
    });
    document.addEventListener('click', () => {
      const dd = document.getElementById('auth-dropdown');
      if (dd) dd.classList.remove('open');
    });
  } else {
    container.innerHTML = `
      <button class="auth-login-btn" id="auth-login">Войти</button>
    `;
    document.getElementById('auth-login').addEventListener('click', handleLogin);
  }
}

async function handleLogin() {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (e) {
    console.error('Login error:', e);
  }
}

async function handleLogout() {
  await signOut(auth);
}

function getCurrentUser() {
  return currentUser;
}

export { initAuth, getCurrentUser };
