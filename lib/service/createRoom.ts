export async function createRoom(username: string): Promise<string> {
    const response = await fetch('/api/rooms', {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Failed to create room');
    }

    const data = await response.json();
    return data.roomId;
}
