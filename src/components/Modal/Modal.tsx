import {
  IonButton,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { UserPhoto, usePhoto } from "../../hooks";
import { useEffect, useState } from "react";
import { Note } from "../../types";
import { editNote, retrieveOneNote, saveNote, storage } from "../../firebase";
import { DocumentData } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

type Props = {
  isOpen: boolean;
  setNotes: React.Dispatch<React.SetStateAction<DocumentData[]>>;
  selectedNote: string | null;
  onCancelEdition: () => void;
};

function Modal({ onCancelEdition, setNotes, isOpen, selectedNote }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [tempPhoto, setTempPhoto] = useState<UserPhoto | null>(null);
  const [tempNote, setTempNote] = useState<Note | null>(null);

  const { takePhoto, savePicture, removePhoto } = usePhoto({
    setPhoto: setTempPhoto,
  });

  const handleOnSaveOrEdit = async () => {
    if (selectedNote) {
      const now = new Date().getTime();

      if (
        tempNote?.pictureName !== tempPhoto?.filepath &&
        tempPhoto &&
        tempNote !== null
      ) {
        tempNote?.pictureName && (await removePhoto(tempNote?.pictureName));
        await savePicture(tempPhoto, now.toString());
      }

      const newPictureName =
        tempNote?.pictureName !== tempPhoto?.filepath
          ? now.toString()
          : tempNote?.pictureName;

      const editedNote = await editNote({
        noteId: selectedNote,
        note: {
          pictureName: newPictureName,
          updatedAt: now,
          value: inputValue,
        },
      });

      setNotes((prevNotes) => {
        const newNotes = prevNotes.map((note) => {
          if (note.id === selectedNote) {
            return editedNote;
          }

          return note;
        }) as DocumentData[];

        return newNotes;
      });

      handleCloseModal();
      return;
    }

    if (!selectedNote) {
      const pictureDate = tempPhoto?.filepath.slice(0, -5) ?? "";

      const note: Note = {
        value: inputValue,
        pictureName: pictureDate,
        createdAt: +pictureDate,
        updatedAt: +pictureDate,
      };

      if (tempPhoto) {
        const newNote = await saveNote(note);

        await savePicture(tempPhoto, pictureDate);

        newNote?.data() && setNotes((prevNotes) => [...prevNotes, newNote]);
        handleCloseModal();
      }
      return;
    }
  };

  const handleRemovePhoto = () => {
    setTempPhoto(null);
  };

  const handleCloseModal = () => {
    setInputValue("");
    setTempPhoto(null);
    onCancelEdition();
  };

  useEffect(() => {
    if (selectedNote) {
      const fetchNotes = async () => {
        const response = await retrieveOneNote(selectedNote);

        if (response) {
          const note = response.data() as Note;
          setTempNote(note);
          const photoUrl = await getDownloadURL(ref(storage, note.pictureName));

          setInputValue(note.value);

          if (photoUrl) {
            setTempPhoto({
              filepath: note.pictureName ?? "",
              webviewPath: photoUrl,
            });
          }
        }
      };

      fetchNotes();
    }
  }, [selectedNote]);

  return (
    <IonModal isOpen={isOpen} backdropDismiss={false}>
      <IonHeader className="mb-6">
        <IonToolbar>
          <IonTitle className="text-2xl font-bold">Nueva nota</IonTitle>
        </IonToolbar>
      </IonHeader>
      <div className="flex flex-col flex-1 items-center">
        <input
          className="text-2xl p-4 text-black bg-indigo-100 rounded-sm w-11/12"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {tempPhoto === null ? (
          <IonButton
            onClick={takePhoto}
            className="ml-2 my-6 font-bold bg-indigo-100 text-black rounded-lg text-lg"
            fill="clear"
          >
            <IonIcon slot="end" src="camera.svg" />
            Tomar foto
          </IonButton>
        ) : (
          <>
            <img className="m-6 p-4" src={tempPhoto?.webviewPath} />
            <button onClick={handleRemovePhoto}>remove photo</button>
          </>
        )}
        <div>
          <IonButton
            onClick={handleCloseModal}
            className="bg-red-100 text-black rounded-lg text-lg"
            fill="clear"
          >
            <IonIcon slot="end" src="close.svg" />
            Cancelar
          </IonButton>

          <IonButton
            onClick={handleOnSaveOrEdit}
            className="bg-green-100 text-black rounded-lg text-lg"
            fill="clear"
          >
            <IonIcon slot="end" src="check.svg" />
            {selectedNote ? "Editar" : "Añadir"}
          </IonButton>
        </div>
      </div>
    </IonModal>
  );
}

export default Modal;
