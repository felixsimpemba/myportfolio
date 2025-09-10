import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCALT6ztSbLycoQuPD99HPK-LlWjMMIWX8",
    authDomain: "feltech-347cc.firebaseapp.com",
    projectId: "feltech-347cc",
    storageBucket: "feltech-347cc.firebasestorage.app",
    messagingSenderId: "66496542531",
    appId: "1:66496542531:web:c6eb6f6a6dc3f7c45761f6",
    measurementId: "G-2WSPMMW0LH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app, "gs://feltech-347cc.firebasestorage.app");

export default app;
