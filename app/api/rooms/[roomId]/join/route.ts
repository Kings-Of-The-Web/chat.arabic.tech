import { NextRequest, NextResponse } from 'next/server';
import RoomRepository from '@/lib/helpers/RoomRepository';

export async function POST(request: NextRequest, { params }: { params: { roomId: string } }) {
    try {
        const { roomId } = params;
        const { username } = await request.json();

        if (!username) {
            return NextResponse.json({ error: 'username is required' }, { status: 400 });
        }

        // Add user to room
        const success = await RoomRepository.addUserToRoom(roomId, username);
        if (!success) {
            return NextResponse.json({ error: 'Failed to join room' }, { status: 500 });
        }

        // Get updated room details
        const room = await RoomRepository.getRoomById(roomId);
        if (!room) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, room });
    } catch (error) {
        console.error('Failed to join room:', error);
        return NextResponse.json({ error: 'Failed to join room' }, { status: 500 });
    }
}
