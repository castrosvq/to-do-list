import {
  IonAlert,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { UserPhoto, usePhoto } from "../../hooks";
import { useEffect, useState } from "react";
import { Note } from "../../types";
import {
  deleteNote,
  editNote,
  retrieveOneNote,
  saveNote,
  storage,
} from "../../firebase";
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

  const [handlerMessage, setHandlerMessage] = useState("");
  const [roleMessage, setRoleMessage] = useState("");

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

  const deleteAllNote = async () => {
    if (tempNote && selectedNote) {
      await removePhoto(tempNote?.pictureName);
      await deleteNote(selectedNote);

      setNotes((prevNotes) =>
        prevNotes.filter((note) => note.id !== selectedNote)
      );

      onCancelEdition();
    }
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
          <IonButtons slot="start">
            <IonButton
              onClick={handleCloseModal}
              className="font-bold bg-indigo-200 text-black rounded-lg text-lg mb-1.5"
              fill="clear"
            >
              <IonIcon slot="end" src="close.svg" />
              Cancelar
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              onClick={handleOnSaveOrEdit}
              className="font-bold bg-green-200 text-black rounded-lg text-lg mb-1.5"
              fill="clear"
            >
              <IonIcon slot="end" src="check.svg" />
              {selectedNote ? "Editar" : "Añadir"}
            </IonButton>
          </IonButtons>
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
            <img className="m-4 p-4" src={tempPhoto?.webviewPath} />
            <div>
              <IonButton
                className="font-bold bg-red-100 text-black rounded-lg text-lg mb-1.5"
                onClick={handleRemovePhoto}
                fill="clear"
              >
                <IonIcon slot="end" src="delete.svg" />
                Eliminar foto
              </IonButton>
              <IonButton
                className="bg-red-100 font-bold text-black rounded-lg text-lg mb-1.5"
                onClick={deleteAllNote}
                fill="clear"
                id="present-alert"
              >
                <IonIcon slot="end" src="bin.svg" />
                Eliminar nota
              </IonButton>
              <IonAlert
                header="Alert!"
                trigger="present-alert"
                buttons={[
                  {
                    text: "Cancel",
                    role: "cancel",
                    handler: () => {
                      setHandlerMessage("Alert canceled");
                    },
                  },
                  {
                    text: "OK",
                    role: "confirm",
                    handler: () => {
                      setHandlerMessage("Alert confirmed");
                    },
                  },
                ]}
                onDidDismiss={({ detail }) =>
                  setRoleMessage(`Dismissed with role: ${detail.role}`)
                }
              ></IonAlert>
              <p>{handlerMessage}</p>
              <p>{roleMessage}</p>
            </div>
          </>
        )}
        <div></div>
      </div>
    </IonModal>
  );
}

export default Modal;
