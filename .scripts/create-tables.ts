import dotenv from 'dotenv';

import db from '../lib/helpers/Database';

// Load environment variables
dotenv.config();

async function createTables() {
    try {
        console.log('Creating database tables...');

        // Create users table
        await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        username VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_online TIMESTAMP NULL
      )
    `);
        console.log('Users table created or already exists');

        // Create rooms table
        await db.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        room_id VARCHAR(36) PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        console.log('Rooms table created or already exists');

        // Create room_users table (for many-to-many relationship)
        await db.query(`
      CREATE TABLE IF NOT EXISTS room_users (
        room_id VARCHAR(36) NOT NULL,
        username VARCHAR(50) NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (room_id, username),
        FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
        FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
      )
    `);
        console.log('Room users table created or already exists');

        // Create messages table
        await db.query(`
      CREATE TABLE IF NOT EXISTS messages (
        message_id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        room_id VARCHAR(36) NOT NULL,
        body TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
        FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
      )
    `);
        console.log('Messages table created or already exists');

        // Create message_read_status table
        await db.query(`
      CREATE TABLE IF NOT EXISTS message_read_status (
        message_id VARCHAR(36) NOT NULL,
        username VARCHAR(50) NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP NULL,
        PRIMARY KEY (message_id, username),
        FOREIGN KEY (message_id) REFERENCES messages(message_id) ON DELETE CASCADE,
        FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
      )
    `);
        console.log('Message read status table created or already exists');

        // Create events table
        await db.query(`
      CREATE TABLE IF NOT EXISTS events (
        event_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        room_id VARCHAR(36) NOT NULL,
        type ENUM('joined', 'left') NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
        FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
      )
    `);
        console.log('Events table created or already exists');

        console.log('All tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        await db.close();
    }
}

// Run the function if this file is executed directly
if (require.main === module) {
    createTables()
        .then(() => console.log('Database setup completed'))
        .catch((err) => console.error('Database setup failed:', err));
}

export default createTables;
