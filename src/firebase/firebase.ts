import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDG0hncxeKSoZRmpI6mGOWYdg0U8K6xhUk",

  authDomain: "todo-app-75b5d.firebaseapp.com",

  projectId: "todo-app-75b5d",

  storageBucket: "todo-app-75b5d.firebasestorage.app",

  messagingSenderId: "979052506599",

  appId: "1:979052506599:web:c11f37fd8f9679ed2c6142",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);