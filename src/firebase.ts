import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Note } from "./types";
import { NOTES } from "./constants";

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
const notesRef = collection(db, NOTES);

const retrieveOneNote = async (id: string) => {
  const q = query(notesRef, where("id", "==", id));
  const documentSnapshots = await getDocs(q);

  return documentSnapshots;
};

const saveNote = async (note: Note) => {
  try {
    await addDoc(notesRef, note);

    const newNote = await retrieveOneNote(note.id);

    return newNote;
  } catch (err) {
    console.error(err);
    if (err instanceof Error) alert(err.message);
  }
};

const retrieveAllNotes = async () => {
  const q = query(notesRef, orderBy("createdAt", "asc"));
  const documentSnapshots = await getDocs(q);

  return documentSnapshots;
};

const retrieveLimitNotes = async (resultsLimit = 10) => {
  const q = query(notesRef, orderBy("createdAt", "asc"), limit(resultsLimit));
  const documentSnapshots = await getDocs(q);

  return documentSnapshots;
};

const retrieveNextNotes = async (resultsLimit = 10, lastVisible: unknown) => {
  const q = query(
    notesRef,
    orderBy("createdAt", "asc"),
    limit(resultsLimit),
    startAfter(lastVisible)
  );
  const documentSnapshots = await getDocs(q);

  return documentSnapshots;
};

export {
  db,
  retrieveAllNotes,
  retrieveLimitNotes,
  retrieveNextNotes,
  retrieveOneNote,
  saveNote,
  storage,
};
