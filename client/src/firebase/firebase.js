import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpMVtKefpBn8jC-iKHu9w7cFIW9tnvvCY",
  authDomain: "sewamandala-chat.firebaseapp.com",
  projectId: "sewamandala-chat",
  storageBucket: "sewamandala-chat.firebasestorage.app",
  messagingSenderId: "793124711682",
  appId: "1:793124711682:web:64608b96daa8f4ab77e61b",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);