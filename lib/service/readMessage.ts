export async function readMessage(roomId: string, messageId: string): Promise<App.Message> {
    const response = await fetch(`/api/rooms/${roomId}/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            isRead: true,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.error || `Failed to mark message ${messageId} as read in room ${roomId}`
        );
    }

    const message = await response.json();
    return message;
}
