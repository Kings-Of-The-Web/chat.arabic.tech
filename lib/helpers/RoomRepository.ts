import { v4 as uuidv4 } from 'uuid';

import db from './Database';
import UserRepository from './UserRepository';

class RoomRepository {
    /**
     * Create a new room
     */
    async createRoom(usernames: string[]): Promise<App.Room> {
        const roomId = uuidv4();

        return await db.transaction(async (connection) => {
            // Create the room
            await connection.execute('INSERT INTO rooms (room_id) VALUES (?)', [roomId]);

            // Add users to the room
            for (const username of usernames) {
                await connection.execute(
                    'INSERT INTO room_users (room_id, username) VALUES (?, ?)',
                    [roomId, username]
                );

                // Add joined event
                await connection.execute(
                    'INSERT INTO events (username, room_id, type) VALUES (?, ?, ?)',
                    [username, roomId, 'joined']
                );
            }

            return {
                roomId,
                usernames,
            };
        });
    }

    /**
     * Get a room by ID
     */
    async getRoomById(roomId: string): Promise<App.Room | null> {
        const rooms = await db.query<{ room_id: string }[]>(
            'SELECT room_id FROM rooms WHERE room_id = ?',
            [roomId]
        );

        if (rooms.length === 0) return null;

        const users = await db.query<{ username: string }[]>(
            'SELECT username FROM room_users WHERE room_id = ?',
            [roomId]
        );

        const usernames = users.map((u) => u.username);
        const userDetails = await UserRepository.getUsersByUsernames(usernames);

        return {
            roomId,
            usernames,
            users: userDetails,
        };
    }

    /**
     * Get rooms for a user
     */
    async getRoomsForUser(username: string): Promise<App.Room[]> {
        const roomIds = await db.query<{ room_id: string }[]>(
            'SELECT room_id FROM room_users WHERE username = ?',
            [username]
        );

        const rooms: App.Room[] = [];

        for (const { room_id } of roomIds) {
            const room = await this.getRoomById(room_id);
            if (room) rooms.push(room);
        }

        return rooms;
    }

    /**
     * Add a user to a room
     */
    async addUserToRoom(roomId: string, username: string): Promise<boolean> {
        try {
            // First check if user is already in the room
            const existingUser = await db.query<any[]>(
                'SELECT * FROM room_users WHERE room_id = ? AND username = ?',
                [roomId, username]
            );
            
            // If user is already in the room, update the joined_at timestamp
            if (existingUser.length > 0) {
                console.log(`User ${username} is already in room ${roomId}, updating joined_at timestamp`);
                await db.query(
                    'UPDATE room_users SET joined_at = CURRENT_TIMESTAMP WHERE room_id = ? AND username = ?',
                    [roomId, username]
                );
                
                // Add a joined event (using 'joined' instead of 'rejoined' as the events table only allows 'joined' and 'left')
                await db.query(
                    'INSERT INTO events (username, room_id, type) VALUES (?, ?, ?)',
                    [username, roomId, 'joined']
                );
                
                return true;
            }
            
            // Try to insert the user into the room
            try {
                await db.transaction(async (connection) => {
                    await connection.execute(
                        'INSERT INTO room_users (room_id, username) VALUES (?, ?)',
                        [roomId, username]
                    );

                    await connection.execute(
                        'INSERT INTO events (username, room_id, type) VALUES (?, ?, ?)',
                        [username, roomId, 'joined']
                    );
                });
                return true;
            } catch (insertError: any) {
                // If the error is a duplicate entry, the user is already in the room
                if (insertError.code === 'ER_DUP_ENTRY') {
                    console.log(`User ${username} is already in room ${roomId} (caught duplicate)`);
                    // Update the joined_at timestamp
                    await db.query(
                        'UPDATE room_users SET joined_at = CURRENT_TIMESTAMP WHERE room_id = ? AND username = ?',
                        [roomId, username]
                    );
                    
                    // Add a joined event (using 'joined' instead of 'rejoined')
                    await db.query(
                        'INSERT INTO events (username, room_id, type) VALUES (?, ?, ?)',
                        [username, roomId, 'joined']
                    );
                    return true;
                }
                // Otherwise, rethrow the error
                throw insertError;
            }
        } catch (error) {
            console.error('Error adding user to room:', error);
            return false;
        }
    }

    /**
     * Remove a user from a room
     */
    async removeUserFromRoom(roomId: string, username: string): Promise<boolean> {
        try {
            await db.transaction(async (connection) => {
                await connection.execute(
                    'DELETE FROM room_users WHERE room_id = ? AND username = ?',
                    [roomId, username]
                );

                await connection.execute(
                    'INSERT INTO events (username, room_id, type) VALUES (?, ?, ?)',
                    [username, roomId, 'left']
                );

                // Check if room is empty and delete if it is
                const users = await connection.execute(
                    'SELECT COUNT(*) as count FROM room_users WHERE room_id = ?',
                    [roomId]
                );

                const count = (users[0] as any)[0].count;
                if (count === 0) {
                    await connection.execute('DELETE FROM rooms WHERE room_id = ?', [roomId]);
                }
            });

            return true;
        } catch (error) {
            console.error('Error removing user from room:', error);
            return false;
        }
    }

    /**
     * Get all rooms
     */
    async getAllRooms(): Promise<App.Room[]> {
        const rooms = await db.query<{ room_id: string }[]>(
            'SELECT room_id FROM rooms'
        );

        const roomDetails = await Promise.all(
            rooms.map(({ room_id }) => this.getRoomById(room_id))
        );

        // Filter out any null values (rooms that might have been deleted)
        return roomDetails.filter((room): room is App.Room => room !== null);
    }
}

export default new RoomRepository();
