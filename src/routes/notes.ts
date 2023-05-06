import { Router } from "express";

import {
  getAllNotes,
  getOneNote,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/noteControllers";
import checkAccessToken from "../middlewares/checkAccessToken";

const notesRouter = Router();

notesRouter.get("/notes", checkAccessToken, getAllNotes);
notesRouter.get("/note/:dealId", checkAccessToken, getOneNote);
notesRouter.post("/note/:dealId", checkAccessToken, createNote);
notesRouter.patch("/note/:dealId", checkAccessToken, updateNote);
notesRouter.delete("/note/:dealId", checkAccessToken, deleteNote);

export default notesRouter;
