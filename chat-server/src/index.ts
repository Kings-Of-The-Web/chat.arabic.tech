import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3019;

// Store connected clients by room
interface WebSocketClient extends WebSocket {
  roomId?: string;
  userId?: string;
}

const rooms = new Map<string, Set<WebSocketClient>>();

wss.on('connection', (ws: WebSocketClient) => {
  console.log('New client connected');

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to WebSocket server'
  }));

  // Handle incoming messages
  ws.on('message', (data: string) => {
    try {
      const parsedData = JSON.parse(data.toString());
      console.log('Received:', parsedData);
      
      if (parsedData.type === 'join') {
        const { roomId, userId } = parsedData;
        
        // Store client information
        ws.roomId = roomId;
        ws.userId = userId;
        
        // Create room if it doesn't exist
        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Set());
        }
        
        // Add client to room
        rooms.get(roomId)?.add(ws);
        
        // Notify room about new user
        rooms.get(roomId)?.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'userJoined',
              userId,
              roomId
            }));
          }
        });
      } else {
        // Broadcast message only to clients in the same room
        const roomId = ws.roomId;
        if (roomId && rooms.has(roomId)) {
          rooms.get(roomId)?.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(parsedData));
            }
          });
        }
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
    if (ws.roomId && rooms.has(ws.roomId)) {
      const room = rooms.get(ws.roomId);
      room?.delete(ws);
      
      // Remove room if empty
      if (room?.size === 0) {
        rooms.delete(ws.roomId);
      } else {
        // Notify remaining clients about user leaving
        room?.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'userLeft',
              userId: ws.userId,
              roomId: ws.roomId
            }));
          }
        });
      }
    }
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    if (ws.roomId && rooms.has(ws.roomId)) {
      rooms.get(ws.roomId)?.delete(ws);
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