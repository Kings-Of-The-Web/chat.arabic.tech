'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { getMessagesByRoomId } from '@/lib/service/getMessagesByRoomId';
import { useWebSocket } from './WebSocket';

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
    const { lastMessage } = useWebSocket();

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

        fetchMessages().then((r) => r);
    }, [roomId]);

    // Listen for new messages from WebSocket
    useEffect(() => {
        if (lastMessage && lastMessage.type === 'sendMessage' && lastMessage.roomId === roomId) {
            const newMessage: App.Message = {
                messageId: lastMessage.messageId,
                body: lastMessage.body,
                timestamp: new Date(lastMessage.timestamp),
                isRead: lastMessage.isRead,
                userId: lastMessage.userId,
                roomId: lastMessage.roomId,
            };

            setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
    }, [lastMessage, roomId]);

    return (
        <RoomMessagesContext.Provider value={{ messages, isLoading }}>
            {children}
        </RoomMessagesContext.Provider>
    );
}
