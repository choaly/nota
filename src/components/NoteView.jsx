import {useState, useEffect} from 'react'
import styles from './NoteView.module.css';
import { generateQuiz } from '../services/quiz';
import Quiz from './Quiz';
import { ChevronLeft } from 'lucide-react';

export default function NoteView({ note, onBack, onSave, onDelete }) {
    const [noteTitle, setNoteTitle] = useState(note ? note.title : 'New Note...');
    const [noteContent, setNoteContent] = useState(note ? note.content : '');
    const [saving, setSaving] = useState(false); //a boolean that's true while the save is in progress. Use it to disable the save button so the user can't double-click.

    const [quizQuestions, setQuizQuestions] = useState(null);
    const [loadingQuiz, setLoadingQuiz] = useState(false);

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
    const handleSave = async () => {
        // Don't save if title is empty or still default
        if (!noteTitle.trim() || noteTitle === 'New Note...') {
            alert('Please enter a title for your note!');
            return;
        }

        // Call the parent's save function with note data
        const noteData = {
            title: noteTitle,
            content: noteContent
        }

        setSaving(true);
        try {
            await onSave(noteData);
            onBack(); // Go back to dashboard
        } catch(error) { // save failed
            //stay on page
        } finally {
            setSaving(false);
        }

    };

    // Handler for deleting the note
    const handleDelete = () => {
        if (note) {
            // Only delete if we're editing an existing note
            onDelete(note._id);
            onBack(); // Go back to dashboard
        } else {
            // If creating a new note, just go back without saving
            onBack();
        }
    };

    const handleGenerateQuiz = async () => {
        if (!noteContent.trim()) {
            alert('Write some notes first before generating a quiz!');
            return;
        }
        setLoadingQuiz(true);
        
        try {
            const data = await generateQuiz(noteContent);
            setQuizQuestions(data.questions);
        } catch (error) {
            alert('Failed to generate quiz: ' + error.message);
        } finally {
            setLoadingQuiz(false);
        }
    }

    return (
        <>
            <main className={styles.noteView}>
                <button className={styles.backButton} onClick={onBack}>
                    <ChevronLeft size={20} />
                    Back
                </button>

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
                        <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : 'Save'}
                        </button>

                        <button className={styles.quizButton} onClick={handleGenerateQuiz} disabled={loadingQuiz}>
                            {loadingQuiz ? 'Generating...' : 'Generate Quiz'}
                        </button>
                    </div>
                    <button className={styles.deleteButton} onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </main>
            {quizQuestions && (
                <Quiz questions={quizQuestions} onClose={() => setQuizQuestions(null)} />
            )}
        </>
        
    )
}