// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importar Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC26erOKmGGgUcdiQmQyDT9aQwOmAdkN-s",
  authDomain: "pruebas-8d4a1.firebaseapp.com",
  projectId: "pruebas-8d4a1",
  storageBucket: "pruebas-8d4a1.appspot.com",
  messagingSenderId: "310106250145",
  appId: "1:310106250145:web:ae6568acc7c629772389e0",
  measurementId: "G-V06BMSDZ8T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Inicializar Firestore

export default db; // Exportar la instancia de Firestore
