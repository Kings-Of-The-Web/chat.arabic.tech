import { NextRequest, NextResponse } from 'next/server';

import RoomRepository from '@/lib/helpers/RoomRepository';
import UserRepository from '@/lib/helpers/UserRepository';

export async function POST(request: NextRequest, { params }: { params: { roomId: string } }) {
    try {
        const { roomId } = params;
        const { username } = await request.json();

        if (!username) {
            return NextResponse.json({ error: 'username is required' }, { status: 400 });
        }

        // Check if user exists
        const user = await UserRepository.getUserByUsername(username);
        if (!user) {
            return NextResponse.json(
                {
                    error: 'User does not exist in the database',
                    details: { username },
                },
                { status: 400 }
            );
        }

        // Check if room exists
        const roomExists = await RoomRepository.getRoomById(roomId);
        if (!roomExists) {
            return NextResponse.json(
                {
                    error: 'Room does not exist',
                    details: { roomId },
                },
                { status: 404 }
            );
        }


        // Add user to room
        const success = await RoomRepository.addUserToRoom(roomId, username);
        if (!success) {
            console.error(`Failed to add user ${username} to room ${roomId}`);
            return NextResponse.json(
                {
                    error: 'Failed to join room',
                    details: { roomId, username },
                },
                { status: 500 }
            );
        }

        // Get updated room details
        try {
            const room = await RoomRepository.getRoomById(roomId);
            if (!room) {
                return NextResponse.json(
                    { error: 'Room not found after joining' },
                    { status: 404 }
                );
            }

            return NextResponse.json({ success: true, room });
        } catch (roomError) {
            console.error('Error getting room details after joining:', roomError);
            return NextResponse.json(
                {
                    error: 'Joined room but failed to get updated details',
                    details: roomError instanceof Error ? roomError.message : String(roomError),
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Failed to join room:', error);
        return NextResponse.json(
            {
                error: 'Failed to join room',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
