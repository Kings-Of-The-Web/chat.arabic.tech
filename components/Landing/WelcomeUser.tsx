'use client';

import { useUser } from '@/contexts/UserContext';

export function WelcomeUser() {
    const { user } = useUser();

    if (!user) {
        return null;
    }

    return (
        <div className="w-full p-6 mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400 mb-2">Welcome!</h2>
            <p className="text-gray-600 dark:text-gray-300">
                Your ID: <span className="font-mono bg-violet-50 dark:bg-violet-900/50 px-2 py-1 rounded">{user.userId}</span>
            </p>
        </div>
    );
} 