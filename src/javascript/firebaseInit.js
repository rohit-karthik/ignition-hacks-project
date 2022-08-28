// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { getStorage, ref } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfkzGFDEUJiCJ87lfU7XgF7HjYZTYO0Qw",
  authDomain: "ignition-hacks-3733b.firebaseapp.com",
  projectId: "ignition-hacks-3733b",
  storageBucket: "ignition-hacks-3733b.appspot.com",
  messagingSenderId: "131824543751",
  appId: "1:131824543751:web:c6ecb3a85dd4c4571a62a2",
  measurementId: "G-VD1JLVW8VY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);