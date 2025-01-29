import { useCallback, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useWebSocket } from '@/contexts/WebSocket';
import { Send } from 'lucide-react';

import { saveMessage } from '@/lib/service/saveMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
    roomId: string;
}

export function MessageInput({ roomId }: MessageInputProps) {
    ////////////////////////
    // State Variables
    ////////////////////////
    const [newMessage, setNewMessage] = useState('');

    ////////////////////////
    // Context Variables
    ////////////////////////
    const { user } = useUser();
    const { sendMessage } = useWebSocket();

    ////////////////////////
    // Handlers
    ////////////////////////
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!newMessage.trim() || !user) return;

            try {
                // Save message to server
                const savedMessage = await saveMessage(user.userId, roomId, newMessage);

                // Send through WebSocket
                sendMessage({
                    type: 'sendMessage',
                    messageId: savedMessage.messageId,
                    userId: savedMessage.userId,
                    roomId: savedMessage.roomId,
                    body: savedMessage.body,
                    timestamp: savedMessage.timestamp,
                    isRead: savedMessage.isRead,
                });

                setNewMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        },
        [newMessage, user, roomId, sendMessage]
    );

    return (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-row-reverse gap-2">
            <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 text-right font-hacen"
                dir="rtl"
            />
            <Button type="submit" className="bg-violet-600 text-white hover:bg-violet-700">
                <Send className="h-4 w-4" />
            </Button>
        </form>
    );
}
