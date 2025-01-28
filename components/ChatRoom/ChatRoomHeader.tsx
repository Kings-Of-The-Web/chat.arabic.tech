import { ArrowLeft, Copy, Check } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { useState } from 'react';
import { toast } from "sonner";

interface ChatRoomHeaderProps {
  roomId: string;
  onBack: () => void;
}

export function ChatRoomHeader({ roomId, onBack }: ChatRoomHeaderProps) {
  const [copied, setCopied] = useState(false);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('تم نسخ معرف الغرفة');
  };

  return (
    <Card className="p-4 mb-4 flex items-center justify-between bg-white dark:bg-gray-800">
      <button
        onClick={onBack}
        className="btn inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <h1 className="text-xl font-hacen font-bold text-gray-900 dark:text-white">
            غرفة المحادثة
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <button
              onClick={copyRoomId}
              className="inline-flex items-center hover:text-violet-600 dark:hover:text-violet-400"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="mr-1">{roomId}</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
} 