import {
  IonButton,
  IonButtons,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { usePhoto } from "../../hooks";
import { useRef } from "react";

type Props = {
  closeModal: () => void;
  isOpen: boolean;
};

function Modal({ closeModal, isOpen }: Props) {
  const { takePhoto, photo } = usePhoto();
  const inputRef = useRef(null);

  return (
    <IonModal isOpen={isOpen} backdropDismiss={false}>
      <IonHeader className="mb-6">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton className="text-2xl" onClick={closeModal}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle className="text-3xl">Nueva Nota</IonTitle>
          <IonButtons slot="end">
            <IonButton
              className="text-2xl"
              strong={true}
              onClick={() => {
                console.log(inputRef);
              }}
            >
              Add
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <div className="flex flex-col flex-1 items-center">
        <input
          className="text-2xl p-4 m-6 border-b border-blue-400"
          type="text"
          ref={inputRef}
        />
        {photo === null ? (
          <IonButton onClick={takePhoto} className="ml-2 my-6">
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
