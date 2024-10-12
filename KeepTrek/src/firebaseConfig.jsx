// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBPsSOwvzvG5nUFNVO6CNF1mLr_gpuIyhU",
  authDomain: "itinerary-4858c.firebaseapp.com",
  projectId: "itinerary-4858c",
  storageBucket: "itinerary-4858c.appspot.com",
  messagingSenderId: "611035064281",
  appId: "1:611035064281:web:c48ead6fa4d087ee5f1bc8",
  measurementId: "G-VYM5P3ERJH",
};

const app = initializeApp(firebaseConfig);

// Firebase services
export const firestore = getFirestore(app);
export const auth = getAuth(app);
