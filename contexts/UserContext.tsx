'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Authentication } from '@/lib/helpers/Authentication';

interface UserContextType {
    user: App.User | null;
    setUser: (user: App.User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserContextProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<App.User | null>(null);

    useEffect(() => {
        const initializeUser = async () => {
            if (!user) {
                const fingerprint = await Authentication.generateFingerprint();
                setUser({ userId: fingerprint });
            }
        };

        initializeUser();
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserContextProvider');
    }
    return context;
}
