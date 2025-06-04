// src/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Sua configuração do Firebase
// IMPORTANTE: Substitua pelos seus próprios dados de configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "SUA_MESSAGING_SENDER_ID",
  appId: "SUA_APP_ID"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços necessários
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
