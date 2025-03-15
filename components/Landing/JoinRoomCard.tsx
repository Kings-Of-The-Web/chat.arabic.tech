import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users } from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export const JoinRoomCard = () => {
    const router = useRouter();
    const [roomId, setRoomId] = useState('');
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

    return (
        <Card className="bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800">
            <div className="mb-6 text-center">
                <Users className="mx-auto mb-4 h-8 w-8 text-violet-500 dark:text-violet-400" />
                <h2 className="mb-2 font-hacen text-2xl font-bold text-gray-900 dark:text-white">
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
                    className="btn group inline-flex w-full items-center justify-center bg-gray-900 text-white hover:bg-gray-800"
                    disabled={isLoading}
                >
                    <span className="ml-2 tracking-normal text-blue-500 transition-transform duration-150 ease-in-out group-hover:-translate-x-0.5">
                        <ArrowLeft className="h-4 w-4" />
                    </span>
                    {isLoading ? 'جارٍ الانضمام...' : 'انضم إلى الغرفة'}
                </button>
            </form>
        </Card>
    );
};
