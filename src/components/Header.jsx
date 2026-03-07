import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <h1 className={styles.logo}>Nota</h1>
            <button className={styles.button}>
                <div className={styles["profile-image"]}>
                👤
                </div>

                <span>Alyssa_test</span>
                <span>▼</span>
            </button>
        </header>
    )
}