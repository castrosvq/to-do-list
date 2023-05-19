import { base64FromPath } from "../utils";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { deleteObject, ref, uploadString } from "firebase/storage";
import { storage } from "../firebase";

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

type Props = {
  setPhoto: React.Dispatch<React.SetStateAction<UserPhoto | null>>;
};

export function usePhoto({ setPhoto }: Props) {
  const savePicture = async (
    photo: UserPhoto,
    fileName: string
  ): Promise<UserPhoto> => {
    if (photo.webviewPath) {
      const base64Data = await base64FromPath(photo.webviewPath);
      const storageRef = ref(storage, fileName);

      await uploadString(storageRef, base64Data, "data_url");
    }

    return {
      filepath: fileName,
      webviewPath: photo.webviewPath,
    };
  };

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const fileName = new Date().getTime() + ".jpeg";
    const newPhoto: UserPhoto = {
      filepath: fileName,
      webviewPath: photo.webPath,
    };

    setPhoto(newPhoto);
  };

  const removePhoto = async (photoFilepath: string) => {
    const storageRef = ref(storage, photoFilepath);

    await deleteObject(storageRef);
  };

  return {
    removePhoto,
    savePicture,
    setPhoto,
    takePhoto,
  };
}
