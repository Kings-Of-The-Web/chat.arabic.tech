import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
  };

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
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
} 