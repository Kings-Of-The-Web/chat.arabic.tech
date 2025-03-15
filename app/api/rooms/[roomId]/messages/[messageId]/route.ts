import { NextRequest, NextResponse } from 'next/server';

import MessageRepository from '@/lib/utils/database/MessageRepository';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { roomId: string; messageId: string } }
) {
    try {
        const { roomId, messageId } = params;

        // Validate parameters
        if (!roomId || !messageId) {
            return NextResponse.json(
                { error: 'Room ID and Message ID are required' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { isRead, username } = body;

        if (typeof isRead !== 'boolean' || !username) {
            return NextResponse.json(
                { error: 'Invalid request - must provide isRead (boolean) and username' },
                { status: 400 }
            );
        }

        // Mark message as read
        if (isRead) {
            await MessageRepository.markMessagesAsRead([messageId], username);
        }

        // Get updated message using the new method
        const message = await MessageRepository.getMessageById(messageId, username);

        if (!message) {
            return NextResponse.json(
                { error: `Message ${messageId} not found in room ${roomId}` },
                { status: 404 }
            );
        }

        return NextResponse.json(message);
    } catch (error) {
        console.error('Error updating message:', error);
        return NextResponse.json(
            { error: 'Internal server error while updating message' },
            { status: 500 }
        );
    }
}
