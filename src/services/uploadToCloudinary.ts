import * as fs from "fs";
import cloudinary from "../config/cloudinaryConfig";

export const saveFileLocally = (name: string, buffer: Buffer): boolean => {
  fs.writeFile(`./file_directory/${name}`, buffer, (err) => {
    if (err) {
      console.error(err);
      return false;
    }
  });
  return true;
};

export const deleteFileFromLocalStorage = (name: string): void => {
  const filePath = `file_directory/${name}`;

  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
};

export const uploadFileToCloudinary = async (name: string) => {
  const path = `file_directory/${name}`;
  const result = await cloudinary.uploader.upload(path, {
    public_id: name,
    resource_type: "auto",
  });
  return result;
};

export const deleteFileFromCloudinary = (fileName: string) => {
  cloudinary.uploader.destroy(fileName, (error, result: Object) => {
    if (error) {
      console.error(error);
    }
  });
};
