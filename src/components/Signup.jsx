import {useState} from 'react'
import styles from './Signup.module.css';
import { useAuth } from '../context/AuthContext';

export default function Signup({ switchToLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await signup(email, password);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.topBar}>
                <h1 className={styles.logo}>Nota</h1>
                <div className={styles.topBarButtons}>
                    <button className={styles.topBarButton} onClick={switchToLogin}>Log In</button>
                    <button className={styles.topBarButton}>Sign Up</button>
                </div>
            </header>
            <div className={styles.container}>
                <h2 className={styles.title}>Sign Up</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className={styles.submitButton} type="submit">Sign Up</button>
                </form>
                <p className={styles.toggleText}>
                    Already have an account? <button type="button" className={styles.toggleButton} onClick={switchToLogin}>Login Now</button>
                </p>
            </div>
        </div>
    )
}
