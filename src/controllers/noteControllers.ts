import { Request, Response } from "express";
import db from "../models";
import messageGenerator from "../services/messageGenerator";

export const getAllNotes = async (req: Request, res: Response) => {
    const allNote = await db.Note.findAll();

    return res.status(200).json(allNote);
};

export const getOneNote = async (req: Request, res: Response) => {
    const dealId = req.params.dealId;
    await db.Note.findAll({ where: { deal_id: dealId } })
        .then(note => {
            if (!note) return res.status(404).end();
            res.json(note);
        });
};

export const createNote = async (req: Request, res: Response) => {
    const dealId = req.params.dealId;
    const { content } = req.body;
    try {
        const note = await db.Note.findAll({ where: { deal_id: dealId } })
            .then(note => {
                if (note.length == 0) {
                    db.Note.create({
                        content,
                        deal_id: parseInt(dealId !== "" ? dealId : null),
                    })
                    return res
                        .status(200)
                        .json({ message: "Deal created succesfully.", note: content });
                }
                else {
                    res.json(messageGenerator([], "The deal note was previously created"));
                }
            })
    } catch (e) {
        return res.status(500).json(messageGenerator(["errors", "server"]));
    }
};

export const updateNote = async (req: Request, res: Response) => {
    const dealId = req.params.dealId;
    const { content } = req.body;
    try {
        await db.Note.update({ content: content }, { where: { deal_id: dealId } });
        return res.json(messageGenerator([], "Note updated succesfully."));
    } catch (e) {
        return res.status(500).json(messageGenerator(["errors", "server"]));
    }
}

export const deleteNote = async (req: Request, res: Response) => {
    const dealId = req.params.dealId;

    try {
        await db.Note.findAll({ where: { deal_id: dealId } }).then(note => {
            if (note.length !== 0) {
                db.Note.destroy({ where: { deal_id: dealId } });
                res.json(messageGenerator([], "Note deleted successfully"));
            } else {
                res.json(messageGenerator([], "The deal note has not created"));
            }
        })
    } catch (e) {
        return res.status(500).json(messageGenerator(["errors", "server"]));
    }
};