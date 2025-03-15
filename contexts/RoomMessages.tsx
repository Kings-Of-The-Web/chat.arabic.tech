'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';

import { getMessagesByRoomId } from '@/lib/service/getMessagesByRoomId';
import { useWebSocket } from './WebSocket';

interface RoomMessagesContextType {
    messages: App.Message[];
    isLoading: boolean;
    messagesIsFetched: boolean;
}

const RoomMessagesContext = createContext<RoomMessagesContextType>({
    messages: [],
    isLoading: true,
    messagesIsFetched: false,
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
    const [messagesIsFetched, setMessagesIsFetched] = useState(false);
    const { lastMessage } = useWebSocket();
    const { user } = useUser();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const fetchedMessages = await getMessagesByRoomId(roomId, user?.username || '');
                setMessages(fetchedMessages);
                setMessagesIsFetched(true);
            } catch (error) {
                console.error('Error fetching room messages:', error);
                setMessages([]);
                setMessagesIsFetched(false);
            } finally {
                setIsLoading(false);
                setMessagesIsFetched(true);
            }
        };

        fetchMessages().then((r) => r);
    }, [roomId, user?.username]);

    // Listen for new messages from WebSocket
    useEffect(() => {
        if (lastMessage && lastMessage.type === 'sendMessage' && lastMessage.roomId === roomId) {
            const newMessage: App.Message = {
                messageId: lastMessage.messageId,
                body: lastMessage.body,
                timestamp: new Date(lastMessage.timestamp),
                isRead: lastMessage.isRead,
                username: lastMessage.username,
                roomId: lastMessage.roomId,
            };

            setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
    }, [lastMessage, roomId]);

    return (
        <RoomMessagesContext.Provider value={{ messages, isLoading, messagesIsFetched }}>
            {children}
        </RoomMessagesContext.Provider>
    );
}
