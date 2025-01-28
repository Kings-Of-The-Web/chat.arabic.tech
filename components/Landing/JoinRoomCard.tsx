import { Users, ArrowLeft } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
  );
}; 