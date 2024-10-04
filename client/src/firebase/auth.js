// src/firebase/auth.js

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from './config'; // Import Firebase config from config.js

// Initialize Firebase app and services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Sign in anonymously using Firebase Authentication.
 * Once signed in, it will store the user info in Firestore.
 */
export const signInAnon = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;

    // Save anonymous user to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      createdAt: new Date(),
    });

    console.log('User signed in anonymously:', user);
    return user;
  } catch (error) {
    console.error('Error during anonymous sign-in:', error);
  }
};

/**
 * Monitor the authentication state and handle changes.
 * @param {Function} callback - Function to execute when auth state changes.
 */
export const monitorAuthState = (callback) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User is signed in:', user);
      callback(user);
    } else {
      console.log('No user is signed in.');
      callback(null);
    }
  });
};
