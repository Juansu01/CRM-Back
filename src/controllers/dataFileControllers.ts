import { Request, Response } from "express";
import db from "../models";
import {
  saveFileLocally,
  deleteFileFromLocalStorage,
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
} from "../services/uploadToCloudinary";

export const getAllFiles = async (req: Request, res: Response) => {
  const allFiles = await db.DataFile.findAll();

  return res.status(200).json(allFiles);
};

export const getFile = async (req: Request, res: Response) => {
  const id = req.params.id;
  const file = await db.DataFile.findByPk(id);

  if (file) {
    return res
      .status(200)
      .json({ message: "File successfully found.", file: file });
  }

  return res.status(404).json({ message: "File wasn't found" });
};

export const addDataFile = async (req: Request, res: Response) => {
  const { deal_id } = req.body;
  const deal = await db.Deal.findByPk(deal_id);

  if (deal) {
    const dataFile = await deal.getDataFile();
    if (dataFile) {
      return res
        .status(401)
        .json({ message: "Deal already has a DataFile.", data_file: dataFile });
    }
    const fileName = req.file.originalname;
    saveFileLocally(fileName, req.file.buffer);
    const result = await uploadFileToCloudinary(fileName).catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Couldn't upload image" });
    });
    deleteFileFromLocalStorage(fileName);

    if (result.secure_url) {
      const newDataFile = await db.DataFile.create({
        document_file: result.secure_url,
        deal_id: +deal_id,
      });

      if (newDataFile) {
        return res.json({
          message: "Added new data file successfully",
          data_file: newDataFile,
        });
      }
      return res.status(500).json({
        message: "Something went wrong, couldn't create data file instance.",
      });
    }
    return res
      .status(500)
      .json({ message: "Something went wrong, couldn't upload file." });
  }

  return res
    .status(404)
    .json({ message: "Deal was not found, cannot add file." });
};

export const patchDataFile = async (req: Request, res: Response) => {
  const dataFileId = req.params.id;
};

export const deleteDataFile = async (req: Request, res: Response) => {
  const dataFileId = req.params.id;
  const dataFile = await db.DataFile.findByPk(dataFileId);

  if (dataFile) {
    deleteFileFromCloudinary(dataFile.document_file);
    await dataFile.destroy();
    return res.json({ message: "Datafile successfully deleted." });
  }

  return res
    .status(404)
    .json({ message: "Datafile was not found, cannot delete." });
};
