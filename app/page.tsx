"use client";

import { useState } from 'react';
import { MessageCircle, Users, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim()) {
      toast.error('الرجاء إدخال معرف الغرفة');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/room/${roomId}`);
      toast.success('تم الانضمام إلى الغرفة بنجاح');
    }, 1000);
  };

  const handleCreateRoom = async () => {
    setIsLoading(true);
    // Generate a random room ID (you can replace this with your own logic)
    const newRoomId = Math.random().toString(36).substring(2, 8);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/room/${newRoomId}`);
      toast.success('تم إنشاء غرفة جديدة بنجاح');
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-violet-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <MessageCircle className="h-12 w-12 text-violet-600 dark:text-violet-400" />
          </div>
          <h1 className="text-4xl font-hacen font-bold text-gray-900 dark:text-white mb-4">
            دردشة الفريق
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            تواصل مع فريقك في الوقت الحقيقي بسهولة وأمان
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Join Room Section */}
          <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-center mb-6">
              <Users className="h-8 w-8 text-violet-500 dark:text-violet-400 mx-auto mb-4" />
              <h2 className="text-2xl font-hacen font-bold text-gray-900 dark:text-white mb-2">
                انضم إلى غرفة موجودة
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                أدخل معرف الغرفة للانضمام إلى محادثة
              </p>
            </div>
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="أدخل معرف الغرفة"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="text-right"
                  dir="rtl"
                />
              </div>
              <button
                type="submit"
                className="btn inline-flex w-full items-center justify-center text-white bg-gray-900 hover:bg-gray-800 group"
                disabled={isLoading}
              >
                <span className="ml-2 tracking-normal text-blue-500 group-hover:-translate-x-0.5 transition-transform duration-150 ease-in-out">
                  <ArrowLeft className="h-4 w-4" />
                </span>
                {isLoading ? 'جارٍ الانضمام...' : 'انضم إلى الغرفة'}
              </button>
            </form>
          </Card>

          {/* Create Room Section */}
          <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-center mb-6">
              <MessageCircle className="h-8 w-8 text-violet-500 dark:text-violet-400 mx-auto mb-4" />
              <h2 className="text-2xl font-hacen font-bold text-gray-900 dark:text-white mb-2">
                إنشاء غرفة جديدة
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                أنشئ غرفة جديدة وشارك معرفها مع فريقك
              </p>
            </div>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="اسم الغرفة (اختياري)"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="text-right"
                dir="rtl"
              />
              <button
                onClick={handleCreateRoom}
                className="btn inline-flex w-full items-center justify-center text-white bg-gray-900 hover:bg-gray-800 group"
                disabled={isLoading}
              >
                <span className="ml-2 tracking-normal text-blue-500 group-hover:-translate-x-0.5 transition-transform duration-150 ease-in-out">
                  <ArrowLeft className="h-4 w-4" />
                </span>
                {isLoading ? 'جارٍ الإنشاء...' : 'إنشاء غرفة جديدة'}
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                سيتم إنشاء معرف فريد للغرفة تلقائياً
              </p>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}