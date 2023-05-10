import { IonContent, IonApp, setupIonicReact, IonButton } from "@ionic/react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

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

setupIonicReact({ mode: "ios" });

function usePhotoGallery() {
  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    console.log(photo);
  };

  return {
    takePhoto,
  };
}

function App() {
  const { takePhoto } = usePhotoGallery();

  return (
    <>
      <IonApp>
        <IonContent className="ion-padding">
          <IonButton onClick={() => takePhoto()}>Tomar foto</IonButton>
        </IonContent>
      </IonApp>
    </>
  );
}

export default App;
