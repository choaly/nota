import {useState, useEffect} from 'react'
import styles from './NoteView.module.css';

export default function NoteView({ note, onBack, onSave, onDelete }) {
    // State to hold the note title - initialize with existing note or default
    const [noteTitle, setNoteTitle] = useState(note ? note.title : 'New Note...');

    // State to hold the note content - initialize with existing note or empty
    const [noteContent, setNoteContent] = useState(note ? note.content : '');

    // Update state when note prop changes (when switching between notes)
    useEffect(() => {
        if (note) {
            setNoteTitle(note.title);
            setNoteContent(note.content);
        } else {
            setNoteTitle('New Note...');
            setNoteContent('');
        }
    }, [note]);

    // Handler for saving the note
    const handleSave = () => {
        // Don't save if title is empty or still default
        if (!noteTitle.trim() || noteTitle === 'New Note...') {
            alert('Please enter a title for your note!');
            return;
        }

        // Call the parent's save function with note data
        onSave({
            title: noteTitle,
            content: noteContent
        });

        onBack(); // Go back to dashboard
    };

    // Handler for deleting the note
    const handleDelete = () => {
        if (note) {
            // Only delete if we're editing an existing note
            onDelete(note.id);
            onBack(); // Go back to dashboard
        } else {
            // If creating a new note, just go back without saving
            onBack();
        }
    };

    return (
        <main className={styles.noteView}>
            {/* Heading to show if editing or creating */}
            {/* <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                {note ? 'Editing Note' : 'New Note'}
            </p> */}

            {/* Editable note title */}
            <input
                type="text"
                className={styles.noteTitle}
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Untitled Note"
            />

            {/* Text editor area */}
            <textarea
                className={styles.noteEditor}
                placeholder="New note..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
            />

            {/* Action buttons container */}
            <div className={styles.buttonContainer}>
                <div className={styles.leftButtons}>
                    <button className={styles.saveButton} onClick={handleSave}>
                        Save
                    </button>
                    <button className={styles.quizButton}>
                        Generate Quiz
                    </button>
                </div>
                <button className={styles.deleteButton} onClick={handleDelete}>
                    Delete
                </button>
            </div>
        </main>
    )
}