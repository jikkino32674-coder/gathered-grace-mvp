import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB7IX34NXPZ0KLq3PQ2Xd2lExJnr__gr7g",
  authDomain: "gatheredgraceb2c.firebaseapp.com",
  projectId: "gatheredgraceb2c",
  storageBucket: "gatheredgraceb2c.firebasestorage.app",
  messagingSenderId: "199677622518",
  appId: "1:199677622518:web:566f14ebb8e003c67954d7",
  measurementId: "G-HJLCBGN6Z2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Helper function to add a lead to Firestore
export interface B2CLeadData {
  email: string;
  full_name?: string | null;
  lead_type: string;
  source_page: string;
  website_type: string;
  metadata?: Record<string, any>;
}

export async function addB2CLead(leadData: B2CLeadData) {
  try {
    const docRef = await addDoc(collection(db, 'b2c_leads'), {
      ...leadData,
      created_at: serverTimestamp(),
    });
    return { data: { id: docRef.id }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
