import db from './Database';

class UserRepository {
    /**
     * Create a new user
     */
    async createUser(user: { username: string; name: string }): Promise<App.User> {
        await db.query('INSERT INTO users (username, name) VALUES (?, ?)', [
            user.username,
            user.name,
        ]);

        return {
            username: user.username,
            name: user.name,
        };
    }

    /**
     * Get a user by username
     */
    async getUserByUsername(username: string): Promise<App.User | null> {
        const users = await db.query<App.User[]>(
            'SELECT username, name, (last_online IS NOT NULL AND last_online > DATE_SUB(NOW(), INTERVAL 5 MINUTE)) as isOnline FROM users WHERE username = ?',
            [username]
        );

        return users.length > 0 ? users[0] : null;
    }

    /**
     * Get multiple users by usernames
     */
    async getUsersByUsernames(usernames: string[]): Promise<App.User[]> {
        if (usernames.length === 0) return [];

        const placeholders = usernames.map(() => '?').join(',');
        return await db.query<App.User[]>(
            `SELECT username, name, (last_online IS NOT NULL AND last_online > DATE_SUB(NOW(), INTERVAL 5 MINUTE)) as isOnline 
       FROM users WHERE username IN (${placeholders})`,
            usernames
        );
    }

    /**
     * Update user's online status
     */
    async updateUserOnlineStatus(username: string, isOnline: boolean): Promise<void> {
        await db.query('UPDATE users SET last_online = ? WHERE username = ?', [
            isOnline ? new Date() : null,
            username,
        ]);
    }

    /**
     * Get user for authentication (includes password)
     */
    async getUserForAuth(username: string): Promise<{ username: string; password: string } | null> {
        const users = await db.query<{ username: string; password: string }[]>(
            'SELECT username, password FROM users WHERE username = ?',
            [username]
        );

        return users.length > 0 ? users[0] : null;
    }

    /**
     * Update a user
     */
    async updateUser(username: string, updates: { name?: string }): Promise<boolean> {
        try {
            if (updates.name) {
                await db.query('UPDATE users SET name = ? WHERE username = ?', [
                    updates.name,
                    username,
                ]);
            }
            return true;
        } catch (error) {
            console.error('Error updating user:', error);
            return false;
        }
    }
}

export default new UserRepository();
