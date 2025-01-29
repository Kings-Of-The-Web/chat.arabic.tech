import { forwardRef } from 'react';
import { useRoomMessages } from '@/contexts/RoomMessages';

import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  currentUserId: string;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ currentUserId }, ref) => {
    const { messages } = useRoomMessages();

    return (
      <ScrollArea className="flex-1 pr-4" ref={ref}>
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
    );
  }
);

MessageList.displayName = 'MessageList';
