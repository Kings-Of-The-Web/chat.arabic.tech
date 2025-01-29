import fs from 'fs/promises';
import path from 'path';
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextApiRequest) {
    try {
        // Generate a new UUID for the room
        const roomId = uuidv4();

        // Ensure the DB/rooms directory exists
        const roomsDir = path.join(process.cwd(), 'DB', 'rooms');
        await fs.mkdir(roomsDir, { recursive: true });

        // Check if room already exists
        const roomPath = path.join(roomsDir, `${roomId}.json`);
        try {
            await fs.access(roomPath);
            // If we get here, the room exists, return a new request
            return NextResponse.redirect(new URL('/api/rooms', request.url));
        } catch (error) {
            // Room doesn't exist, create it
            const room = {
                roomId,
                userIds: [],
                messageIds: [],
            };

            await fs.writeFile(roomPath, JSON.stringify(room, null, 2));
            return NextResponse.json({ roomId });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
    }
}
