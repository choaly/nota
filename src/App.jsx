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

  // Handler function to go back to dashboard
  const handleBackToDashboard = () => {
    setCurrentView('dashboard'); // Switch back to dashboard view
    setCurrentNote(null); // Clear the current note
  };

  // Handler function to save a note
  const handleSaveNote = (noteData) => {
    const newNote = {
      id: Date.now(), // Simple unique ID using timestamp
      title: noteData.title,
      content: noteData.content,
      createdAt: new Date().toISOString(), // Save the current date/time
      updatedAt: new Date().toISOString()
    };

    // Add the new note to the beginning of the array
    setNotes([newNote, ...notes]);
  };

  return (
    <>
      <Header />
      <div className="container">
        <Sidebar
          onNewNote={handleNewNote}
          notes={notes}
          // collapsed={sidebarCollapsed}
          // onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        {/* Conditional rendering: show Dashboard or NoteView based on currentView */}
        {currentView === 'dashboard' ? (
          <Dashboard notes={notes} />
        ) : (
          <NoteView
            onBack={handleBackToDashboard}
            onSave={handleSaveNote}
          />
        )}
      </div>
    </>
  )
}

export default App