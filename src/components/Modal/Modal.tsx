import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonModal,
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
      {/* <IonContent> */}
      <IonInput className="m-0 text-2xl border-b border-gray-400" />
      <IonContent>
        {" "}
        {photo === null ? (
          <IonButton onClick={takePhoto} className="ml-2 my-6">
            Tomar foto
          </IonButton>
        ) : (
          <img
            className="my-12 w-2/4 absolute left-1/4"
            src={photo?.webviewPath}
          />
        )}
      </IonContent>
      {/* </IonContent> */}
    </IonModal>
  );
}

export default Modal;
