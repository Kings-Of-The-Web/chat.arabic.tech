declare module App{
    export interface  User{
        userId: string;
        name: string;
        isOnline: boolean;
    }
    export interface  Room{
        roomId: string;
        userIds: string[];
        messageIds: string[];
        users?: User[];
    }
    export interface  Message{
        messageId: string;
        userId: string;
        body: string;
        timestamp: Date;
        isRead: boolean;
    }
    export interface  Event{
        userId: string;
        roomId: string;
        type: 'joined' | 'left';
        timestamp: Date;
    }
}