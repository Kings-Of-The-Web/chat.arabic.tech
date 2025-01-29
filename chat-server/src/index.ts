import { createServer } from 'http';
import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';

// App types
declare namespace App {
    interface Event {
        userId: string;
        roomId: string;
        type: 'joined' | 'left';
        timestamp: Date;
    }
}

// WebSocket Event Types
interface CreateRoomEvent {
    type: 'createRoom';
    userId: string;
    roomId: string;
}

interface JoinRoomEvent {
    type: 'joinRoom';
    userId: string;
    roomId: string;
}

interface SendMessageEvent {
    type: 'sendMessage';
    messageId: string;
    userId: string;
    roomId: string;
    body: string;
    timestamp: Date;
    isRead: boolean;
}

interface LeaveRoomEvent {
    type: 'leaveRoom';
    userId: string;
    roomId: string;
    timestamp: Date;
}

interface ReadMessageEvent {
    type: 'readMessage';
    userId: string;
    roomId: string;
    messageId: string;
    timestamp: Date;
    isReadAt: Date;
}

type WebSocketEvent =
    | CreateRoomEvent
    | JoinRoomEvent
    | SendMessageEvent
    | LeaveRoomEvent
    | ReadMessageEvent;

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3019;

// Store connected clients by room
interface WebSocketClient extends WebSocket {
    roomId?: string;
    userId?: string;
}

// Store connected clients by room in a Map
// Each map entry is a room ID with a Set of connected clients(users)
const rooms = new Map<string, Set<WebSocketClient>>();

wss.on('connection', (ws: WebSocketClient) => {
    console.log('New client connected');

    // Send welcome message
    ws.send(
        JSON.stringify({
            type: 'connection',
            message: 'Connected to WebSocket server',
        })
    );

    // Handle incoming messages
    ws.on('message', (data: string) => {
        try {
            const parsedData = JSON.parse(data.toString()) as WebSocketEvent;
            console.log('Received:', parsedData);

            switch (parsedData.type) {
                case 'createRoom': {
                    const { roomId, userId } = parsedData;
                    if (!rooms.has(roomId)) {
                        rooms.set(roomId, new Set());
                    }
                    ws.roomId = roomId;
                    ws.userId = userId;
                    rooms.get(roomId)?.add(ws);

                    // Notify about room creation and user joining
                    rooms.get(roomId)?.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(
                                JSON.stringify({
                                    type: 'joined',
                                    userId,
                                    roomId,
                                    timestamp: new Date(),
                                } satisfies App.Event)
                            );
                        }
                    });
                    break;
                }

                case 'joinRoom': {
                    const { roomId, userId } = parsedData;
                    ws.roomId = roomId;
                    ws.userId = userId;

                    if (!rooms.has(roomId)) {
                        rooms.set(roomId, new Set());
                    }
                    rooms.get(roomId)?.add(ws);

                    // Notify room about new user
                    rooms.get(roomId)?.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(
                                JSON.stringify({
                                    type: 'joined',
                                    userId,
                                    roomId,
                                    timestamp: new Date(),
                                } satisfies App.Event)
                            );
                        }
                    });
                    break;
                }

                case 'sendMessage': {
                    const { roomId } = parsedData;
                    if (roomId && rooms.has(roomId)) {
                        // Send message to each user in the room
                        rooms.get(roomId)?.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify(parsedData));
                            }
                        });
                    }
                    break;
                }

                case 'readMessage': {
                    const { roomId } = parsedData;
                    if (roomId && rooms.has(roomId)) {
                        // Broadcast the read status to all users in the room
                        rooms.get(roomId)?.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify(parsedData));
                            }
                        });
                    }
                    break;
                }

                case 'leaveRoom': {
                    const { roomId, userId } = parsedData;
                    if (roomId && rooms.has(roomId)) {
                        const room = rooms.get(roomId);
                        room?.delete(ws); // Remove only the requesting user from the room

                        // If this was the last user, delete the room
                        if (room?.size === 0) {
                            rooms.delete(roomId);
                        } else {
                            // Notify others that user left the room
                            room?.forEach((client) => {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(
                                        JSON.stringify({
                                            type: 'left',
                                            userId,
                                            roomId,
                                            timestamp: new Date(),
                                        } satisfies App.Event)
                                    );
                                }
                            });
                        }
                    }
                    break;
                }
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
        if (ws.roomId && ws.userId && rooms.has(ws.roomId)) {
            const room = rooms.get(ws.roomId);
            room?.delete(ws); // Remove the client/user from the room

            // If this was the last user, delete the room
            if (room?.size === 0) {
                rooms.delete(ws.roomId);
            } else {
                // Notify remaining clients about user leaving
                room?.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(
                            JSON.stringify({
                                type: 'left',
                                userId: ws.userId!,
                                roomId: ws.roomId!,
                                timestamp: new Date(),
                            } satisfies App.Event)
                        );
                    }
                });
            }
        }
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        if (ws.roomId && ws.userId && rooms.has(ws.roomId)) {
            const room = rooms.get(ws.roomId);
            room?.delete(ws);

            // If this was the last user, delete the room
            if (room?.size === 0) {
                rooms.delete(ws.roomId);
            } else {
                // Notify remaining clients about user leaving
                room?.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(
                            JSON.stringify({
                                type: 'left',
                                userId: ws.userId!,
                                roomId: ws.roomId!,
                                timestamp: new Date(),
                            } satisfies App.Event)
                        );
                    }
                });
            }
        }
    });
});

// Basic health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

server.listen(PORT, () => {
    console.log(`WebSocket server is running on port ${PORT}`);
});
