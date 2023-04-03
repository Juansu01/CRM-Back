import * as fs from "fs";
import cloudinary from "../config/cloudinaryConfig";

export const saveImageLocally = (name: string, buffer: Buffer): boolean => {
  fs.writeFile(`./deal_images/${name}`, buffer, (err) => {
    if (err) {
      console.error(err);
      return false;
    }
  });
  return true;
};

export const deleteImageFromLocalStorage = (name: string): void => {
  const imagePath = `deal_images/${name}`;

  if (fs.existsSync(imagePath)) {
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
};

export const uploadImageToCloudinary = async (
  name: string,
  public_id: string
) => {
  const path = `deal_images/${name}`;
  const result = await cloudinary.uploader.upload(path, {
    public_id: public_id,
  });
  return result;
};