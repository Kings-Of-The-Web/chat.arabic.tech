declare module App {
    export interface User {
        username: string;
        name: string;
        isOnline?: boolean;
    }
    export interface Room {
        roomId: string;
        usernames: string[];
        users?: User[];
    }
    export interface Message {
        messageId: string;
        username: string;
        roomId: string;
        body: string;
        timestamp: Date;
        isRead: boolean;
        isReadAt?: Date;
    }
    export interface Event {
        username: string;
        roomId: string;
        type: 'joined' | 'left';
        timestamp: Date;
    }
}
