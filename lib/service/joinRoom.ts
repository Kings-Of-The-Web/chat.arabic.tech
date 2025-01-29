import { connectWebSocket } from './websocket';

export async function joinRoom(roomId: string, userId: string): Promise<void> {
  const response = await fetch(`/api/rooms/${roomId}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to join room');
  }

  // Connect to WebSocket after successfully joining the room
  connectWebSocket(roomId, userId);
}
