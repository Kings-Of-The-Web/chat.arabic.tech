import {Send} from 'lucide-react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useCallback, useState} from 'react';
import {saveMessage} from "@/lib/service/saveMessage";
import {useUser} from "@/contexts/UserContext";

interface MessageInputProps {
    roomId: string;
}

export function MessageInput({ roomId }: MessageInputProps) {
    const [newMessage, setNewMessage] = useState('');
    const { user } = useUser();

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        // Call the saveMessage service
        await saveMessage(user.userId, roomId, newMessage);

        setNewMessage('');
    }, [newMessage, user, roomId]);

    return (
            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                <Input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="اكتب رسالتك هنا..."
                        className="flex-1 text-right"
                        dir="rtl"
                />
                <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white">
                    <Send className="h-4 w-4"/>
                </Button>
            </form>
    );
} 