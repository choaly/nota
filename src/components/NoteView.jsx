import {useState} from 'react'
import styles from './NoteView.module.css';

export default function NoteView({ onBack, onSave }) {
    // State to hold the note title
    const [noteTitle, setNoteTitle] = useState('New Note...');

    // State to hold the note content
    const [noteContent, setNoteContent] = useState('');

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
        // TODO: Later we'll handle deletion confirmation
        console.log('Deleting note');
        onBack(); // Go back to dashboard
    };

    return (
        <main className={styles.noteView}>
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