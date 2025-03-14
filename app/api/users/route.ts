import { NextRequest, NextResponse } from 'next/server';
import UserRepository from '@/lib/helpers/UserRepository';

export async function POST(request: NextRequest) {
    try {
        // Add error handling for JSON parsing
        let body;
        try {
            body = await request.json();
        } catch (parseError) {
            console.error('Failed to parse request body:', parseError);
            return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
        }

        const { username, name } = body as App.User;

        if (!username) {
            return NextResponse.json({ error: 'username is required' }, { status: 400 });
        }

        // Create user in the database
        let user: App.User;
        try {
            user = await UserRepository.createUser({
                username,
                name: name || 'Anonymous',
            });
            
            // Set isOnline flag
            await UserRepository.updateUserOnlineStatus(username, true);
            user.isOnline = true;
        } catch (dbError) {
            console.error('Failed to create user in database:', dbError);
            return NextResponse.json({ error: 'Failed to create user in database' }, { status: 500 });
        }

        // Create response with user data
        const response = NextResponse.json(user);

        // Set cookie with user information
        // Cookie will expire in 30 days
        const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
        response.cookies.set({
            name: 'ArabicTech_User',
            value: JSON.stringify(user),
            maxAge: thirtyDaysInSeconds,
            path: '/',
            sameSite: 'lax',
            secure: true,
            httpOnly: true,
        });

        return response;
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, name } = body as App.User;

        if (!username || !name) {
            return NextResponse.json({ error: 'username and name are required' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await UserRepository.getUserByUsername(username);
        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update user in database
        const success = await UserRepository.updateUser(username, { name });
        if (!success) {
            return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
        }
        
        // Get updated user
        const user = await UserRepository.getUserByUsername(username);
        if (!user) {
            return NextResponse.json({ error: 'Failed to retrieve updated user' }, { status: 500 });
        }

        // Create response with updated user data
        const response = NextResponse.json(user);

        // Update cookie with user information
        // Cookie will expire in 30 days
        const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
        response.cookies.set({
            name: 'ArabicTech_User',
            value: JSON.stringify(user),
            maxAge: thirtyDaysInSeconds,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
        });

        return response;
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

        // Get users from database
        const users = await UserRepository.getUsersByUsernames(ids);

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
