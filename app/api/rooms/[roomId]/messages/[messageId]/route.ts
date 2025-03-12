import { promises as fs } from 'node:fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const DB_PATH = path.join(process.cwd(), 'DB', 'messages');

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
        const { isRead } = body;

        if (typeof isRead !== 'boolean') {
            return NextResponse.json(
                { error: 'Invalid value for isRead - must be a boolean' },
                { status: 400 }
            );
        }

        const messagePath = path.join(DB_PATH, roomId, `${messageId}.json`);

        // Check if directory exists
        try {
            await fs.access(path.dirname(messagePath));
        } catch {
            return NextResponse.json({ error: `Room ${roomId} not found` }, { status: 404 });
        }

        // Check if message exists
        try {
            await fs.access(messagePath);
        } catch {
            return NextResponse.json(
                { error: `Message ${messageId} not found in room ${roomId}` },
                { status: 404 }
            );
        }

        const messageData = await fs.readFile(messagePath, 'utf8');
        const message = JSON.parse(messageData);

        message.isRead = isRead;
        if (isRead) {
            message.isReadAt = new Date();
        }

        await fs.writeFile(messagePath, JSON.stringify(message, null, 2));

        return NextResponse.json(message);
    } catch (error) {
        console.error('Error updating message:', error);
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Invalid message data format' }, { status: 400 });
        }
        return NextResponse.json(
            { error: 'Internal server error while updating message' },
            { status: 500 }
        );
    }
}
