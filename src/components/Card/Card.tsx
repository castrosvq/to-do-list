import {
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonThumbnail,
} from "@ionic/react";

type Props = {
  imgSrc: string;
  text: string;
};

function Card({ imgSrc, text }: Props) {
  return (
    <IonCard>
      <IonCardContent>
        <IonItem>
          <IonThumbnail slot="start">
            <img src={imgSrc} />
          </IonThumbnail>
          <IonLabel>{text}</IonLabel>
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
}

export default Card;
