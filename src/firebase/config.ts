// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Sua configuração do Firebase
// IMPORTANTE: Substitua pelos seus próprios dados de configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBCVsehfous8Auecx3xCo_rF6FenbUTmnA",
  authDomain: "ourbit-64784.firebaseapp.com",
  projectId: "ourbit-64784",
  storageBucket: "ourbit-64784.firebasestorage.app",
  messagingSenderId: "249875234932",
  appId: "1:249875234932:web:1731bf795a0c617e2f9121",
  measurementId: "G-S8BV62KP3Q",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços necessários
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
