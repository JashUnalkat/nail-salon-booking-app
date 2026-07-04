import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";       // Add this
import { getFirestore } from "firebase/firestore"; // Add this

const firebaseConfig = {
  apiKey: "AIzaSyCcaK-nU_651KOpJrwGbWs-zkAb3RwDtjc",
  authDomain: "info-5143-major-project.firebaseapp.com",
  projectId: "info-5143-major-project",
  storageBucket: "info-5143-major-project.firebasestorage.app",
  messagingSenderId: "925726022942",
  appId: "1:925726022942:web:839126f64be5dcbc52fd0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);           // Export this
export const db = getFirestore(app);        // Export this