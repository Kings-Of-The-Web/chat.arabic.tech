import { connectWebSocket } from './websocket';

export async function createRoom(userId: string): Promise<string> {
  const response = await fetch('/api/rooms', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to create room');
  }

  const data = await response.json();
  console.log('Room created:', data);
  const roomId = data.roomId;

  // Connect to WebSocket server
  console.log('Attempting to connect to WebSocket server...', { roomId, userId });
  const wsConnection = connectWebSocket(roomId, userId);
  console.log('WebSocket connection initiated:', wsConnection?.readyState);

  return roomId;
}