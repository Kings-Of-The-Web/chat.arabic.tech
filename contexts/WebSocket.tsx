'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Get WebSocket URL and configuration from environment variables with fallbacks
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3019';
const RECONNECT_INTERVAL = Number(process.env.WS_HEARTBEAT_INTERVAL) || 30000; // 30 seconds
const CLIENT_TIMEOUT = Number(process.env.WS_CLIENT_TIMEOUT) || 120000; // 2 minutes

let ws: WebSocket | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;

// App Event Types (matching server)
interface AppEvent {
    userId: string;
    roomId: string;
    type: 'joined' | 'left';
    timestamp: Date;
}

// WebSocket Event Types (matching server)
interface BaseEvent {
    type: string;
    userId: string;
    roomId: string;
}

interface CreateRoomEvent extends BaseEvent {
    type: 'createRoom';
}

interface JoinRoomEvent extends BaseEvent {
    type: 'joinRoom';
}

interface SendMessageEvent extends BaseEvent {
    type: 'sendMessage';
    messageId: string;
    body: string;
    timestamp: Date;
    isRead: boolean;
}

interface LeaveRoomEvent extends BaseEvent {
    type: 'leaveRoom';
    timestamp: Date;
}

interface ReadMessageEvent extends BaseEvent {
    type: 'readMessage';
    messageId: string;
    timestamp: Date;
}

// Server response types
interface ConnectionResponse {
    type: 'connection';
    message: string;
}

type WebSocketEvent =
    | CreateRoomEvent
    | JoinRoomEvent
    | SendMessageEvent
    | LeaveRoomEvent
    | ReadMessageEvent;
type ServerMessage = AppEvent | SendMessageEvent | ReadMessageEvent | ConnectionResponse;

interface WebSocketContextType {
    sendMessage: (message: WebSocketEvent) => void;
    isConnected: boolean;
    lastMessage: ServerMessage | null;
    isNewMessage: boolean;
    isOwnMessage: boolean;
    connect: (roomId: string, userId: string) => WebSocket;
    disconnect: () => void;
    resetNewMessageState: () => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
    sendMessage: () => {},
    isConnected: false,
    lastMessage: null,
    isNewMessage: false,
    isOwnMessage: false,
    connect: () => {
        throw new Error('Not implemented');
    },
    disconnect: () => {},
    resetNewMessageState: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

export function WebSocketProvider({
    children,
    roomId,
    userId,
}: {
    children: React.ReactNode;
    roomId: string;
    userId: string;
}) {
    ////////////////////////
    // State Variables
    ////////////////////////
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<ServerMessage | null>(null);
    const [isNewMessage, setIsNewMessage] = useState(false);
    const [isOwnMessage, setIsOwnMessage] = useState(false);

    ////////////////////////
    // Handlers
    ////////////////////////
    /**
     * Send a message over the WebSocket connection
     */
    const sendMessage = useCallback((message: WebSocketEvent) => {
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket is not connected, message not sent');
            return;
        }
        ws.send(JSON.stringify(message));
    }, []);

    /**
     * Connect to the WebSocket server
     */
    const connect = useCallback((roomId: string, userId: string) => {
        if (ws) {
            ws.close();
        }

        // Clear any existing reconnect timeout
        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
            reconnectTimeout = null;
        }

        ws = new WebSocket(WS_URL);

        ws.onopen = function (this: WebSocket) {
            setIsConnected(true);
            console.log('Connected to WebSocket server');

            // Send join room event
            this.send(
                JSON.stringify({
                    type: 'joinRoom',
                    roomId,
                    userId,
                } satisfies JoinRoomEvent)
            );
        };

        ws.onclose = function (this: WebSocket) {
            setIsConnected(false);
            console.log('Disconnected from WebSocket server, attempting to reconnect...');

            // Attempt to reconnect
            reconnectTimeout = setTimeout(() => {
                if (!ws || ws.readyState === WebSocket.CLOSED) {
                    connect(roomId, userId);
                }
            }, RECONNECT_INTERVAL);
        };

        ws.onmessage = function (this: WebSocket, event: MessageEvent) {
            try {
                const data = JSON.parse(event.data) as ServerMessage;
                console.log('Received message:', data);

                switch (data.type) {
                    case 'joined':
                    case 'left':
                        // Handle room events (user joined/left)
                        setLastMessage(data);
                        setIsNewMessage(false);
                        setIsOwnMessage(false);
                        break;
                    case 'sendMessage':
                        // Handle new message in chat
                        setLastMessage(data);
                        setIsNewMessage(true);
                        setIsOwnMessage(data.userId === userId);
                        break;
                    case 'readMessage':
                        // Handle message read status update
                        setLastMessage(data);
                        setIsNewMessage(false);
                        setIsOwnMessage(data.userId === userId);
                        break;
                    case 'connection':
                        // Handle connection confirmation
                        console.log('Connection confirmed:', data.message);
                        setLastMessage(data);
                        setIsNewMessage(false);
                        setIsOwnMessage(false);
                        break;
                    default:
                        console.warn('Unknown message type:', data);
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        ws.onerror = function (this: WebSocket, error: Event) {
            console.error('WebSocket error:', error);
            setIsConnected(false);
        };

        return ws;
    }, []);

    /**
     * Disconnect from the WebSocket server
     */
    const disconnect = useCallback(() => {
        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
            reconnectTimeout = null;
        }
        if (ws) {
            ws.close();
            ws = null;
        }
        setIsConnected(false);
    }, []);

    /**
     * Reset new message state
     */
    const resetNewMessageState = useCallback(() => {
        setIsNewMessage(false);
    }, []);

    ////////////////////////
    // Effects
    ////////////////////////
    /**
     * Connect WebSocket on mount
     *
     * And, automatically disconnect WebSocket on unmount
     */
    useEffect(() => {
        connect(roomId, userId);

        return () => {
            disconnect();
        };
    }, [roomId, userId, connect, disconnect]);

    const webSocketContextValue = {
        sendMessage,
        isConnected,
        lastMessage,
        isNewMessage,
        isOwnMessage,
        connect,
        disconnect,
        resetNewMessageState,
    };

    return (
        <WebSocketContext.Provider value={webSocketContextValue}>
            {children}
        </WebSocketContext.Provider>
    );
}
