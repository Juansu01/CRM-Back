import { Router } from "express";
import {
  getAllFiles,
  getFile,
  addDataFile,
  deleteDataFile,
} from "../controllers/dataFileControllers";
import multer from "multer";

const dataFileRouter = Router();
const upload = multer();

dataFileRouter.get("/datafiles", getAllFiles);
dataFileRouter.get("/datafile/:id", getFile);
dataFileRouter.post("/datafile", upload.single("file"), addDataFile);
dataFileRouter.delete("/datafile/:id", deleteDataFile);

export default dataFileRouter;
