'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

import { CreateRoomCard } from '@/components/Landing/CreateRoomCard';
import { Header } from '@/components/Landing/Header';
import { JoinRoomCard } from '@/components/Landing/JoinRoomCard';
import { Button } from '@/components/ui/button';

export default function WelcomeScreen() {
    const { user, logout } = useUser();
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Redirect to homepage if user is not logged in
    useEffect(() => {
        // Short delay to allow the UserContext to initialize
        const timer = setTimeout(() => {
            setIsCheckingAuth(false);
            if (!user) {
                router.push('/');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [user, router]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    // Show loading state while checking authentication
    if (isCheckingAuth) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-violet-50 to-violet-100 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto max-w-4xl px-4 py-16">
                    <Header />
                    <div className="mb-8 w-full rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                        <h2 className="mb-4 text-2xl font-bold text-violet-600 dark:text-violet-400">
                            جاري التحميل...
                        </h2>
                    </div>
                </div>
            </main>
        );
    }

    // If no user, don't render the welcome screen content
    if (!user) {
        return null;
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-violet-50 to-violet-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto max-w-4xl px-4 py-16">
                <Header />
                <div className="mb-8 w-full rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <div>
                            <h2 className="mb-2 text-2xl font-bold text-violet-600 dark:text-violet-400">
                                مرحباً {user.name}!
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                المعرف الخاص بك:{' '}
                                <span className="font-semibold">{user.userId}</span>
                            </p>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                            تسجيل الخروج
                        </Button>
                    </div>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                    <JoinRoomCard />
                    <CreateRoomCard />
                </div>
            </div>
        </main>
    );
}
