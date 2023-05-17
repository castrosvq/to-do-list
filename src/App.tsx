import {
  IonApp,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  setupIonicReact,
} from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import Header from "./components/Header/Header";
import AddButton from "./components/AddButton/AddButton";
import Card from "./components/Card/Card";
import { useEffect, useState } from "react";
import Modal from "./components/Modal/Modal";
import {
  retrieveLimitNotes,
  retrieveNextNotes,
  retrieveOneNote,
} from "./firebase";
import { Note } from "./types";
import { DocumentData } from "firebase/firestore";

setupIonicReact({ mode: "ios" });

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<DocumentData[]>([]);
  const [selectedNote, setSelectedNote] = useState<DocumentData | null>(null);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openEditModal = async (noteId: string) => {
    const noteToEdit = await retrieveOneNote(noteId);

    if (noteToEdit?.docs[0].data()) {
      setSelectedNote(noteToEdit?.docs[0].data());
      setIsOpen(true);
    }
  };

  const onCancelEdition = () => {
    setSelectedNote(null);
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const notes = await retrieveLimitNotes(7);

      setNotes(notes.docs);
    };

    fetchNotes();
  }, []);

  return (
    <>
      <IonApp className=" justify-start ">
        <Header />
        <IonContent>
          <IonList>
            {notes.map((todo) => {
              const currentNote = todo.data() as Note;

              return (
                <Card
                  key={currentNote.id}
                  openEditModal={openEditModal}
                  {...currentNote}
                />
              );
            })}
          </IonList>
          <IonInfiniteScroll
            onIonInfinite={async (event) => {
              const lastVisible = notes[notes.length - 1];

              const newNotes = await retrieveNextNotes(5, lastVisible);

              setNotes([...notes, ...newNotes.docs]);

              await event?.target?.complete();
            }}
          >
            <IonInfiniteScrollContent></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonContent>
        <Modal
          closeModal={closeModal}
          isOpen={isOpen}
          setNotes={setNotes}
          selectedNote={selectedNote}
          onCancelEdition={onCancelEdition}
        />
        <AddButton onClick={() => setIsOpen(true)} />
      </IonApp>
    </>
  );
}

export default App;
