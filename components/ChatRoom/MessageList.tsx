import { useCallback, useEffect, useRef, useState } from 'react';
import { useRoomMessages } from '@/contexts/RoomMessages';
import { useWebSocket } from '@/contexts/WebSocket';

import { readMessage } from '@/lib/service/readMessage';
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
    const observerRef = useRef<IntersectionObserver | null>(null);

    /////////////////////////
    // Contexts
    /////////////////////////
    const { messages } = useRoomMessages();
    const { isNewMessage, isOwnMessage, resetNewMessageState } = useWebSocket();

    /////////////////////////
    // Handlers
    /////////////////////////
    const handleMessageVisibility = useCallback(
        async (entries: IntersectionObserverEntry[]) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const messageId = entry.target.getAttribute('data-message-id');
                    const message = messages.find((m) => m.messageId === messageId);
                    if (message && !message.isRead && message.userId !== currentUserId) {
                        console.log('Unread message visible:', message);
                        try {
                            await readMessage(message.roomId, message.messageId);
                        } catch (error) {
                            console.error('Failed to mark message as read:', error);
                        }
                    }
                }
            }
        },
        [messages, currentUserId]
    );

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
     * Initialize intersection observer
     */
    useEffect(() => {
        observerRef.current = new IntersectionObserver(handleMessageVisibility, {
            root: scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') || null,
            threshold: 0.5,
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [handleMessageVisibility]);

    /**
     * Observe new messages
     */
    useEffect(() => {
        const messageElements = document.querySelectorAll('[data-message-id]');
        messageElements.forEach((element) => {
            observerRef.current?.observe(element);
        });

        return () => {
            messageElements.forEach((element) => {
                observerRef.current?.unobserve(element);
            });
        };
    }, [messages]);

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
                        <div key={message.messageId} data-message-id={message.messageId}>
                            <MessageBubble
                                message={message}
                                isOwnMessage={message.userId === currentUserId}
                            />
                        </div>
                    ))}
                </div>
            </ScrollArea>
            {showNotification && <NewMessageNotification onScrollToBottom={scrollToBottom} />}
        </div>
    );
}
