export async function joinRoom(roomId: string, username: string): Promise<void> {
    const response = await fetch(`/api/rooms/${roomId}/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
    });

    if (!response.ok) {
        throw new Error('Failed to join room');
    }
}
