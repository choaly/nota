import styles from './Sidebar.module.css';
import { Search, ChevronLeft } from 'lucide-react';
import {useState} from 'react'

export default function Sidebar({ onNewNote, notes, onNoteClick }) {
    const [activeNote, setActiveNote] = useState(null);

    // Helper function to format the date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInHours < 24) {
            return 'Today';
        } else if (diffInDays === 1) {
            return '1 day ago';
        } else {
            return `${diffInDays} days ago`;
        }
    };

    // if (collapsed) {
    //     return (
    //     <aside style={{...styles.sidebar, ...styles.sidebarCollapsed}}>
    //         <button style={styles.collapseButton} onClick={onToggleCollapse}>
    //         <ChevronLeft size={16} style={{transform: 'rotate(180deg)'}} />
    //         </button>
    //     </aside>
    //     );
    // }
    
    return (
        <>
            <aside className={styles.sidebar}>
                {/* add an onClick={onToggleCollapse} */}
                <button className={styles.collapseButton} > 
                    <ChevronLeft size={24} />
                </button>
                
                <button className={styles.newNoteButton} onClick={onNewNote}>
                    New Note
                </button>
                
                <div className={styles.searchBox}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        className={styles.searchInput}
                    />
                </div>
                
                <h2 className={styles.sidebarTitle}>All Notes</h2>

                <div className={styles.noteList}>
                    {notes.length === 0 ? (
                        <p style={{ color: '#999', padding: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                            No notes yet
                        </p>
                    ) : (
                        notes.slice(0, 10).map((note) => (
                            <button
                                key={note.id}
                                className={`${styles.noteItem} ${activeNote === note.id ? styles.noteItemActive : styles.noteItemInactive}`}
                                onClick={() => {
                                    setActiveNote(note.id);
                                    onNoteClick(note);
                                }}
                            >
                                <div className={styles.noteTitle}>{note.title}</div>
                                <div className={styles.noteTime}>{formatDate(note.createdAt)}</div>
                            </button>
                        ))
                    )}
                </div>
            </aside>
        </>
    )
}



// Sidebar Component
// const Sidebar = ({ collapsed, onToggleCollapse }) => {
//   const [activeNote, setActiveNote] = useState('React Fundamentals');
  
//   const sidebarNotes = [
//     { title: 'React Fundamentals', time: 'Today' },
//     { title: 'Intro to Kant and Deont...', time: '1 day ago' }
//   ];

//   if (collapsed) {
//     return (
//       <aside style={{...styles.sidebar, ...styles.sidebarCollapsed}}>
//         <button style={styles.collapseButton} onClick={onToggleCollapse}>
//           <ChevronLeft size={16} style={{transform: 'rotate(180deg)'}} />
//         </button>
//       </aside>
//     );
//   }

//   return (
//     <aside style={styles.sidebar}>
//       <button style={styles.collapseButton} onClick={onToggleCollapse}>
//         <ChevronLeft size={16} />
//       </button>
      
//       <button style={styles.newNoteButton}>New Note</button>
      
//       <div style={styles.searchBox}>
//         <Search size={18} style={styles.searchIcon} />
//         <input
//           type="text"
//           placeholder="Search notes..."
//           style={styles.searchInput}
//         />
//       </div>
      
//       <h2 style={styles.sidebarTitle}>All Notes</h2>
      
//       <div style={styles.noteList}>
//         {sidebarNotes.map((note) => (
//           <button
//             key={note.title}
//             style={{
//               ...styles.noteItem,
//               ...(activeNote === note.title ? styles.noteItemActive : {})
//             }}
//             onClick={() => setActiveNote(note.title)}
//             onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b4a999'}
//             onMouseOut={(e) => {
//               if (activeNote !== note.title) {
//                 e.currentTarget.style.backgroundColor = '#c4b9aa';
//               }
//             }}
//           >
//             <div style={styles.noteTitle}>{note.title}</div>
//             <div style={styles.noteTime}>{note.time}</div>
//           </button>
//         ))}
//       </div>
//     </aside>
//   );
// };
