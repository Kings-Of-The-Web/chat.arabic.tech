export async function leaveRoom(roomId: string, userId: string): Promise<void> {
  const response = await fetch(`/api/rooms/${roomId}/leave`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to leave room');
  }
}
