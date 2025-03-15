'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRoomMessages } from '@/contexts/RoomMessages';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

import { joinRoom } from '@/lib/service/joinRoom';
import { ActiveUsersSidebar } from '@/components/ChatRoom/ActiveUsersSidebar';
import { ChatRoomHeader } from '@/components/ChatRoom/ChatRoomHeader';
import { MessageInput } from '@/components/ChatRoom/MessageInput';
import { MessageList } from '@/components/ChatRoom/MessageList';
import { Card } from '@/components/ui/card';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export function ChatRoomContent() {
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
    const roomId = params.roomId as string;

    /////////////////////////
    // Effects
    /////////////////////////
    // Join room when component mounts
    useEffect(() => {
        const handleJoinRoom = async () => {
            if (!user?.username) return;

            try {
                await joinRoom(roomId, user.username);
            } catch (error) {
                toast.error('فشل في الانضمام إلى الغرفة');
                router.push('/');
            }
        };
        handleJoinRoom();
    }, [roomId, user?.username, router]);

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
                        <Card className="flex h-full flex-col overflow-hidden bg-white p-4 dark:bg-gray-800">
                            <MessageList currentUserId={user?.username || ''} />
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
