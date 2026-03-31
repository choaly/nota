const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Untitled Note'
    },
    content: String
}, {timestamps: true})

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;