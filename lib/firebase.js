import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFj6CUZZK1G7xX0PjCFWikM6qrS7a6eKw",
  authDomain: "love-jar-32c10.firebaseapp.com",
  projectId: "love-jar-32c10",
  storageBucket: "love-jar-32c10.firebasestorage.app",
  messagingSenderId: "335131192754",
  appId: "1:335131192754:web:4427047afc0643548f48ab",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
