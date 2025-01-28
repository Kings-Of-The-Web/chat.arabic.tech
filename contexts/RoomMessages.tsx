'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getMessagesByRoomId } from '@/lib/service/getMessagesByRoomId';

interface RoomMessagesContextType {
  messages: App.Message[];
  isLoading: boolean;
}

const RoomMessagesContext = createContext<RoomMessagesContextType>({
  messages: [],
  isLoading: true,
});

export const useRoomMessages = () => useContext(RoomMessagesContext);

export function RoomMessagesProvider({
  children,
  roomId,
}: {
  children: React.ReactNode;
  roomId: string;
}) {
  const [messages, setMessages] = useState<App.Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getMessagesByRoomId(roomId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching room messages:', error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds for new messages

    return () => {
      clearInterval(interval);
    };
  }, [roomId]);

  return (
    <RoomMessagesContext.Provider value={{ messages, isLoading }}>
      {children}
    </RoomMessagesContext.Provider>
  );
} 