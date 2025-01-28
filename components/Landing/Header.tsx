import { MessageCircle } from 'lucide-react';

export const Header = () => {
  return (
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
  );
}; 