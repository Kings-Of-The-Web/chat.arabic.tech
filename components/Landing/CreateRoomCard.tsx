import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { createRoom } from '@/lib/service/rooms/createRoom';
import { Card } from '@/components/ui/card';

export const CreateRoomCard = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateRoom = async () => {
        setIsLoading(true);
        try {
            const newRoomId = await createRoom();
            router.push(`/room/${newRoomId}`);
            toast.success('تم إنشاء غرفة جديدة بنجاح');
        } catch (error) {
            toast.error('حدث خطأ أثناء إنشاء الغرفة');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800">
            <div className="mb-6 text-center">
                <MessageCircle className="mx-auto mb-4 h-8 w-8 text-violet-500 dark:text-violet-400" />
                <h2 className="mb-2 font-hacen text-2xl font-bold text-gray-900 dark:text-white">
                    إنشاء غرفة جديدة
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    أنشئ غرفة جديدة وشارك معرفها مع فريقك
                </p>
            </div>
            <div className="space-y-4">
                <button
                    onClick={handleCreateRoom}
                    className="btn group inline-flex w-full items-center justify-center bg-gray-900 text-white hover:bg-gray-800"
                    disabled={isLoading}
                >
                    <span className="ml-2 tracking-normal text-blue-500 transition-transform duration-150 ease-in-out group-hover:-translate-x-0.5">
                        <ArrowLeft className="h-4 w-4" />
                    </span>
                    {isLoading ? 'جارٍ الإنشاء...' : 'إنشاء غرفة جديدة'}
                </button>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    سيتم إنشاء معرف فريد للغرفة تلقائياً
                </p>
            </div>
        </Card>
    );
};
