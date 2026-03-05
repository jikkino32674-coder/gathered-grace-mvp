import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  type User,
} from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';

// Firebase config — same as src/lib/firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyB7IX34NXPZ0KLq3PQ2Xd2lExJnr__gr7g",
  authDomain: "gatheredgraceb2c.firebaseapp.com",
  projectId: "gatheredgraceb2c",
  storageBucket: "gatheredgraceb2c.firebasestorage.app",
  messagingSenderId: "199677622518",
  appId: "1:199677622518:web:566f14ebb8e003c67954d7",
  measurementId: "G-HJLCBGN6Z2"
};

// Reuse existing app if already initialized
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, type User };

export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signOut = () => fbSignOut(auth);

export const onAuthStateChanged = (callback: (user: User | null) => void) =>
  fbOnAuthStateChanged(auth, callback);

export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
};
