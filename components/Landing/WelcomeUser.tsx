'use client';

import { useUser } from '@/contexts/UserContext';

export function WelcomeUser() {
    const { user } = useUser();

    if (!user) {
        return null;
    }

    return (
        <div className="mb-8 w-full rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-2 text-2xl font-bold text-violet-600 dark:text-violet-400">
                Welcome!
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
                Your ID:{' '}
                <span className="rounded bg-violet-50 px-2 py-1 font-mono dark:bg-violet-900/50">
                    {user.userId}
                </span>
            </p>
        </div>
    );
}
