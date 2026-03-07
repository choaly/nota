import {useState} from 'react'
import styles from './Dashboard.module.css';
import { Search, Clock, Grid, List, ChevronLeft } from 'lucide-react';

export default function Dashboard({ notes }) {
    const [viewMode, setViewMode] = useState('grid');

    // Helper function to format the date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        } else {
            return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
        }
    };

    // Helper function to get a preview of content (first 150 chars)
    const getContentPreview = (content) => {
        if (!content) return 'No content...';
        return content.length > 150 ? content.substring(0, 150) + '...' : content;
    };

    return (
        <>
            <main className={styles.mainView}>
                <div className={styles.welcome}>
                    <h1 className={styles.welcomeTitle}>Welcome back!</h1>
                    <p className={styles.welcomeSubtitle}>Ready to transform your notes into powerful learning tools?</p>
                </div>

                <div className={styles.mainHeader}>
                    <h2 className={styles.mainTitle}>All Notes</h2>
                    <div className={styles.controls}>
                        <input
                            type="text"
                            placeholder="Search notes..."
                            className={styles.mainSearchInput}
                        />
                        <button className={styles.iconButton}>
                            <Search size={20} />
                        </button>
                        <button 
                            className={{
                            ...styles.iconButton,
                            backgroundColor: viewMode === 'grid' ? '#4a3f30' : '#6b5d4f'
                            }}
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid size={20} />
                        </button>
                    </div>
                </div>
                <div className={styles.notesGrid}>
                    {notes.length === 0 ? (
                        <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999', padding: '2rem' }}>
                            No notes yet. Click "New Note" to create your first note!
                        </p>
                    ) : (
                        notes.map((note) => (
                            <div
                                key={note.id}
                                className={styles.noteCard}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                }}
                            >
                                <h3 className={styles.noteCardTitle}>{note.title}</h3>
                                <p className={styles.noteCardDescription}>
                                    {getContentPreview(note.content)}
                                </p>
                                <div className={styles.noteCardFooter}>
                                    <div className={styles.noteCardTime}>
                                        <Clock size={14} />
                                        {formatDate(note.createdAt)}
                                    </div>
                                    <span
                                        className={styles.noteCardTag}
                                        style={{
                                            backgroundColor: '#4a3f30',
                                            color: '#fff'
                                        }}
                                    >
                                        Note
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </>
    )
}