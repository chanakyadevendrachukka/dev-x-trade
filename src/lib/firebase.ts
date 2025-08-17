import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDQhcCiWBm7e6gAOdPJIHWlN470A9lbNrg",
  authDomain: "devxtrade-1.firebaseapp.com",
  projectId: "devxtrade-1",
  storageBucket: "devxtrade-1.firebasestorage.app",
  messagingSenderId: "909141284813",
  appId: "1:909141284813:web:f73a2435e8787d51019684",
  measurementId: "G-VKNVSX2ZG6"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

export { auth, db };
export default app;
