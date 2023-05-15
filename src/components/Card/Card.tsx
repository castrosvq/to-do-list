import {
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonThumbnail,
} from "@ionic/react";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "../../firebase";
import { Note } from "../../types";

function Card({ pictureName, value }: Note) {
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    setTimeout(() => {
      getDownloadURL(ref(storage, pictureName))
        .then((url) => {
          setImgUrl(url);
        })
        .catch((err) => {
          if (err instanceof Error) {
            console.log(err.message);
          }
        });
    }, 500);
  }, [pictureName]);

  return (
    <IonCard>
      <IonCardContent>
        <IonItem>
          <IonThumbnail slot="start">
            <img src={imgUrl} />
          </IonThumbnail>
          <IonLabel>{value}</IonLabel>
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
}

export default Card;
