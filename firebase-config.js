const firebaseConfig = {
  apiKey: "AIzaSyDylaym85cTkafDl5OitpEZKrUuwwJHn_w",
  authDomain: "tictactoe-5ba18.firebaseapp.com",
  projectId: "tictactoe-5ba18",
  storageBucket: "tictactoe-5ba18.firebasestorage.app",
  messagingSenderId: "23885470883",
  appId: "1:23885470883:web:3289b4378c236767a47316",
  measurementId: "G-Y87Y2WPMEW"
};
// Firebase SDK v10 (modular, CDN)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
