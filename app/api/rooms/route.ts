import { NextRequest, NextResponse } from 'next/server';
import RoomRepository from '@/lib/helpers/RoomRepository';

export async function POST(request: NextRequest) {
    try {
        // Create a new room with no initial users
        const room = await RoomRepository.createRoom([]);
        
        return NextResponse.json({ roomId: room.roomId });
    } catch (error) {
        console.error('Failed to create room:', error);
        return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
    }
}

// Optional: Add GET method to list all rooms if needed
export async function GET(request: NextRequest) {
    try {
        // You might want to add this method to RoomRepository
        const rooms = await RoomRepository.getAllRooms();
        return NextResponse.json(rooms);
    } catch (error) {
        console.error('Failed to get rooms:', error);
        return NextResponse.json({ error: 'Failed to get rooms' }, { status: 500 });
    }
}
