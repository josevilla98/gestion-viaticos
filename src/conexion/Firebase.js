// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from '@firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDda-MEupgpyBDer1mns0ySsZdnYoDi6Ew",
  authDomain: "control-viaticos-206eb.firebaseapp.com",
  projectId: "control-viaticos-206eb",
  storageBucket: "control-viaticos-206eb.firebasestorage.app",
  messagingSenderId: "68687142827",
  appId: "1:68687142827:web:facf18d52792445136bcee",
  measurementId: "G-BGD3BYL21G"
};

// Initialize Firebase jkdf
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app);
