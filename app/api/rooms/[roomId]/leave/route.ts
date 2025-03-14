import { NextRequest, NextResponse } from 'next/server';
import RoomRepository from '@/lib/helpers/RoomRepository';

export async function POST(request: NextRequest, { params }: { params: { roomId: string } }) {
    try {
        const { roomId } = params;
        const { username } = await request.json();

        if (!username) {
            return NextResponse.json({ error: 'username is required' }, { status: 400 });
        }

        const success = await RoomRepository.removeUserFromRoom(roomId, username);
        if (!success) {
            return NextResponse.json({ error: 'Failed to leave room' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to leave room' }, { status: 500 });
    }
}
