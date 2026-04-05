import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCDHvPHNg3DA6zhNfzKHDs0qb6t98DQ8LQ",
  authDomain: "grmcai.firebaseapp.com",
  projectId: "grmcai",
  storageBucket: "grmcai.firebasestorage.app",
  messagingSenderId: "479753943982",
  appId: "1:479753943982:web:2979cd72b2d35e30d0263f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
