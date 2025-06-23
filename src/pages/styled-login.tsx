import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const StyledLoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate and authenticate here
    router.push('/onboarding');
  };

  return (
    <>
      <Head>
        <title>Resonance - Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-[#1a0f1f] text-white">
        <div className="w-[400px] h-[700px] bg-white/[0.03] rounded-[40px] border border-white/10 backdrop-blur-xl p-10 relative overflow-hidden">
          <div className="text-center mb-16 opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
            <h1 className="text-5xl font-bold tracking-[-2px] bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              Resonance
            </h1>
            <p className="text-gray-400 text-lg mt-4">Find your true connection</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-white/[0.05] border border-white/10 rounded-3xl py-4 px-6 text-white outline-none transition focus:bg-white/[0.08] focus:border-[#667eea]/50"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white/[0.05] border border-white/10 rounded-3xl py-4 px-6 text-white outline-none transition focus:bg-white/[0.08] focus:border-[#667eea]/50"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-3xl py-4 px-6 text-white font-medium transition hover:opacity-90"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center opacity-0 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]">
            <button
              onClick={() => router.push('/onboarding')}
              className="text-[#667eea] hover:underline"
            >
              Create an account
            </button>
          </div>

          <div className="absolute bottom-10 left-0 right-0 text-center text-gray-500 text-sm opacity-0 animate-[fadeInUp_0.8s_ease-out_0.7s_forwards]">
            Connect with your true resonance
          </div>
        </div>
      </div>
    </>
  );
};

export default StyledLoginPage;