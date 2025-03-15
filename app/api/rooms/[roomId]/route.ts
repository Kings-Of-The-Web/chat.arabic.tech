import { NextRequest, NextResponse } from 'next/server';

import RoomRepository from '@/lib/helpers/RoomRepository';

export async function GET(request: NextRequest, { params }: { params: { roomId: string } }) {
    try {
        const { roomId } = params;

        const room = await RoomRepository.getRoomById(roomId);
        if (!room) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 });
        }

        return NextResponse.json(room);
    } catch (error) {
        console.error('Error reading room:', error);
        return NextResponse.json({ error: 'Failed to get room details' }, { status: 500 });
    }
}
