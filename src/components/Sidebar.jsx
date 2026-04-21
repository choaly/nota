import styles from './Sidebar.module.css';
import { Search, ChevronLeft } from 'lucide-react';
import {useState} from 'react'

export default function Sidebar({ onNewNote, notes, onNoteClick, collapsed, onToggleCollapse }) {
    const [activeNote, setActiveNote] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Helper function to format thedate
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';

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

    return (
        <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
            <button className={styles.collapseButton} onClick={onToggleCollapse}>
                <ChevronLeft size={24} style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }} />
            </button>

            {!collapsed && (
                <>
                    <button className={styles.newNoteButton} onClick={onNewNote}>
                        New Note
                    </button>

                    <div className={styles.searchBox}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <h2 className={styles.sidebarTitle}>All Notes</h2>

                    <div className={styles.noteList}>
                        {notes.length === 0 ? (
                            <p style={{ color: '#999', padding: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                                No notes yet
                            </p>
                        ) : (
                            [...notes]
                                .filter((note) => {
                                    const query = searchQuery.toLowerCase();
                                    return (
                                        (note.title || '').toLowerCase().includes(query) ||
                                        (note.content || '').toLowerCase().includes(query)
                                    );
                                })
                                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                                .slice(0, 10)
                                .map((note) => (
                                <button
                                    key={note._id}
                                    className={`${styles.noteItem} ${activeNote === note._id ? styles.noteItemActive : styles.noteItemInactive}`}
                                    onClick={() => {
                                        setActiveNote(note._id);
                                        onNoteClick(note);
                                    }}
                                >
                                    <div className={styles.noteTitle}>{note.title}</div>
                                    <div className={styles.noteTime}>{formatDate(note.updatedAt)}</div>
                                </button>
                            ))
                        )}
                    </div>
                </>
            )}
        </aside>
    )
}
