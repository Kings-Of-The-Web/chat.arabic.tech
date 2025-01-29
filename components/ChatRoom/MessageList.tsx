import { useCallback, useEffect, useRef, useState } from 'react';
import { useRoomMessages } from '@/contexts/RoomMessages';
import { useWebSocket } from '@/contexts/WebSocket';

import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { NewMessageNotification } from './NewMessageNotification';

interface MessageListProps {
    currentUserId: string;
}

export function MessageList({ currentUserId }: MessageListProps) {
    /////////////////////////
    // State & Refs
    /////////////////////////
    const [showNotification, setShowNotification] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    /////////////////////////
    // Contexts
    /////////////////////////
    const { messages } = useRoomMessages();
    const { isNewMessage, isOwnMessage, resetNewMessageState } = useWebSocket();

    /////////////////////////
    // Handlers
    /////////////////////////
    const scrollToBottom = useCallback(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector(
                '[data-radix-scroll-area-viewport]'
            );
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
                setShowNotification(false);
                resetNewMessageState();
            }
        }
    }, [resetNewMessageState]);

    /////////////////////////
    // Effects
    /////////////////////////
    /**
     * Show notification when a new message is received, and it's not from the current user
     */
    useEffect(() => {
        if (isNewMessage && !isOwnMessage) {
            setShowNotification(true);
        }
    }, [isNewMessage, isOwnMessage]);

    /**
     * Scroll to bottom when sending own messages
     */
    useEffect(() => {
        if (isNewMessage && isOwnMessage) {
            scrollToBottom();
        }
    }, [isNewMessage, isOwnMessage, scrollToBottom]);

    return (
        <div className="relative flex-1">
            <ScrollArea
                ref={scrollAreaRef}
                className="h-full pr-4"
                style={{ maxHeight: 'calc(100vh - 250px)' }}
            >
                <div className="space-y-4">
                    {messages.map((message) => (
                        <MessageBubble
                            key={message.messageId}
                            message={message}
                            isOwnMessage={message.userId === currentUserId}
                        />
                    ))}
                </div>
            </ScrollArea>
            {showNotification && <NewMessageNotification onScrollToBottom={scrollToBottom} />}
        </div>
    );
}
