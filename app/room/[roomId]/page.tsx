'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RoomMessagesProvider, useRoomMessages } from '@/contexts/RoomMessages';
import { RoomUsersProvider } from '@/contexts/RoomUsers';
import { useUser } from '@/contexts/UserContext';
import { WebSocketProvider } from '@/contexts/WebSocket';
import { toast } from 'sonner';

import { joinRoom } from '@/lib/service/joinRoom';
import { ActiveUsersSidebar } from '@/components/ChatRoom/ActiveUsersSidebar';
import { ChatRoomHeader } from '@/components/ChatRoom/ChatRoomHeader';
import { MessageInput } from '@/components/ChatRoom/MessageInput';
import { MessageList } from '@/components/ChatRoom/MessageList';
import { Card } from '@/components/ui/card';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

const CURRENT_USER_ID = 'current';
const SYSTEM_USER_ID = 'system';

function ChatRoomContent() {
  ////////////////////////
  // State Variables
  ////////////////////////
  const [isLoading, setIsLoading] = useState(false);

  ////////////////////////
  // Contexts
  ////////////////////////
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { messages } = useRoomMessages();

  ////////////////////////
  // Refs
  ////////////////////////
  const scrollRef = useRef<HTMLDivElement>(null);
  const roomId = params.roomId as string;

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-violet-50 to-violet-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-violet-600 dark:text-violet-400">جارٍ التحميل...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-violet-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto flex h-screen flex-col px-4 py-4">
        <ChatRoomHeader roomId={roomId} onBack={() => router.push('/')} />

        <ResizablePanelGroup direction="horizontal" className="flex-1 rounded-lg">
          {/* Main Chat Area */}
          <ResizablePanel defaultSize={75} minSize={50}>
            <Card className="flex h-full flex-col bg-white p-4 dark:bg-gray-800">
              <MessageList ref={scrollRef} currentUserId={user?.userId || ''} />
              <MessageInput roomId={roomId} />
            </Card>
          </ResizablePanel>

          <ResizableHandle
            withHandle
            className="bg-violet-200 transition-colors dark:bg-gray-700"
          />

          <ResizablePanel
            defaultSize={25}
            minSize={15}
            maxSize={40}
            className="transition-transform duration-300 ease-in-out"
          >
            <ActiveUsersSidebar />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
}

export default function ChatRoom() {
  const params = useParams();
  const roomId = params.roomId as string;

  return (
    <WebSocketProvider roomId={roomId}>
      <RoomUsersProvider roomId={roomId}>
        <RoomMessagesProvider roomId={roomId}>
          <ChatRoomContent />
        </RoomMessagesProvider>
      </RoomUsersProvider>
    </WebSocketProvider>
  );
}
