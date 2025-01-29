import { FormEvent, KeyboardEvent, useCallback, useState } from 'react';
import { useWebSocket } from '@/contexts/WebSocket';
import { Send } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
    roomId: string;
    userId: string;
}

export function MessageInput({ roomId, userId }: MessageInputProps) {
    /////////////////////////
    // State
    /////////////////////////
    const [message, setMessage] = useState('');

    /////////////////////////
    // Contexts
    /////////////////////////
    const { sendMessage } = useWebSocket();

    /////////////////////////
    // Handlers
    /////////////////////////
    const handleSendMessage = useCallback(() => {
        if (!message.trim()) return;

        sendMessage({
            type: 'sendMessage',
            messageId: uuidv4(),
            roomId,
            userId,
            body: message.trim(),
            timestamp: new Date(),
            isRead: false,
        });

        setMessage('');
    }, [message, roomId, userId, sendMessage]);

    const handleKeyPress = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
            }
        },
        [handleSendMessage]
    );

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            handleSendMessage();
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
