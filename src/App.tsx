import { IonList } from "@ionic/react";
import { IonApp, setupIonicReact } from "@ionic/react";

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
import Header from "./components/Header/Header";
import AddButton from "./components/AddButton/AddButton";
import Card from "./components/Card/Card";
import { useState } from "react";
import Modal from "./components/Modal/Modal";

setupIonicReact({ mode: "ios" });

const todos = [
  {
    id: "1",
    description: "description 1",
    imgSrc: "https://picsum.photos/200/300",
  },
  {
    id: "2",
    description: "description 2",
    imgSrc: "https://picsum.photos/200/300",
  },
  {
    id: "3",
    description: "description 3",
    imgSrc: "https://picsum.photos/200/300",
  },
  {
    id: "4",
    description: "description 4",
    imgSrc: "https://picsum.photos/200/300",
  },
  {
    id: "5",
    description: "description 5",
    imgSrc: "https://picsum.photos/200/300",
  },
  {
    id: "6",
    description: "description 6",

    imgSrc: "https://picsum.photos/200/300",
  },
  {
    id: "7",
    description: "description 7",
    imgSrc: "https://picsum.photos/200/300",
  },
];

function App() {
  const [isOpen, setIsOpen] = useState(false);
  // const { takePhoto } = usePhoto();

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <IonApp>
        <Header />
        <IonList>
          {todos.map((todo) => {
            return (
              <Card
                key={todo.id}
                imgSrc={todo.imgSrc}
                text={todo.description}
              />
            );
          })}
        </IonList>
        <Modal closeModal={closeModal} isOpen={isOpen} />
        <AddButton onClick={() => setIsOpen(true)} />
      </IonApp>
    </>
  );
}

export default App;
