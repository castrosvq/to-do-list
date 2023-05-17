import {
  IonButton,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { usePhoto } from "../../hooks";
import { useEffect, useState } from "react";
import { Note } from "../../types";
import { saveNote, storage } from "../../firebase";
import { DocumentData } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

type Props = {
  closeModal: () => void;
  isOpen: boolean;
  setNotes: React.Dispatch<React.SetStateAction<DocumentData[]>>;
  selectedNote: DocumentData | null;
  onCancelEdition: () => void;
};

function Modal({
  closeModal,
  onCancelEdition,
  setNotes,
  isOpen,
  selectedNote,
}: Props) {
  const { takePhoto, photo, savePicture, setPhoto } = usePhoto();
  const [inputValue, setInputValue] = useState("");

  const handleOnSave = async () => {
    const pictureDate = photo?.filepath.slice(0, -5) ?? "";

    const note: Note = {
      id: pictureDate,
      value: inputValue,
      pictureName: pictureDate,
      createdAt: +pictureDate,
      updatedAt: +pictureDate,
    };

    if (photo) {
      const newNote = await saveNote(note);
      await savePicture(photo, pictureDate);

      newNote?.docs[0] &&
        setNotes((prevNotes) => [...prevNotes, newNote?.docs[0]]);
      closeModal();
      setPhoto(null);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
  };

  useEffect(() => {
    if (selectedNote?.pictureName) {
      setInputValue(selectedNote?.value);

      getDownloadURL(ref(storage, selectedNote?.pictureName ?? ""))
        .then((url) => {
          setPhoto({
            filepath: selectedNote?.pictureName ?? "",
            webviewPath: url,
          });
        })
        .catch((err) => {
          if (err instanceof Error) {
            console.log(err.message);
          }
        });
    }

    return () => {
      setPhoto(null);
    };
  }, [selectedNote?.pictureName, selectedNote?.value, setPhoto]);

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
        {photo === null ? (
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
            <img className="m-6 p-4" src={photo?.webviewPath} />
            <button onClick={handleRemovePhoto}>remove photo</button>
          </>
        )}
        <div>
          <IonButton
            onClick={onCancelEdition}
            className="bg-red-100 text-black rounded-lg text-lg"
            fill="clear"
          >
            <IonIcon slot="end" src="close.svg" />
            Cancelar
          </IonButton>

          <IonButton
            onClick={handleOnSave}
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
