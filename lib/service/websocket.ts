let ws: WebSocket | null = null;

export function connectWebSocket(roomId: string, userId: string) {
  if (ws) {
    ws.close();
  }

  // Use the browser's native WebSocket
  ws = new WebSocket('ws://localhost:3019');

  ws.onopen = () => {
    console.log('Connected to WebSocket server');
    // Send initial connection message with room and user info
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'join',
        roomId,
        userId
      }));
    }
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);
      // Handle different message types here
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('Disconnected from WebSocket server');
    ws = null;
  };

  return ws;
}

export function sendWebSocketMessage(message: any) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    throw new Error('WebSocket is not connected');
  }

  ws.send(JSON.stringify(message));
}

export function closeWebSocket() {
  if (ws) {
    ws.close();
    ws = null;
  }
} 