import { v4 as uuidv4 } from 'uuid';

import db from './Database';

class MessageRepository {
    /**
     * Create a new message
     */
    async createMessage(message: {
        username: string;
        roomId: string;
        body: string;
    }): Promise<App.Message> {
        const messageId = uuidv4();
        const timestamp = new Date();

        await db.transaction(async (connection) => {
            // Insert the message
            await connection.execute(
                'INSERT INTO messages (message_id, username, room_id, body, timestamp) VALUES (?, ?, ?, ?, ?)',
                [messageId, message.username, message.roomId, message.body, timestamp]
            );

            // Get room users to set read status
            const roomUsers = await connection.execute(
                'SELECT username FROM room_users WHERE room_id = ?',
                [message.roomId]
            );

            // Set read status for all users in the room (sender has read it)
            for (const user of roomUsers[0] as any) {
                const isRead = user.username === message.username;
                await connection.execute(
                    'INSERT INTO message_read_status (message_id, username, is_read, read_at) VALUES (?, ?, ?, ?)',
                    [messageId, user.username, isRead, isRead ? timestamp : null]
                );
            }
        });

        return {
            messageId,
            username: message.username,
            roomId: message.roomId,
            body: message.body,
            timestamp,
            isRead: true,
        };
    }

    /**
     * Get messages for a room
     */
    async getMessagesForRoom(
        roomId: string,
        username: string,
        limit = 50,
        offset = 0
    ): Promise<App.Message[]> {
        // Ensure limit and offset are numbers
        const limitNum = typeof limit === 'string' ? parseInt(limit) : limit;
        const offsetNum = typeof offset === 'string' ? parseInt(offset) : offset;
        
        try {
            // Use a different approach for LIMIT and OFFSET
            const query = `
                SELECT m.message_id, m.username, m.room_id, m.body, m.timestamp, 
                mrs.is_read, mrs.read_at as isReadAt
                FROM messages m
                JOIN message_read_status mrs ON m.message_id = mrs.message_id
                WHERE m.room_id = ? AND mrs.username = ?
                ORDER BY m.timestamp DESC
                LIMIT ${limitNum} OFFSET ${offsetNum}
            `;
            
            const messages = await db.query<any[]>(query, [roomId, username]);
            
            return messages.map((m) => ({
                messageId: m.message_id,
                username: m.username,
                roomId: m.room_id,
                body: m.body,
                timestamp: m.timestamp,
                isRead: Boolean(m.is_read),
                isReadAt: m.isReadAt,
            }));
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    /**
     * Mark messages as read
     */
    async markMessagesAsRead(messageIds: string[], username: string): Promise<void> {
        if (messageIds.length === 0) return;

        const now = new Date();
        const placeholders = messageIds.map(() => '?').join(',');

        await db.query(
            `UPDATE message_read_status 
       SET is_read = TRUE, read_at = ? 
       WHERE message_id IN (${placeholders}) AND username = ? AND is_read = FALSE`,
            [now, ...messageIds, username]
        );
    }

    /**
     * Get unread message count for a user
     */
    async getUnreadMessageCount(username: string): Promise<{ roomId: string; count: number }[]> {
        return await db.query<{ roomId: string; count: number }[]>(
            `SELECT m.room_id as roomId, COUNT(*) as count
       FROM messages m
       JOIN message_read_status mrs ON m.message_id = mrs.message_id
       WHERE mrs.username = ? AND mrs.is_read = FALSE
       GROUP BY m.room_id`,
            [username]
        );
    }

    /**
     * Delete messages
     */
    async deleteMessages(messageIds: string[]): Promise<void> {
        if (messageIds.length === 0) return;

        const placeholders = messageIds.map(() => '?').join(',');
        await db.query(`DELETE FROM messages WHERE message_id IN (${placeholders})`, messageIds);
    }
}

export default new MessageRepository();
