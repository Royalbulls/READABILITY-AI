import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc, 
  writeBatch,
  limit
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { InputHistoryItem } from "../types";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = (firebaseConfig as any).firestoreDatabaseId 
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Enable Google provider custom parameters if needed
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export type { User };

// Firestore Helper Functions for History Logs
export async function fetchUserHistory(userId: string): Promise<InputHistoryItem[]> {
  try {
    const historyRef = collection(db, "history");
    const q = query(
      historyRef,
      where("userId", "==", userId),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    const items: InputHistoryItem[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: data.id,
        title: data.title || "Clarity Log",
        originalText: data.originalText || "",
        simplifiedText: data.simplifiedText || "",
        mode: data.mode || "default",
        timestamp: data.timestamp || Date.now(),
        imageAttached: data.imageAttached || false,
        imageData: data.imageData || undefined,
        imageMimeType: data.imageMimeType || undefined
      });
    });
    
    // Sort in memory descending by timestamp
    items.sort((a, b) => b.timestamp - a.timestamp);
    
    return items;
  } catch (error) {
    console.error("Error fetching user history from Firestore:", error);
    throw error;
  }
}

export async function saveUserHistoryItem(userId: string, item: InputHistoryItem): Promise<void> {
  try {
    const docId = `${userId}_${item.id}`;
    const docRef = doc(db, "history", docId);
    await setDoc(docRef, {
      ...item,
      userId,
      updatedAt: Date.now()
    });
  } catch (error) {
    console.error("Error saving history item to Firestore:", error);
    throw error;
  }
}

export async function saveUserHistoryItemsBatch(userId: string, items: InputHistoryItem[]): Promise<void> {
  if (items.length === 0) return;
  try {
    const batch = writeBatch(db);
    items.forEach((item) => {
      const docId = `${userId}_${item.id}`;
      const docRef = doc(db, "history", docId);
      batch.set(docRef, {
        ...item,
        userId,
        updatedAt: Date.now()
      });
    });
    await batch.commit();
  } catch (error) {
    console.error("Error batch saving history items to Firestore:", error);
    throw error;
  }
}

export async function deleteUserHistoryItem(userId: string, itemId: string): Promise<void> {
  try {
    const docId = `${userId}_${itemId}`;
    const docRef = doc(db, "history", docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting history item from Firestore:", error);
    throw error;
  }
}

export async function clearUserHistory(userId: string, items: InputHistoryItem[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    items.forEach((item) => {
      const docId = `${userId}_${item.id}`;
      const docRef = doc(db, "history", docId);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (error) {
    console.error("Error clearing user history from Firestore:", error);
    throw error;
  }
}

