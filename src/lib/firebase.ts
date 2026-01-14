import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCzA9hX-aE1XURlrB5YJmkWVgJehYOeGMQ",
  authDomain: "quietly-famous.firebaseapp.com",
  projectId: "quietly-famous",
  storageBucket: "quietly-famous.firebasestorage.app",
  messagingSenderId: "819803963004",
  appId: "1:819803963004:web:8ff0442ef3e50ccdcf53f9",
  measurementId: "G-RJ5EGKYCEX"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, googleProvider };
