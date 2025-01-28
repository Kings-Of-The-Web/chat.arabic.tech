export async function saveMessage(userId: string, roomId: string, messageBody: string) : Promise<App.Message> {
  const response = await fetch(`/api/rooms/${roomId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      messageBody,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save message');
  }

  return response.json();
}