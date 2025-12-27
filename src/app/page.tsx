'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = sessionStorage.getItem('auth') === 'true';
    
    if (isAuthenticated) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  // Loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="text-center animate-fade-in-up">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
          <div className="relative w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center shadow-xl">
            <span className="text-5xl animate-float">🏪</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce animation-delay-200" />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce animation-delay-300" />
        </div>
        <p className="text-white text-lg font-semibold">Memuat...</p>
      </div>
    </div>
  );
}
