import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonModal,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { usePhoto } from "../../hooks";

type Props = {
  closeModal: () => void;
  isOpen: boolean;
};

function Modal({ closeModal, isOpen }: Props) {
  const { takePhoto, photo } = usePhoto();

  return (
    <IonModal isOpen={isOpen} backdropDismiss={false}>
      <IonHeader className="mb-6">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={closeModal}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Nueva Nota</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true}>Add</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="flex justify-center my-7">
        <IonInput className="mx-4 px-4 border text-2xl" />
        {photo === null ? (
          <IonButton onClick={takePhoto} className="my-5 self-center">
            Tomar foto
          </IonButton>
        ) : (
          <img src={photo?.webviewPath} />
        )}
      </IonContent>
    </IonModal>
  );
}

export default Modal;
