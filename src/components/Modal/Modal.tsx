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
          <IonButtons slot="secondary">
            <IonButton
              onClick={closeModal}
              className="font-bold"
              color="medium"
              fill="solid"
            >
              <IonIcon slot="end" src="close.svg"></IonIcon>
              Cancel
            </IonButton>
          </IonButtons>
          <IonButtons slot="primary">
            <IonButton
              onClick={() => {
                console.log(inputRef);
              }}
              className="font-bold"
              color="success"
              fill="solid"
            >
              <IonIcon slot="end" src="check.svg"></IonIcon>
              Add
            </IonButton>
          </IonButtons>
          <IonTitle className="text-2xl font-bold">Nueva nota</IonTitle>
        </IonToolbar>
      </IonHeader>
      <div className="flex flex-col flex-1 items-center">
        <input
          className="text-2xl p-4 m-6 border-b "
          type="text"
          ref={inputRef}
        />
        {photo === null ? (
          <IonButton onClick={takePhoto} className="ml-2 my-6 font-bold">
            <IonIcon slot="end" src="camera.svg"></IonIcon>
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
