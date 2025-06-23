import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/styled-login');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-[#1a0f1f] text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-[#667eea] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading Resonance...</p>
      </div>
    </div>
  );
};

export default HomePage;