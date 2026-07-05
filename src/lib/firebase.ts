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
import { InputHistoryItem, SavedProject } from "../types";

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

// ==========================================
// CLIENT-SIDE SAVED PROJECTS INTERACTION CORES
// ==========================================

export async function fetchUserProjects(userId: string): Promise<SavedProject[]> {
  try {
    const projectsRef = collection(db, "projects");
    const q = query(
      projectsRef,
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const items: SavedProject[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: data.id,
        userId: data.userId,
        title: data.title || "Clarity Project",
        description: data.description || "",
        category: data.category || "Simplifier",
        content: data.content || "",
        timestamp: data.timestamp || Date.now(),
        liked: data.liked || false,
        disliked: data.disliked || false
      });
    });
    
    // Sort descending by timestamp
    items.sort((a, b) => b.timestamp - a.timestamp);
    
    // Backup to localStorage for perfect client robustness
    localStorage.setItem(`projects_${userId}`, JSON.stringify(items));
    
    return items;
  } catch (error) {
    console.warn("Firestore projects access unavailable, fetching from offline client-cache:", error);
    const cached = localStorage.getItem(`projects_${userId}`);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return [];
      }
    }
    return [];
  }
}

export async function saveUserProject(userId: string, project: SavedProject): Promise<void> {
  try {
    const docId = `${userId}_${project.id}`;
    const docRef = doc(db, "projects", docId);
    await setDoc(docRef, {
      ...project,
      userId,
      updatedAt: Date.now()
    });
    
    // Update local offline cache
    const cached = localStorage.getItem(`projects_${userId}`);
    let projects: SavedProject[] = [];
    if (cached) {
      try { projects = JSON.parse(cached); } catch (e) {}
    }
    // Remove if exists then add
    projects = projects.filter(p => p.id !== project.id);
    projects.unshift(project);
    localStorage.setItem(`projects_${userId}`, JSON.stringify(projects));
  } catch (error) {
    console.warn("Firestore offline - saving project directly to robust offline client-cache:", error);
    const cached = localStorage.getItem(`projects_${userId}`);
    let projects: SavedProject[] = [];
    if (cached) {
      try { projects = JSON.parse(cached); } catch (e) {}
    }
    projects = projects.filter(p => p.id !== project.id);
    projects.unshift(project);
    localStorage.setItem(`projects_${userId}`, JSON.stringify(projects));
  }
}

export async function deleteUserProject(userId: string, projectId: string): Promise<void> {
  try {
    const docId = `${userId}_${projectId}`;
    const docRef = doc(db, "projects", docId);
    await deleteDoc(docRef);
    
    // Update local offline cache
    const cached = localStorage.getItem(`projects_${userId}`);
    if (cached) {
      try {
        let projects: SavedProject[] = JSON.parse(cached);
        projects = projects.filter(p => p.id !== projectId);
        localStorage.setItem(`projects_${userId}`, JSON.stringify(projects));
      } catch (e) {}
    }
  } catch (error) {
    console.warn("Firestore offline - deleting from client-cache:", error);
    const cached = localStorage.getItem(`projects_${userId}`);
    if (cached) {
      try {
        let projects: SavedProject[] = JSON.parse(cached);
        projects = projects.filter(p => p.id !== projectId);
        localStorage.setItem(`projects_${userId}`, JSON.stringify(projects));
      } catch (e) {}
    }
  }
}


