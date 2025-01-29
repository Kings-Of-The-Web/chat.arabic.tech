import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = path.join(process.cwd(), 'DB', 'messages');

export async function GET(request: NextRequest, { params }: { params: { roomId: string } }) {
    try {
        const { roomId } = params;
        const messagesDir = path.join(DB_PATH, roomId);

        // Create messages directory if it doesn't exist
        await fs.mkdir(messagesDir, { recursive: true });

        try {
            // Read all message files in the room's message directory
            const messageFiles = await fs.readdir(messagesDir);

            // Read and parse each message file
            const messages = await Promise.all(
                messageFiles.map(async (fileName) => {
                    const messagePath = path.join(messagesDir, fileName);
                    const messageData = await fs.readFile(messagePath, 'utf8');
                    return JSON.parse(messageData);
                })
            );

            // Sort messages by timestamp
            const sortedMessages = messages.sort(
                (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );

            return NextResponse.json(sortedMessages);
        } catch (error) {
            // If directory is empty or doesn't exist, return empty array
            return NextResponse.json([]);
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: { roomId: string } }) {
    try {
        const { roomId } = params;
        const body = await request.json();
        const { userId, messageBody } = body;

        if (!userId || !messageBody) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create messages directory if it doesn't exist
        await fs.mkdir(path.join(DB_PATH, roomId), { recursive: true });

        const newMessage: App.Message = {
            messageId: uuidv4(),
            userId,
            roomId,
            body: messageBody,
            timestamp: new Date(),
            isRead: false,
        };

        const filePath = path.join(DB_PATH, roomId, `${newMessage.messageId}.json`);
        await fs.writeFile(filePath, JSON.stringify(newMessage, null, 2));

        return NextResponse.json(newMessage);
    } catch (error) {
        console.error('Error saving message:', error);
        return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }
}
