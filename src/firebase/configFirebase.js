// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBraNjvIYU65cEY_SNmQuVEMGXj_vJkMvU",
    authDomain: "mass-e2d63.firebaseapp.com",
    projectId: "mass-e2d63",
    storageBucket: "mass-e2d63.appspot.com",
    messagingSenderId: "896870017079",
    appId: "1:896870017079:web:852d76fe8fd0da379837b2",
    measurementId: "G-7NSNG8K11N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // auth is the firebase auth object
export const db = getFirestore(app); // db is the firebase firestore object 
export const storage = getStorage(app);
export const usersCollection = collection(db, 'users'); // users is the collection of users in firestore
export const modulesCollection = collection(db, 'modules'); // modules is the collection of modules in firestore
export const timestamp = serverTimestamp();

