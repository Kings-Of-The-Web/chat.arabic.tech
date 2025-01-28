"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-violet-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-hacen font-bold text-gray-900 dark:text-white mb-4">
          حدث خطأ ما
        </h2>
        <div className="space-x-4 rtl:space-x-reverse">
          <Button
            onClick={() => reset()}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            حاول مرة أخرى
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
          >
            العودة للرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
}