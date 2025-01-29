'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Get WebSocket URL from environment variable with fallback
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://chat.arabic.tech';
const RECONNECT_INTERVAL = 3000; // 3 seconds

let ws: WebSocket | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;

interface WebSocketContextType {
  sendMessage: (message: any) => void;
  isConnected: boolean;
  lastMessage: any | null;
  connect: (roomId: string, userId: string) => WebSocket;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  sendMessage: () => {},
  isConnected: false,
  lastMessage: null,
  connect: () => {
    throw new Error('Not implemented');
  },
  disconnect: () => {},
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
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  const sendMessage = useCallback((message: any) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not connected, message not sent');
      return;
    }
    ws.send(JSON.stringify(message));
  }, []);

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
      this.send(
        JSON.stringify({
          type: 'join',
          roomId,
          userId,
        })
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
        const data = JSON.parse(event.data);
        console.log('Received message:', data);
        setLastMessage(data);
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

  useEffect(() => {
    const websocket = connect(roomId, userId);

    return () => {
      disconnect();
    };
  }, [roomId, userId, connect, disconnect]);

  return (
    <WebSocketContext.Provider
      value={{ sendMessage, isConnected, lastMessage, connect, disconnect }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}
