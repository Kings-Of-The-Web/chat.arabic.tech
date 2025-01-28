"use client";

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ChatRoomHeader } from '@/components/ChatRoom/ChatRoomHeader';
import { MessageList } from '@/components/ChatRoom/MessageList';
import { MessageInput } from '@/components/ChatRoom/MessageInput';
import { ActiveUsersSidebar } from '@/components/ChatRoom/ActiveUsersSidebar';
import { useUser } from '@/contexts/UserContext';
import { joinRoom } from '@/lib/service/joinRoom';
import { RoomUsersProvider } from '@/contexts/RoomUsers';

const CURRENT_USER_ID = 'current-user';
const SYSTEM_USER_ID = 'system';

export default function ChatRoom() {

  ////////////////////////
  // State Variables
  ////////////////////////
  const [messages, setMessages] = useState<App.Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  ////////////////////////
  // Contexts
  ////////////////////////
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();



  ////////////////////////
  // Refs
  ////////////////////////
  const scrollRef = useRef<HTMLDivElement>(null);
  const roomId = params.roomId as string;


  ////////////////////////
  // Handlers
  ////////////////////////
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


  /////////////////////////
  // Effects
  /////////////////////////
  // Join room when component mounts
  useEffect(() => {
    const handleJoinRoom = async () => {
      if (!user?.userId) return;
      
      try {
        await joinRoom(roomId, user.userId);
      } catch (error) {
        toast.error('فشل في الانضمام إلى الغرفة');
        router.push('/');
      }
    };
    handleJoinRoom();
  }, [roomId, user?.userId, router]);


  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-violet-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-violet-600 dark:text-violet-400">جارٍ التحميل...</div>
      </div>
    );
  }

  return (
    <RoomUsersProvider roomId={roomId}>
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

            <ActiveUsersSidebar />
          </div>
        </div>
      </main>
    </RoomUsersProvider>
  );
}