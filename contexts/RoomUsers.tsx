'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useWebSocket } from '@/contexts/WebSocket';

import { getRoom } from '@/lib/service/getRoom';
import { getUsersByIds } from '@/lib/service/getUsersByIds';

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
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage?.type === 'users_update') {
      setUsers(lastMessage.users);
    }
  }, [lastMessage]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const room = await getRoom(roomId);
        if (room.users) {
          setUsers(room.users);
        } else {
          const users = await getUsersByIds(room.userIds);
          setUsers(users);
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
    <RoomUsersContext.Provider value={{ users, isLoading }}>{children}</RoomUsersContext.Provider>
  );
}
