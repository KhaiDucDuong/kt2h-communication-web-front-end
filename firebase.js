// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // Import getStorage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTYBUJvKbmQJOjnC6L6CN9fa13Urn4LfA",
  authDomain: "hkt-e0d9b.firebaseapp.com",
  projectId: "hkt-e0d9b",
  storageBucket: "hkt-e0d9b.appspot.com",
  messagingSenderId: "5813413779",
  appId: "1:5813413779:web:de1f6119aa9af556f4ea66",
  measurementId: "G-2Z0STPQYVH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app); // Initialize storage

export { app, storage }; // Export app and storage for use in other files

