"use client";

import { Header } from '@/components/Landing/Header';
import { JoinRoomCard } from '@/components/Landing/JoinRoomCard';
import { CreateRoomCard } from '@/components/Landing/CreateRoomCard';
import { WelcomeUser } from '@/components/Landing/WelcomeUser';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-violet-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Header />
        <WelcomeUser />
        <div className="grid md:grid-cols-2 gap-8">
          <JoinRoomCard />
          <CreateRoomCard />
        </div>
      </div>
    </main>
  );
}