import { createContext, useState, useContext } from 'react';
import * as authService from '../services/auth';

// 1. Create the context
const AuthContext = createContext();

// 2. Provider component — wraps the app
export function AuthProvider({ children }) {
    //Initialize from localStorage (runs once on first render)
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setToken(data.token);
        setUser({ id: data.id, email: data.email, displayName: data.displayName || '' });

        //Sync with localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ id: data.id, email: data.email, displayName: data.displayName || '' }));
    };

    const signup = async (email, password) => {
        const data = await authService.signup(email, password);
        setToken(data.token);
        setUser({ id: data.id, email: data.email, displayName: data.displayName || '' });

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ id: data.id, email: data.email, displayName: data.displayName || '' }));
    };

    const logout = () => {
        setToken(null);
        setUser(null);

        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateProfile = async (email, displayName) => {
        const data = await authService.updateProfile(email, displayName);
        const updatedUser = { id: data.id, email: data.email, displayName: data.displayName || '' };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const deleteAccount = async (password) => {
        await authService.deleteAccount(password);
        logout();
    };

    const value = { token, user, login, signup, logout, updateProfile, deleteAccount };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}