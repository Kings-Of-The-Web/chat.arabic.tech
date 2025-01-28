export async function sendMessage(
  roomId: string,
  message: Pick<App.Message, 'userId' | 'body'>
): Promise<void> {
  const response = await fetch(`/api/rooms/${roomId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }
}
