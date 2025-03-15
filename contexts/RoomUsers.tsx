'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { getRoom } from '@/lib/service/getRoom';

interface RoomUsersContextType {
    users: App.User[];
    isLoading: boolean;
}

const RoomUsersContext = createContext<RoomUsersContextType>({
    users: [],
    isLoading: true,
});

export const useRoomUsers = () => useContext(RoomUsersContext);

export function RoomUsersProvider({
    children,
    roomId,
}: {
    children: React.ReactNode;
    roomId: string;
}) {
    const [users, setUsers] = useState<App.User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const room = (await getRoom(roomId)) as App.Room;
                if (room.users) {
                    setUsers(room.users);
                }
            } catch (error) {
                console.error('Error fetching room users:', error);
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [roomId]);

    return (
        <RoomUsersContext.Provider value={{ users, isLoading }}>
            {children}
        </RoomUsersContext.Provider>
    );
}
