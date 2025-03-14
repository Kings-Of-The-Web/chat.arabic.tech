import db from './Database';

class EventRepository {
    /**
     * Get events for a room
     */
    async getEventsForRoom(roomId: string, limit = 50, offset = 0): Promise<App.Event[]> {
        const events = await db.query<any[]>(
            `SELECT username, room_id, type, timestamp
       FROM events
       WHERE room_id = ?
       ORDER BY timestamp DESC
       LIMIT ? OFFSET ?`,
            [roomId, limit, offset]
        );

        return events.map((e) => ({
            username: e.username,
            roomId: e.room_id,
            type: e.type as 'joined' | 'left',
            timestamp: e.timestamp,
        }));
    }

    /**
     * Create an event
     */
    async createEvent(event: {
        username: string;
        roomId: string;
        type: 'joined' | 'left';
    }): Promise<App.Event> {
        const timestamp = new Date();

        await db.query('INSERT INTO events (username, room_id, type) VALUES (?, ?, ?)', [
            event.username,
            event.roomId,
            event.type,
        ]);

        return {
            username: event.username,
            roomId: event.roomId,
            type: event.type,
            timestamp,
        };
    }

    /**
     * Delete events for a room
     */
    async deleteEventsForRoom(roomId: string): Promise<void> {
        await db.query('DELETE FROM events WHERE room_id = ?', [roomId]);
    }
}

export default new EventRepository();
