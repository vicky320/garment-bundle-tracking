import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'auth';

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(() => {
        try {
            const saved = localStorage.getItem(AUTH_STORAGE_KEY);
            return saved ? JSON.parse(saved) : { user: null, token: null };
        } catch {
            return { user: null, token: null };
        }
    });

    useEffect(() => {
        if (auth?.token) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
        } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    }, [auth]);

    const login = (authData) => setAuth(authData);
    const logout = () => setAuth({ user: null, token: null });

    return (
        <AuthContext.Provider value={{ user: auth.user, token: auth.token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
