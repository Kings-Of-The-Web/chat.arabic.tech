'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-violet-50 to-violet-100 dark:from-gray-900 dark:to-gray-800">
            <div className="text-center">
                <h2 className="mb-4 font-hacen text-2xl font-bold text-gray-900 dark:text-white">
                    حدث خطأ ما
                </h2>
                <div className="space-x-4 rtl:space-x-reverse">
                    <Button
                        onClick={() => reset()}
                        className="bg-violet-600 text-white hover:bg-violet-700"
                    >
                        حاول مرة أخرى
                    </Button>
                    <Button onClick={() => router.push('/')} variant="outline">
                        العودة للرئيسية
                    </Button>
                </div>
            </div>
        </div>
    );
}
