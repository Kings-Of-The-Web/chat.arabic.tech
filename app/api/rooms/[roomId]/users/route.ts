import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { roomId: string } }) {
  try {
    const roomId = params.roomId;
    const filePath = path.join(process.cwd(), 'DB', 'rooms', `${roomId}.json`);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      // Return empty users array if file doesn't exist
      return NextResponse.json({ users: [] });
    }

    // Read and parse the JSON file
    const fileContents = await fs.readFile(filePath, 'utf8');
    const roomData = JSON.parse(fileContents);

    return NextResponse.json({ users: roomData.users || [] });
  } catch (error) {
    console.error('Error reading room users:', error);
    return NextResponse.json({ users: [] });
  }
}
