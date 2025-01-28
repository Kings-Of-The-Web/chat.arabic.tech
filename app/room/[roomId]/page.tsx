"use client";

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ChatRoomHeader } from '@/components/ChatRoom/ChatRoomHeader';
import { MessageList } from '@/components/ChatRoom/MessageList';
import { MessageInput } from '@/components/ChatRoom/MessageInput';
import { ActiveUsersSidebar } from '@/components/ChatRoom/ActiveUsersSidebar';

const CURRENT_USER_ID = 'current-user';
const SYSTEM_USER_ID = 'system';

export default function ChatRoom() {
  const params = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<App.Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState<App.User[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const roomId = params.roomId as string;

  // Simulate fetching initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMessages([
          {
            messageId: '1',
            body: 'مرحباً بكم في الغرفة',
            userId: SYSTEM_USER_ID,
            timestamp: new Date(),
            isRead: true
          }
        ]);
        setIsLoading(false);
      } catch (error) {
        toast.error('حدث خطأ في تحميل الرسائل');
        router.push('/');
      }
    };

    fetchMessages();
    // Simulate active users
    setActiveUsers([
      { userId: '1', name: 'أحمد', isOnline: true },
      { userId: '2', name: 'محمد', isOnline: true },
      { userId: '3', name: 'سارة', isOnline: false }
    ]);
  }, [roomId, router]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (newMessage: string) => {
    const message: App.Message = {
      messageId: Date.now().toString(),
      body: newMessage,
      userId: CURRENT_USER_ID,
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, message]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-violet-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-violet-600 dark:text-violet-400">جارٍ التحميل...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-violet-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-4 h-screen flex flex-col">
        <ChatRoomHeader 
          roomId={roomId} 
          onBack={() => router.push('/')} 
        />

        <div className="flex-1 flex gap-4">
          {/* Main Chat Area */}
          <Card className="flex-1 p-4 bg-white dark:bg-gray-800 flex flex-col">
            <MessageList 
              ref={scrollRef}
              messages={messages}
              currentUserId={CURRENT_USER_ID}
            />
            <MessageInput onSendMessage={handleSendMessage} />
          </Card>

          <ActiveUsersSidebar users={activeUsers} />
        </div>
      </div>
    </main>
  );
}