// firebaseConfig.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // <-- 1. We need to import Auth!
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDN6nPq9v8h8u28bPjiKFYiIyM4Ufdqa60",
  authDomain: "goobly-820e2.firebaseapp.com",
  projectId: "goobly-820e2",
  storageBucket: "goobly-820e2.firebasestorage.app",
  messagingSenderId: "238439190455",
  appId: "1:238439190455:web:43770afd6bbe2779a72232",
  measurementId: "G-Q56PDLZ9ZL"
};

// 2. Next.js Hot-Reload Fix
// Next.js constantly re-runs files while you are coding. 
// This prevents Firebase from crashing by checking if it's already running first.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 3. Export Authentication so your Modals can use it
export const auth = getAuth(app);
export const db = getFirestore(app);