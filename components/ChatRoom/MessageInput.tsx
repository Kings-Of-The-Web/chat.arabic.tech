import { FormEvent, KeyboardEvent, useCallback, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useWebSocket } from '@/contexts/WebSocket';
import { Send } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { saveMessage } from '@/lib/service/rooms/messages/saveMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
    roomId: string;
}

export function MessageInput({ roomId }: MessageInputProps) {
    /////////////////////////
    // State
    /////////////////////////
    const [message, setMessage] = useState('');

    /////////////////////////
    // Contexts
    /////////////////////////
    const { user } = useUser();
    const { sendMessage, resetNewMessageState } = useWebSocket();

    /////////////////////////
    // Handlers
    /////////////////////////
    const handleSendMessage = useCallback(async () => {
        if (!message.trim()) return;
        if (!user?.username) return;

        // Save message in the DB
        const savedMessage = await saveMessage(user.username, roomId, message);

        // Send through WebSocket to the chat server
        sendMessage({
            type: 'sendMessage',
            messageId: savedMessage.messageId,
            username: savedMessage.username,
            roomId: savedMessage.roomId,
            body: savedMessage.body,
            timestamp: savedMessage.timestamp,
            isRead: savedMessage.isRead,
        });

        resetNewMessageState();
        setMessage('');
    }, [message, roomId, user?.username, sendMessage]);

    const handleKeyPress = useCallback(
        async (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                await handleSendMessage();
            }
        },
        [handleSendMessage]
    );

    const handleSubmit = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            await handleSendMessage();
        },
        [handleSendMessage]
    );

    return (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-row-reverse gap-2">
            <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
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
