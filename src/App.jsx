import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import Dashboard from "./components/Dashboard"
import NoteView from "./components/NoteView"

function App() {
  // State to track which view to show: 'dashboard' or 'noteView'
  const [currentView, setCurrentView] = useState('dashboard');

  // State to track which note is currently being viewed/edited
  const [currentNote, setCurrentNote] = useState(null);

  // State to store all notes - initialize directly from localStorage
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]); // Runs whenever 'notes' changes

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
  const handleSaveNote = (noteData) => {
    if (currentNote) {
      // Editing existing note - update it
      const updatedNotes = notes.map(note =>
        note.id === currentNote.id
          ? {
              ...note,
              title: noteData.title,
              content: noteData.content,
              updatedAt: new Date().toISOString()
            }
          : note
      );
      setNotes(updatedNotes);
    } else {
      // Creating new note
      const newNote = {
        id: Date.now(), // Simple unique ID using timestamp
        title: noteData.title,
        content: noteData.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      // Add the new note to the beginning of the array
      setNotes([newNote, ...notes]);
    }
  };

  // Handler function to delete a note
  const handleDeleteNote = (noteId) => {
    // Confirm before deleting
    if (window.confirm('Are you sure you want to delete this note?')) {
      const filteredNotes = notes.filter(note => note.id !== noteId);
      setNotes(filteredNotes);
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
        {currentView === 'dashboard' ? (
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