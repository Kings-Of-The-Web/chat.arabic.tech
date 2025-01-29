import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface MessageBubbleProps {
    message: App.Message;
    isOwnMessage: boolean;
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
    return (
        <div className={`flex ${isOwnMessage ? 'justify-start' : 'justify-end'}`}>
            <div
                className={`max-w-[70%] rounded-lg p-3 ${
                    isOwnMessage
                        ? 'bg-violet-500 text-white'
                        : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                }`}
            >
                <div className="mb-1 text-sm font-bold">{message.userId}</div>
                <div className="mb-1">{message.body}</div>
                <div className="text-xs opacity-90 cursor-pointer">
                    {format(message.timestamp, 'p', { locale: ar })}
                    {!isOwnMessage && message.isRead && message.isReadAt && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button className="mr-1 opacity-100 hover:underline">
                                        • مقروء
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-hacen">
                                        تم القراءة في {format(message.isReadAt, 'p', { locale: ar })}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </div>
        </div>
    );
}
