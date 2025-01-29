import { Button } from '@/components/ui/button';

interface NewMessageNotificationProps {
    onScrollToBottom: () => void;
}

export function NewMessageNotification({ onScrollToBottom }: NewMessageNotificationProps) {
    return (
        <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
            <Button
                variant="secondary"
                size="sm"
                className="animate-bounce rounded-full bg-primary px-4 py-2 font-hacen text-primary-foreground shadow-lg hover:bg-primary/90"
                onClick={onScrollToBottom}
            >
                ↓ رسائل جديدة
            </Button>
        </div>
    );
}
