import fs from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest, { params }: { params: { roomId: string } }) {
    try {
        const { roomId } = params;
        const { username } = await request.json();

        if (!username) {
            return NextResponse.json({ error: 'username is required' }, { status: 400 });
        }

        // Check if user exists and create if not
        const usersDir = path.join(process.cwd(), 'DB', 'users');
        await fs.mkdir(usersDir, { recursive: true });
        const userPath = path.join(usersDir, `${username}.json`);

        try {
            await fs.access(userPath);
        } catch {
            // User doesn't exist, create them
            const user: App.User = {
                username,
                name: 'Anonymous',
                isOnline: true,
            };
            await fs.writeFile(userPath, JSON.stringify(user, null, 2));
        }

        // Check if room exists
        const roomsDir = path.join(process.cwd(), 'DB', 'rooms');
        const roomPath = path.join(roomsDir, `${roomId}.json`);

        try {
            // Try to read the room file
            const roomData = await fs.readFile(roomPath, 'utf-8');
            const room = JSON.parse(roomData) as App.Room;

            // Add user to the room if not already present
            if (!room.usernames.includes(username)) {
                room.usernames.push(username);
                await fs.writeFile(roomPath, JSON.stringify(room, null, 2));

                // Create and save the join event
                const eventsDir = path.join(process.cwd(), 'DB', 'events');
                await fs.mkdir(eventsDir, { recursive: true });

                const event: App.Event = {
                    username,
                    roomId,
                    type: 'joined',
                    timestamp: new Date(),
                };

                const eventId = uuidv4();
                const eventPath = path.join(eventsDir, `${eventId}.json`);
                await fs.writeFile(eventPath, JSON.stringify(event, null, 2));
            }

            return NextResponse.json({ success: true, room });
        } catch (error) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Failed to join room:', error);
        return NextResponse.json({ error: 'Failed to join room' }, { status: 500 });
    }
}
