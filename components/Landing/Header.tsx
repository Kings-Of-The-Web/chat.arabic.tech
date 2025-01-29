import { MessageCircle } from 'lucide-react';

export const Header = () => {
    return (
        <div className="mb-16 text-center">
            <div className="mb-6 flex items-center justify-center">
                <MessageCircle className="h-12 w-12 text-violet-600 dark:text-violet-400" />
            </div>
            <h1 className="mb-4 font-hacen text-4xl font-bold text-gray-900 dark:text-white">
                دردشة الفريق
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
                تواصل مع فريقك في الوقت الحقيقي بسهولة وأمان
            </p>
        </div>
    );
};
