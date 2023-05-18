import { IonCard, IonCardContent, IonThumbnail } from "@ionic/react";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "../../firebase";
import { Note } from "../../types";

type Props = Note & {
  id: string;
  openEditModal: (noteId: string) => void;
};

function Card({ pictureName, value, openEditModal, id }: Props) {
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    setTimeout(() => {
      getDownloadURL(ref(storage, pictureName))
        .then((url) => {
          setImgUrl(url);
        })
        .catch((err) => {
          if (err instanceof Error) {
            console.error(err.message);
          }
        });
    }, 500);
  }, [pictureName]);

  return (
    <IonCard onClick={() => openEditModal(id)} className="bg-indigo-100">
      <IonCardContent className="flex items-center">
        <IonThumbnail className="h-auto shrink-0" slot="start">
          <img src={imgUrl} />
        </IonThumbnail>
        <p className="pl-2.5 font-semibold text-black">{value}</p>
      </IonCardContent>
    </IonCard>
  );
}

export default Card;
