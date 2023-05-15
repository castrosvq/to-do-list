import {
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";

type Props = {
  handleRefresh: (event: CustomEvent<RefresherEventDetail>) => void;
};

function Refresher({ handleRefresh }: Props) {
  return (
    <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
      <IonRefresherContent></IonRefresherContent>
    </IonRefresher>
  );
}

export default Refresher;
