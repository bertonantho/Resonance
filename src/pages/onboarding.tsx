import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const OnboardingPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save this data
    router.push('/voice-recording');
  };

  return (
    <>
      <Head>
        <title>Resonance - Tell Us About You</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-[#1a0f1f] text-white">
        <div className="w-[400px] h-[700px] bg-white/[0.03] rounded-[40px] border border-white/10 backdrop-blur-xl p-10 relative overflow-hidden">
          <div className="text-center mb-12 opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
            <h1 className="text-5xl font-thin tracking-[-2px] bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              About You
            </h1>
            <p className="text-gray-400 text-base">Let's get to know you</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]">
              <label className="block text-gray-400 mb-2 text-sm">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full bg-white/[0.05] border border-white/10 rounded-3xl py-4 px-6 text-white outline-none transition focus:bg-white/[0.08] focus:border-[#667eea]/50"
                required
              />
            </div>
            
            <div className="opacity-0 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]">
              <label className="block text-gray-400 mb-2 text-sm">Your Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter your age"
                min="18"
                max="120"
                className="w-full bg-white/[0.05] border border-white/10 rounded-3xl py-4 px-6 text-white outline-none transition focus:bg-white/[0.08] focus:border-[#667eea]/50"
                required
              />
            </div>
            
            <div className="opacity-0 animate-[fadeInUp_0.8s_ease-out_0.7s_forwards]">
              <label className="block text-gray-400 mb-2 text-sm">Your Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
                className="w-full bg-white/[0.05] border border-white/10 rounded-3xl py-4 px-6 text-white outline-none transition focus:bg-white/[0.08] focus:border-[#667eea]/50"
                required
              />
            </div>
            
            <div className="pt-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.9s_forwards]">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-3xl py-4 px-6 text-white font-medium transition hover:opacity-90"
              >
                Continue
              </button>
            </div>
          </form>

          <div className="absolute bottom-10 left-0 right-0 flex justify-center opacity-0 animate-[fadeInUp_0.8s_ease-out_1.1s_forwards]">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-[#667eea]"></div>
              <div className="w-2 h-2 rounded-full bg-white/20"></div>
              <div className="w-2 h-2 rounded-full bg-white/20"></div>
              <div className="w-2 h-2 rounded-full bg-white/20"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingPage; 