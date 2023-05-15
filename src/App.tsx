import { IonList } from "@ionic/react";
import { IonApp, setupIonicReact } from "@ionic/react";

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
import { retrieveNotes } from "./firebase";
import { Note } from "./types";

setupIonicReact({ mode: "ios" });

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const notes = await retrieveNotes();

      setNotes(notes);
    };

    fetchNotes();
  }, []);

  return (
    <>
      <IonApp className=" justify-start ">
        <Header />
        <IonList>
          {notes.map((todo) => {
            return <Card key={todo.id} {...todo} />;
          })}
        </IonList>
        <Modal closeModal={closeModal} isOpen={isOpen} setNotes={setNotes} />
        <AddButton onClick={() => setIsOpen(true)} />
      </IonApp>
    </>
  );
}

export default App;
