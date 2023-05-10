import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
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
          <IonAvatar slot="start">
            <img src={imgSrc} />
          </IonAvatar>
          <IonLabel>{text}</IonLabel>
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
}

export default Card;
