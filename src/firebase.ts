import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
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

const retrieveOneNote = async (noteId: string) => {
  const docRef = doc(db, NOTES, noteId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return docSnap;
};

const saveNote = async (note: Note) => {
  try {
    const newNote = await addDoc(notesRef, note);

    return await retrieveOneNote(newNote.id);
  } catch (err) {
    console.error(err);
    if (err instanceof Error) alert(err.message);
  }
};

type EditNote = {
  noteId: string;
  note: Partial<Note>;
};

const editNote = async ({ noteId, note }: EditNote) => {
  const notesRef = doc(db, NOTES, noteId);

  await updateDoc(notesRef, note);

  return await retrieveOneNote(noteId);
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
  editNote,
  retrieveAllNotes,
  retrieveLimitNotes,
  retrieveNextNotes,
  retrieveOneNote,
  saveNote,
  storage,
};
