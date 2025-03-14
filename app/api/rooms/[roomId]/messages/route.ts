import { NextRequest, NextResponse } from 'next/server';
import MessageRepository from '@/lib/helpers/MessageRepository';

export async function GET(
    request: NextRequest, 
    { params }: { params: { roomId: string } }
) {
    try {
        const { roomId } = params;
        const searchParams = request.nextUrl.searchParams;
        const username = searchParams.get('username');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        if (!username) {
            return NextResponse.json(
                { error: 'Username is required as a query parameter' },
                { status: 400 }
            );
        }

        const messages = await MessageRepository.getMessagesForRoom(
            roomId,
            username,
            limit,
            offset
        );

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { roomId: string } }
) {
    try {
        const { roomId } = params;
        const body = await request.json();
        const { username, messageBody } = body;

        if (!username || !messageBody) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newMessage = await MessageRepository.createMessage({
            username,
            roomId,
            body: messageBody
        });

        return NextResponse.json(newMessage);
    } catch (error) {
        console.error('Error saving message:', error);
        return NextResponse.json(
            { error: 'Failed to save message' },
            { status: 500 }
        );
    }
}