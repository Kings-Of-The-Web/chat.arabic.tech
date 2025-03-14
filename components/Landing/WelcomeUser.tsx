'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

import { createUser } from '@/lib/service/createUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function WelcomeUser() {
    ///////////////////////
    // State Variables
    /////////////////////
    const { user, setUser, updateUserName } = useUser();
    const [name, setName] = useState('');
    const [username, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    /////////////////////////
    // Contexts
    ///////////////////////
    const router = useRouter();

    // Check if user is already logged in and redirect if needed
    useEffect(() => {
        // Short delay to allow the UserContext to initialize
        const timer = setTimeout(() => {
            setIsCheckingAuth(false);
            if (user) {
                router.push('/welcome-screen');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [user, router]);

    const handleCreateUser = async () => {
        if (!username.trim() || !name.trim()) {
            toast.error('الرجاء إدخال المعرف والاسم');
            return;
        }

        setIsLoading(true);
        try {
            const newUser = await createUser({
                username: username.trim(),
                name: name.trim(),
                isOnline: true,
            });

            // Set user in context (which will also save to cookies)
            setUser(newUser);
            toast.success('تم إنشاء المستخدم بنجاح');
            setUserId('');
            setName('');

            // Redirect to welcome screen after successful login
            router.push('/welcome-screen');
        } catch (error) {
            toast.error('حدث خطأ أثناء إنشاء المستخدم');
            console.error('Error creating user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading state while checking authentication
    if (isCheckingAuth) {
        return (
            <div className="mb-8 w-full rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                <h2 className="mb-4 text-2xl font-bold text-violet-600 dark:text-violet-400">
                    جاري التحميل...
                </h2>
            </div>
        );
    }

    // Only show the login form on the homepage
    return (
        <div className="mb-8 w-full rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-violet-600 dark:text-violet-400">
                مرحباً بك!
            </h2>
            <div className="flex flex-col gap-4">
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="أدخل معرف المستخدم"
                        className="flex-grow text-right"
                        dir="rtl"
                        disabled={isLoading}
                    />
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="أدخل اسمك"
                        className="flex-grow text-right"
                        dir="rtl"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleCreateUser}
                        className="bg-violet-600 text-white hover:bg-violet-700 sm:flex-shrink-0"
                        disabled={isLoading}
                    >
                        {isLoading ? 'جاري الإنشاء...' : 'إنشاء'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
