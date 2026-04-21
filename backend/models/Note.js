const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'Untitled Note',
        trim: true,
        maxlength: [200, 'Title too long']
    },
    content: {
        type: String,
        default: '',
        maxlength: [50000, 'Content too long'],
    }
}, {timestamps: true})

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;