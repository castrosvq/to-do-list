import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { usePhoto } from "../../hooks";
import { useRef } from "react";
import { Note } from "../../types";
import { saveNote } from "../../firebase";

type Props = {
  closeModal: () => void;
  isOpen: boolean;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
};

function Modal({ closeModal, setNotes, isOpen }: Props) {
  const { takePhoto, photo, savePicture, setPhoto } = usePhoto();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnSave = () => {
    const noteValue = inputRef.current?.value ?? "";
    const pictureDate = photo?.filepath.slice(0, -5) ?? "";

    const note: Note = {
      id: pictureDate,
      value: noteValue,
      pictureName: pictureDate,
      createdAt: +pictureDate,
      updatedAt: +pictureDate,
    };

    if (photo) {
      saveNote(note);
      savePicture(photo, pictureDate);
      closeModal();
      setPhoto(null);
      setNotes((prevNotes) => [note, ...prevNotes]);
    }
  };

  return (
    <IonModal isOpen={isOpen} backdropDismiss={false}>
      <IonHeader className="mb-6">
        <IonToolbar>
          <IonButtons slot="secondary">
            <IonButton
              onClick={closeModal}
              className="font-bold"
              color="medium"
              fill="solid"
            >
              <IonIcon slot="end" src="close.svg" />
              Cancel
            </IonButton>
          </IonButtons>
          <IonButtons slot="primary">
            <IonButton
              onClick={handleOnSave}
              className="font-bold"
              color="success"
              fill="solid"
            >
              <IonIcon slot="end" src="check.svg" />
              Add
            </IonButton>
          </IonButtons>
          <IonTitle className="text-2xl font-bold">Nueva nota</IonTitle>
        </IonToolbar>
      </IonHeader>
      <div className="flex flex-col flex-1 items-center">
        <input
          className="text-2xl p-4 m-6 w-9/12 text-black bg-gray-300 rounded-sm"
          type="text"
          ref={inputRef}
        />
        {photo === null ? (
          <IonButton onClick={takePhoto} className="ml-2 my-6 font-bold">
            <IonIcon slot="end" src="camera.svg" />
            Tomar foto
          </IonButton>
        ) : (
          <img className="m-6 p-4" src={photo?.webviewPath} />
        )}
      </div>
    </IonModal>
  );
}

export default Modal;
