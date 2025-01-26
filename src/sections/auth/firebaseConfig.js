import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore"; 


const firebaseConfig = {
  apiKey: "AIzaSyBV7xaTrRFU0pG4E_G3HNhIzRdU_JqitKM",
  authDomain: "studentdashboard-e5c60.firebaseapp.com",
  projectId: "studentdashboard-e5c60",
  storageBucket: "studentdashboard-e5c60.firebasestorage.app",
  messagingSenderId: "117771886810",
  appId: "1:117771886810:web:14cb11292d3d8530f3c5e3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export const colRef = collection(db, 'students');

getDocs(colRef).then((snapshot) => {
  console.log(snapshot.docs);
});
