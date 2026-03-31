const express = require('express');
const Note = require('../models/Note');

const notesRouter = express.Router();

notesRouter.get('/', async (req, res) => {
    try {
        const notes = await Note.find({});
        res.json({ notes })
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
});

notesRouter.get('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            res.status(404).json({ message: "No note found"});
        } else {
            res.json({ note });
        }
    }
    catch(error) {
        res.status(500).json({ message: error.message })
    }
})

notesRouter.post('/', async (req, res) => {
    try {
        const note = await Note.create(req.body);

        res.status(201).json({ note });
    }
    catch(error) {
        res.status(500).json({ message: error.message });
    }
})

notesRouter.put('/:id', async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.json({ note, message:`Note ${req.params.id} updated` });
    }
    catch(error) {
        res.status(500).json({ message: error.message });
    }
})

notesRouter.delete('/:id', async (req,res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);

        res.json({ message:`Note ${req.params.id} deleted` });
    }
    catch(error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = notesRouter;