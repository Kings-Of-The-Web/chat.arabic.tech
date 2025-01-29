import { useRoomUsers } from '@/contexts/RoomUsers';
import { Users } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ActiveUsersSidebar() {
    const { users, isLoading } = useRoomUsers();

    if (isLoading) {
        return (
            <Card className="h-full bg-white dark:bg-gray-800">
                <div className="p-4">
                    <div className="mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-violet-500 dark:text-violet-400" />
                        <h2 className="font-hacen font-bold text-gray-900 dark:text-white">
                            المستخدمون النشطون
                        </h2>
                    </div>
                    <div className="space-y-2">
                        <div className="h-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                        <div className="h-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                        <div className="h-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="h-full bg-white dark:bg-gray-800">
            <div className="p-4">
                <div className="mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-violet-500 dark:text-violet-400" />
                    <h2 className="font-hacen font-bold text-gray-900 dark:text-white">
                        المستخدمون النشطون
                    </h2>
                </div>
                <ScrollArea className="h-[calc(100vh-12rem)]">
                    <div className="space-y-2 pl-1">
                        {users.map((user) => (
                            <div
                                key={user.userId}
                                className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <span className="font-hacen text-gray-900 dark:text-white">
                                    {user.name}
                                </span>
                                <span
                                    className={`h-2.5 w-2.5 rounded-full ${
                                        user.isOnline
                                            ? 'animate-pulse bg-green-500'
                                            : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </Card>
    );
}
