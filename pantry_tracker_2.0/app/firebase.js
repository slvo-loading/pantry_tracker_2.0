// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDK9klvcpyD9UodpjYswsGKzuPoBVSgrAY",
  authDomain: "pantry-tracker-2.firebaseapp.com",
  projectId: "pantry-tracker-2",
  storageBucket: "pantry-tracker-2.appspot.com",
  messagingSenderId: "615395227840",
  appId: "1:615395227840:web:9512e8004d0bbcac15d525"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)