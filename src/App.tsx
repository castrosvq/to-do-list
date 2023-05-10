import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonList,
} from "@ionic/react";
import {
  IonContent,
  IonApp,
  setupIonicReact,
  IonButton,
  IonCol,
  IonImg,
} from "@ionic/react";

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
import { usePhoto } from "../hooks";

setupIonicReact({ mode: "ios" });

function App() {
  const { takePhoto, photos } = usePhoto();

  return (
    <>
      <IonApp>
        <IonContent className="ion-padding">
          <IonButton onClick={() => takePhoto()}>Tomar foto</IonButton>
          {photos.map((photo) => (
            <IonCol size="6" key={photo.filepath}>
              <IonImg src={photo.webviewPath} />
            </IonCol>
          ))}
        </IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Tarea</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <IonList>
              <IonItem>
                <IonInput></IonInput>
              </IonItem>
            </IonList>
          </IonCardContent>
          <IonButton>Añadir</IonButton>
        </IonCard>
      </IonApp>
    </>
  );
}

export default App;
