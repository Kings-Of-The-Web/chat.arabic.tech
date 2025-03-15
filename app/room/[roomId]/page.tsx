'use client';

import { useParams } from 'next/navigation';
import { RoomMessagesProvider } from '@/contexts/RoomMessages';
import { RoomUsersProvider } from '@/contexts/RoomUsers';
import { useUser } from '@/contexts/UserContext';
import { WebSocketProvider } from '@/contexts/WebSocket';

import { ChatRoomContent } from '@/components/ChatRoom/ChatRoomContent';

export default function ChatRoom() {
    const params = useParams();
    const roomId = params.roomId as string;
    const { user } = useUser();

    if (!user?.username) {
        return null; // or some loading state/redirect
    }

    return (
        <WebSocketProvider roomId={roomId} username={user.username}>
            <RoomUsersProvider roomId={roomId}>
                <RoomMessagesProvider roomId={roomId}>
                    <ChatRoomContent />
                </RoomMessagesProvider>
            </RoomUsersProvider>
        </WebSocketProvider>
    );
}
