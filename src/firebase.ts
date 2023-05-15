import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Note } from "./types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();
const notesRef = collection(db, "notes");

const saveNote = async (note: Note) => {
  try {
    await addDoc(notesRef, note);
  } catch (err) {
    console.error(err);
    if (err instanceof Error) alert(err.message);
  }
};

const retrieveNotes = async () => {
  const querySnapshot = await getDocs(notesRef);

  return querySnapshot.docs.map((doc) => doc.data() as Note);
};

export { db, saveNote, storage, retrieveNotes };
