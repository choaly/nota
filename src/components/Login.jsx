import {useState} from 'react'
import styles from './Login.module.css';
import { useAuth } from '../context/AuthContext';

export default function Login({ switchToSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login(email, password);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.topBar}>
                <h1 className={styles.logo}>Nota</h1>
                <div className={styles.topBarButtons}>
                    <button className={styles.topBarButton}>Log In</button>
                    <button className={styles.topBarButton} onClick={switchToSignup}>Sign Up</button>
                </div>
            </header>
            <div className={styles.container}>
                <h2 className={styles.title}>Login</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.label}>Email:</label>
                    <input
                        className={styles.input}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className={styles.label}>Password:</label>
                    <input
                        className={styles.input}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className={styles.submitButton} type="submit">Login</button>
                </form>
                <p className={styles.toggleText}>
                    Don't have an account? <button type="button" className={styles.toggleButton} onClick={switchToSignup}>Sign Up Now</button>
                </p>
            </div>
        </div>
    )
}
