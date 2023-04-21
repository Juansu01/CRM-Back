import { Router } from "express";
import {
    getAllNotes,
    getOneNote,
    createNote,
    updateNote,
    deleteNote
} from "../controllers/noteControllers";

const notesRouter = Router();

notesRouter.get("/notes", getAllNotes);
notesRouter.get("/note/:dealId", getOneNote);
notesRouter.post("/note/:dealId", createNote);
notesRouter.patch("/note/:dealId", updateNote);
notesRouter.delete("/note/:dealId", deleteNote);

export default notesRouter;