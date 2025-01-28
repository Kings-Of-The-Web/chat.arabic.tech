export async function getMessagesByRoomId(roomId: string): Promise<App.Message[]> {
  const response = await fetch(`/api/rooms/${roomId}/messages`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch messages');
  }

  return response.json();
}
