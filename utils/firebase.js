import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; //for realtime db

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiTGgbF6vNWDNUnGpZJKGagDsXuHzc_0Y",
  authDomain: "pomo-chat.firebaseapp.com",
  databaseURL: "https://pomo-chat-default-rtdb.firebaseio.com",
  projectId: "pomo-chat",
  storageBucket: "pomo-chat.appspot.com",
  messagingSenderId: "825520820523",
  appId: "1:825520820523:web:e7874df4c4ee487a6c356e",
  measurementId: "G-HLSNYF64JL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);

export { db };
