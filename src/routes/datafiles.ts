import { Router } from "express";
import {
  getAllFiles,
  getFile,
  addDataFile,
  deleteDataFile,
  patchDataFile,
} from "../controllers/dataFileControllers";
import multer from "multer";
import {
  checkDataFilePost,
  checkRequestBodyIsFormData,
} from "../middlewares/checkRequestBody";

const dataFileRouter = Router();
const upload = multer();

dataFileRouter.get("/datafiles", getAllFiles);
dataFileRouter.get("/datafile/:id", getFile);
dataFileRouter.post(
  "/datafile",
  upload.single("file"),
  checkDataFilePost,
  addDataFile
);
dataFileRouter.patch(
  "/datafile/:id",
  upload.single("file"),
  checkRequestBodyIsFormData,
  patchDataFile
);
dataFileRouter.delete("/datafile/:id", deleteDataFile);

export default dataFileRouter;
