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
import checkAccessToken from "../middlewares/checkAccessToken";

const dataFileRouter = Router();
const upload = multer();

dataFileRouter.get("/datafiles", checkAccessToken, getAllFiles);
dataFileRouter.get("/datafile/:id", checkAccessToken, getFile);
dataFileRouter.post(
  "/datafile",
  checkAccessToken,
  upload.single("file"),
  checkDataFilePost,
  addDataFile
);
dataFileRouter.patch(
  "/datafile/:id",
  checkAccessToken,
  upload.single("file"),
  checkRequestBodyIsFormData,
  patchDataFile
);
dataFileRouter.delete("/datafile/:id", checkAccessToken, deleteDataFile);

export default dataFileRouter;
