import { useState, useEffect, useRef } from 'react';
import { User, ChevronDown } from 'lucide-react';
import styles from './Header.module.css';
import { useAuth } from '../context/AuthContext';

export default function Header({ onNavigate }) {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const displayName = user?.displayName || user?.email?.split('@')[0]?.replace(/^./, c => c.toUpperCase());

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className={styles.header}>
            <h1 className={styles.logo}>Nota</h1>
            <div className={styles.dropdownWrapper} ref={dropdownRef}>
                <button className={styles.button} onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <User size={20} />
                    <span>{displayName}</span>
                    <ChevronDown size={16} />
                </button>
                {dropdownOpen && (
                    <div className={styles.dropdown}>
                        <button
                            className={styles.dropdownItem}
                            onClick={() => { onNavigate('profileSettings'); setDropdownOpen(false); }}
                        >
                            Profile Settings
                        </button>
                        <button
                            className={styles.dropdownItem}
                            onClick={() => { logout(); setDropdownOpen(false); }}
                        >
                            Log Out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
