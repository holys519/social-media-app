import { supabase } from "@/lib/supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { supabaseUrl } from "@/constants";

export const getUserImageSrc = (imagePath: string) => {
  if (imagePath) {
    return getSupabaseFileUrl(imagePath);
  } else {
    console.log("default png icon: ");
    return require("../assets/images/defaultUser.png");
  }
};

export const downloadFile = async (uri) => {
  try {
    const { uri } = FileSystem.downloadAsync(uri, getFilePath(uri));
  } catch (error) {
    return null;
  }
};

export const getSupabaseFileUrl = (filePath: string) => {
  if (filePath) {
    return {
      uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`,
    };
  }
  return null;
};

export const uploadFile = async (
  folderName: string,
  fileUri: string,
  isImage = true
) => {
  try {
    let fileName = getFilePath(folderName, isImage);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    let imageData = decode(fileBase64);
    let { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, imageData, {
        cacheControl: "3600",
        upsert: false,
        contentType: isImage ? "image/*" : "video/*",
      });
    console.log("upload data: ", data);
    if (error) {
      console.log("file upload error: ", error);
      console.log("file upload error data: ", data);
      return { success: false, msg: "could not upload media" };
    }

    console.log("data imageServer: ", data);
    return { success: true, data: data?.path || null };
  } catch (error) {
    console.log("file upload error: ", error);
    return { success: false, msg: "could not upload media" };
  }
};

export const getFilePath = (folderName: any, isImage: any) => {
  return `/${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`;
};
