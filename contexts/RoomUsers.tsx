'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getRoom } from '@/lib/service/getRoom';

interface RoomUsersContextType {
  userIds: string[];
  isLoading: boolean;
}

const RoomUsersContext = createContext<RoomUsersContextType>({
  userIds: [],
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
  const [userIds, setUserIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const room = await getRoom(roomId);
        setUserIds(room.userIds);
      } catch (error) {
        console.error('Error fetching room users:', error);
        setUserIds([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
    // Set up polling to refresh users every 5 seconds
    const interval = setInterval(fetchUsers, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [roomId]);

  return (
    <RoomUsersContext.Provider value={{ userIds, isLoading }}>
      {children}
    </RoomUsersContext.Provider>
  );
}
