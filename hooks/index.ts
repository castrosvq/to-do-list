export * from "./usePhoto";

import { useState } from "react";
import { base64FromPath } from "./utils";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { uploadString } from "firebase/storage";
import { storageRef } from "../src/firebase";

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export function usePhoto() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

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
    const newPhotos: UserPhoto = {
      filepath: fileName,
      webviewPath: photo.webPath,
    };

    setPhotos([...photos, newPhotos]);
    savePicture(photo, fileName);
  };

  return {
    takePhoto,
    photos,
  };
}
