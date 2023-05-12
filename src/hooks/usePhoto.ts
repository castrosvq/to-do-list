export * from "./usePhoto";

import { useState } from "react";
import { base64FromPath } from "../utils";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { uploadString } from "firebase/storage";
import { storageRef } from "../firebase";

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export function usePhoto() {
  const [photo, setPhoto] = useState<UserPhoto | null>(null);

  const savePicture = async (
    photo: Photo,
    fileName: string
  ): Promise<UserPhoto> => {
    if (photo.webPath) {
      const base64Data = await base64FromPath(photo.webPath);

      await uploadString(storageRef, base64Data, "data_url").then(
        (snapshot) => {
          console.log(snapshot);
          console.log("Uploaded a base64 string!");
        }
      );
    }

    return {
      filepath: fileName,
      webviewPath: photo.webPath,
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

  return {
    takePhoto,
    photo,
    savePicture,
  };
}
