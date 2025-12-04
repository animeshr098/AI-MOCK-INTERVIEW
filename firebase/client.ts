// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC9mirxjdF30jj5rc2A-bAfE2zgaf9vD4A",
    authDomain: "prepwise-a30f9.firebaseapp.com",
    projectId: "prepwise-a30f9",
    storageBucket: "prepwise-a30f9.firebasestorage.app",
    messagingSenderId: "311249433396",
    appId: "1:311249433396:web:bf46f36d9130de99996b61",
    measurementId: "G-0N9SKWVM65"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const dp = getFirestore(app);