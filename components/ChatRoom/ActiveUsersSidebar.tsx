import { Users } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface ActiveUsersSidebarProps {
  users: App.User[];
}

export function ActiveUsersSidebar({ users }: ActiveUsersSidebarProps) {
  return (
    <Card className="hidden md:block w-64 p-4 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-violet-500 dark:text-violet-400" />
        <h2 className="font-hacen font-bold text-gray-900 dark:text-white">
          المستخدمون النشطون
        </h2>
      </div>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.userId}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span className="font-hacen text-gray-900 dark:text-white">
              {user.name}
            </span>
            <span
              className={`h-2 w-2 rounded-full ${
                user.isOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          </div>
        ))}
      </div>
    </Card>
  );
} 