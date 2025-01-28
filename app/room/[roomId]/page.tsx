"use client";

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Users, Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

// This needs to be in a separate file since it can't be in a client component
export const generateStaticParams = () => {
  // Pre-render some common room IDs
  return [
    { roomId: 'lobby' },
    { roomId: 'general' },
    { roomId: 'help' }
  ];
};

type Message = {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isRead: boolean;
};

type User = {
  id: string;
  name: string;
  isOnline: boolean;
};

export default function ChatRoom() {
  const params = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [copied, setCopied] = useState(false);
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
            id: '1',
            content: 'مرحباً بكم في الغرفة',
            sender: 'النظام',
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
      { id: '1', name: 'أحمد', isOnline: true },
      { id: '2', name: 'محمد', isOnline: true },
      { id: '3', name: 'سارة', isOnline: false }
    ]);
  }, [roomId, router]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'أنت',
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('تم نسخ معرف الغرفة');
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
        {/* Header */}
        <Card className="p-4 mb-4 flex items-center justify-between bg-white dark:bg-gray-800">
          <button
            onClick={() => router.push('/')}
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

        <div className="flex-1 flex gap-4">
          {/* Main Chat Area */}
          <Card className="flex-1 p-4 bg-white dark:bg-gray-800 flex flex-col">
            <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'أنت' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === 'أنت'
                          ? 'bg-violet-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="font-bold text-sm mb-1">{message.sender}</div>
                      <div className="mb-1">{message.content}</div>
                      <div className="text-xs opacity-75">
                        {format(message.timestamp, 'p', { locale: ar })}
                        {message.isRead && ' • تم القراءة'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
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
          </Card>

          {/* Active Users Sidebar */}
          <Card className="hidden md:block w-64 p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-violet-500 dark:text-violet-400" />
              <h2 className="font-hacen font-bold text-gray-900 dark:text-white">
                المستخدمون النشطون
              </h2>
            </div>
            <div className="space-y-2">
              {activeUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span className="font-hacen text-gray-900 dark:text-white">
                    {user.name}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      user.isOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}