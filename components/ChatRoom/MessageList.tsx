import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { forwardRef } from "react";

interface MessageListProps {
  messages: App.Message[];
  currentUserId: string;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, currentUserId }, ref) => {
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