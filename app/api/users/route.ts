import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {

        // Add error handling for JSON parsing
        let body;
        try {
            body = await request.json();
        } catch (parseError) {
            console.error('Failed to parse request body:', parseError);
            return NextResponse.json(
                { error: 'Invalid JSON in request body' },
                { status: 400 }
            );
        }

        const { userId, name } = body as App.User;

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        // Create users directory if it doesn't exist
        const usersDir = path.join(process.cwd(), 'DB', 'users');
        await fs.mkdir(usersDir, { recursive: true });

        const userPath = path.join(usersDir, `${userId}.json`);
        const user: App.User = {
            userId,
            name: name || 'Anonymous',
            isOnline: true,
        };

        await fs.writeFile(userPath, JSON.stringify(user, null, 2));

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, name } = body as App.User;

        if (!userId || !name) {
            return NextResponse.json(
                { error: 'userId and name are required' },
                { status: 400 }
            );
        }

        const usersDir = path.join(process.cwd(), 'DB', 'users');
        const userPath = path.join(usersDir, `${userId}.json`);

        // Check if user exists
        try {
            await fs.access(userPath);
        } catch {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Read existing user data
        const userData = await fs.readFile(userPath, 'utf8');
        const user = JSON.parse(userData) as App.User;

        // Update name
        user.name = name;

        // Save updated user data
        await fs.writeFile(userPath, JSON.stringify(user, null, 2));

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const ids = searchParams.getAll('ids');

        if (!ids.length) {
            return NextResponse.json({ error: 'No user IDs provided' }, { status: 400 });
        }

        const usersDir = path.join(process.cwd(), 'DB', 'users');
        const users = await Promise.all(
            ids.map(async (id) => {
                try {
                    const userPath = path.join(usersDir, `${id}.json`);
                    const userData = await fs.readFile(userPath, 'utf8');
                    return JSON.parse(userData) as App.User;
                } catch {
                    // Return basic user info if file doesn't exist
                    return {
                        userId: id,
                        name: 'Anonymous',
                        isOnline: true,
                    } as App.User;
                }
            })
        );

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}