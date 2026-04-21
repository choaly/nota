const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/Note');

const notesRouter = express.Router();

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

//remove any HTML tags from string
function sanitize(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/<[^>]*>/g, ''); // regex for matching anything between < and >
}

notesRouter.get('/', async (req, res) => {
    try {
        //Note.find({}) with an empty object means "find all notes, no filter." Note.find({ user: req.userId }) means "find notes where the user field matches this ID."
        const notes = await Note.find({ user: req.userId });
        res.json({ notes })
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
});

notesRouter.get('/:id', async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            res.status(400).json({ message: "Invalid ID" });
            return;
        }

        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: "No note found"});
        }

        if (note.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        res.json({ note });
    }
    catch(error) {
        res.status(500).json({ message: error.message })
    }
})

notesRouter.post('/', async (req, res) => {
    try {
        const title = sanitize(req.body.title);
        const content = sanitize(req.body.content);
        const user = req.userId;

        const noteData = { user, title, content }

        const note = await Note.create(noteData);

        res.status(201).json({ note });
    }
    catch(error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
})

notesRouter.put('/:id', async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const title = sanitize(req.body.title);
        const content = sanitize(req.body.content);

        const noteData = { title, content }

        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: "Note with that ID does not exist"});
        }

        if (note.user.toString() !== req.userId) {
            return res.status(403).json({message: "Forbidden"});
        }

        const updatedNote = await Note.findByIdAndUpdate(req.params.id, noteData, { new: true, runValidators: true });

        res.json({ note: updatedNote, message:`Note ${req.params.id} updated` });
    }
    catch(error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
})

notesRouter.delete('/:id', async (req,res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: "Note with that ID does not exist"});
        }

        if (note.user.toString() !== req.userId) {
            return res.status(403).json({message: "Forbidden"});
        }

        await Note.findByIdAndDelete({ _id: req.params.id });

        res.json({ message:`Note ${req.params.id} deleted` });
    }
    catch(error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = notesRouter;