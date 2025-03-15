'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { Cookies } from '@/lib/utils/Cookies';

interface UserContextType {
    user: App.User | null;
    setUser: (user: App.User | null) => void;
    updateUserName: (name: string) => void;
    logout: () => void;
}

//////////////////////////
// Initial State
//////////////////////////
const initialState = {
    user: null,
    setUser: () => {},
    updateUserName: () => {},
    logout: () => {},
};

const UserContext = createContext<UserContextType>(initialState);

export function UserContextProvider({
    children,
    initialUser,
}: {
    children: React.ReactNode;
    initialUser?: App.User | null;
}) {
    //////////////////////////
    // State Variables
    //////////////////////////
    const [user, setUserState] = useState<App.User | null>(initialUser ?? null);

    ///////////////////////
    // Handlers
    /////////////////////
    const setUser = (newUser: App.User | null) => {
        if (newUser) {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);
            Cookies.set('ArabicTech_User', JSON.stringify(newUser), { expires: expiryDate });
        }
        setUserState(newUser);
    };

    const updateUserName = (name: string) => {
        if (user) {
            const updatedUser = { ...user, name };
            setUser(updatedUser);
        }
    };

    const logout = () => {
        Cookies.remove('ArabicTech_User');
        setUserState(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, updateUserName, logout }}>
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
