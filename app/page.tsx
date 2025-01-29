'use client';

import { CreateRoomCard } from '@/components/Landing/CreateRoomCard';
import { Header } from '@/components/Landing/Header';
import { JoinRoomCard } from '@/components/Landing/JoinRoomCard';
import { WelcomeUser } from '@/components/Landing/WelcomeUser';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-violet-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <Header />
        <WelcomeUser />
        <div className="grid gap-8 md:grid-cols-2">
          <JoinRoomCard />
          <CreateRoomCard />
        </div>
      </div>
    </main>
  );
}
