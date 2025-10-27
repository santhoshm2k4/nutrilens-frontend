"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
    token: string | null;
    user: { email: string } | null;
    isLoading: boolean; // <-- NEW: Add a loading state
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<{ email: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true); // <-- Start in a loading state

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('authToken');
            if (storedToken) {
                const decoded: { sub: string; exp: number } = jwtDecode(storedToken);
                // Check if the token is expired
                if (Date.now() >= decoded.exp * 1000) {
                    localStorage.removeItem('authToken');
                } else {
                    setToken(storedToken);
                    setUser({ email: decoded.sub });
                }
            }
        } catch (error) {
            console.error("Failed to process auth token on load", error);
            // Ensure token is cleared if it's invalid
            localStorage.removeItem('authToken');
        } finally {
            setIsLoading(false); // <-- Finish loading, regardless of outcome
        }
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
        const decoded: { sub: string } = jwtDecode(newToken);
        setUser({ email: decoded.sub });
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

