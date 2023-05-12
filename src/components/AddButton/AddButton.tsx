import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { add } from "ionicons/icons";

function AddButton(props: React.HTMLAttributes<HTMLIonFabElement>) {
  return (
    <IonFab className="absolute bottom-6 right-6" {...props}>
      <IonFabButton>
        <IonIcon icon={add}></IonIcon>
      </IonFabButton>
    </IonFab>
  );
}

export default AddButton;
