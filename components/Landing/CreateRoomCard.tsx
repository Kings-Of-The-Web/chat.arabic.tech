import { MessageCircle, ArrowLeft } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createRoom } from '@/lib/service/createRoom';

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
  );
}; 