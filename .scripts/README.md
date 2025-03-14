# Database Setup

This directory contains scripts for setting up and managing the MySQL database for the chat application.

## Configuration

The database connection is configured using environment variables in the `.env` file:

```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=chatarabictech
MYSQL_USER=chatarabictech
MYSQL_PASSWORD=your_password
```

## Database Schema

The database schema consists of the following tables:

1. **users** - Stores user information

    - `username` (Primary Key)
    - `name`
    - `password`
    - `created_at`
    - `updated_at`
    - `last_online`

2. **rooms** - Stores chat rooms

    - `room_id` (Primary Key)
    - `created_at`
    - `updated_at`

3. **room_users** - Stores the relationship between rooms and users

    - `room_id` (Foreign Key)
    - `username` (Foreign Key)
    - `joined_at`

4. **messages** - Stores chat messages

    - `message_id` (Primary Key)
    - `username` (Foreign Key)
    - `room_id` (Foreign Key)
    - `body`
    - `timestamp`

5. **message_read_status** - Tracks which messages have been read by which users

    - `message_id` (Foreign Key)
    - `username` (Foreign Key)
    - `is_read`
    - `read_at`

6. **events** - Stores room events (e.g., user joined, user left)
    - `event_id` (Primary Key)
    - `username` (Foreign Key)
    - `room_id` (Foreign Key)
    - `type` (joined/left)
    - `timestamp`

## Setup

To set up the database, run:

```bash
yarn db:setup
```

This will create all the necessary tables if they don't already exist.

## Helper Classes

The application includes several helper classes to interact with the database:

- `Database.ts` - Handles the database connection
- `UserRepository.ts` - Handles user-related operations
- `RoomRepository.ts` - Handles room-related operations
- `MessageRepository.ts` - Handles message-related operations
- `EventRepository.ts` - Handles event-related operations

These classes are located in the `lib/helpers` directory.
