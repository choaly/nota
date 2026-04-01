import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import Dashboard from "./components/Dashboard"
import NoteView from "./components/NoteView"
import { getNotes, createNote, updateNote, deleteNote } from "./services/notes.js"

function App() {
  // State to track which view to show: 'dashboard' or 'noteView'
  const [currentView, setCurrentView] = useState('dashboard');

  // State to track which note is currently being viewed/edited
  const [currentNote, setCurrentNote] = useState(null);

  // State to store all notes - initialize directly from localStorage
  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);

      try {
        const data = await getNotes();
        setNotes(data.notes);
      }
      catch(error) {
        setError(error.message);
      }
      finally { //finally LWAYS runs try succeeded or catch fired
        setLoading(false);
      }
    }

    fetchNotes();
  }, []); // useEffect runs once on mount

  // Handler function for when "New Note" button is clicked
  const handleNewNote = () => {
    setCurrentNote(null); // Clear any existing note (we're creating a new one)
    setCurrentView('noteView'); // Switch to the note editor view
  };

  // Handler function for when user clicks on an existing note to edit it
  const handleEditNote = (note) => {
    setCurrentNote(note); // Set the note to edit
    setCurrentView('noteView'); // Switch to the note editor view
  };

  // Handler function to go back to dashboard
  const handleBackToDashboard = () => {
    setCurrentView('dashboard'); // Switch back to dashboard view
    setCurrentNote(null); // Clear the current note
  };

  // Handler function to save a note (create new or update existing)
  const handleSaveNote = async (noteData) => {
    try {
      if (currentNote) {
        // Editing existing note - update it
        const data = await updateNote(currentNote._id, noteData);
        
        const updatedNotes = notes.map(note => 
          note._id === currentNote._id ? data.note : note
        );
        setNotes(updatedNotes);
      } else {
        // Creating new note
        const data = await createNote({
          title: noteData.title,
          content: noteData.content,
        });
        // Add the new note to the beginning of the array
        setNotes([data.note, ...notes]);
      }
    } catch(error) {
        alert('Failed to save note: ' + error.message);
        throw error;  // re-throw so NoteView knows the save failed
    }
  };

  // Handler function to delete a note
  const handleDeleteNote = async (noteId) => {
    try {
      // Confirm before deleting
      if (window.confirm('Are you sure you want to delete this note?')) {
        await deleteNote(noteId);
        const filteredNotes = notes.filter(note => note._id !== noteId);
        setNotes(filteredNotes);
      }
    } catch(error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <Sidebar
          onNewNote={handleNewNote}
          onNoteClick={handleEditNote}
          notes={notes}
          // collapsed={sidebarCollapsed}
          // onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        {/* Conditional rendering: show Dashboard or NoteView based on currentView */}

        {loading ? (
          <p>Loading notes...</p>
        ) : error ? (
          <p>{error}</p>
        ) : currentView === 'dashboard' ? (
          <Dashboard notes={notes} onNoteClick={handleEditNote} />
        ) : (
          <NoteView
            note={currentNote}
            onBack={handleBackToDashboard}
            onSave={handleSaveNote}
            onDelete={handleDeleteNote}
          />
        )}
      </div>
    </>
  )
}

export default App