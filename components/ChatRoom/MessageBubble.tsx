import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface MessageBubbleProps {
  message: App.Message;
  isOwnMessage: boolean;
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          isOwnMessage
            ? 'bg-violet-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
        }`}
      >
        <div className="font-bold text-sm mb-1">{message.userId}</div>
        <div className="mb-1">{message.body}</div>
        <div className="text-xs opacity-75">
          {format(message.timestamp, 'p', { locale: ar })}
          {message.isRead && ' • تم القراءة'}
        </div>
      </div>
    </div>
  );
} 