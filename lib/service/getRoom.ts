export async function getRoom(roomId: string): Promise<App.Room> {
  const response = await fetch(`/api/rooms/${roomId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to get room details');
  }

  const data = await response.json();
  return data as App.Room;
}
