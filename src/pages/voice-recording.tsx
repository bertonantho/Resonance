import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const VoiceRecordingPage = () => {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [promptIndex, setPromptIndex] = useState(0);

  const prompts = [
    "Tell me about your perfect weekend...",
    "What brings you unexpected joy?",
    "Describe a moment you felt understood..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (isRecording) {
      const promptInterval = setInterval(() => {
        setPromptIndex(prev => (prev + 1) % prompts.length);
      }, 5000);
      
      return () => clearInterval(promptInterval);
    }
  }, [isRecording, prompts.length]);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      // In a real app, you would save the recording
      router.push('/ai-mingling');
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Head>
        <title>Resonance - Voice Recording</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-[#1a0f1f] text-white">
        <div className="w-[400px] h-[700px] bg-white/[0.03] rounded-[40px] border border-white/10 backdrop-blur-xl p-10 relative overflow-hidden">
          {isRecording && (
            <div className="absolute top-5 right-5 flex items-center gap-2 opacity-0 animate-[fadeIn_0.5s_ease-out_2s_forwards]">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-[blink_2s_infinite]"></div>
              <span className="text-xs text-gray-400">Recording</span>
            </div>
          )}
          
          <div className="text-center mb-16 opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
            <h1 className="text-5xl font-thin tracking-[-2px] bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              Resonance
            </h1>
            <p className="text-gray-400 text-base">Let's capture your essence</p>
          </div>
          
          <div className="relative h-[200px] my-10 flex items-center justify-center opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards]">
            {[1, 2, 3].map((_, index) => (
              <div 
                key={index}
                className="absolute rounded-full bg-[#667eea]/10"
                style={{
                  width: `${150 + (index * 50)}px`,
                  height: `${150 + (index * 50)}px`,
                  animationDelay: `${index * 0.5}s`,
                  animation: 'pulse 3s infinite'
                }}
              ></div>
            ))}
            
            <button 
              onClick={toggleRecording}
              className="relative z-10 w-20 h-20 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center cursor-pointer transition-transform animate-[breathe_2s_infinite]"
            >
              <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-[3px] my-10 h-[60px] opacity-0 animate-[fadeIn_0.5s_ease-out_1.5s_forwards]">
            {Array.from({ length: 12 }).map((_, index) => (
              <div 
                key={index}
                className="w-[3px] bg-gradient-to-t from-[#667eea] to-[#764ba2] rounded-[3px]"
                style={{
                  height: `${20 + Math.floor(Math.random() * 30)}px`,
                  animationDelay: `${index * 0.1}s`,
                  animation: isRecording ? 'wave 1s ease-in-out infinite' : 'none'
                }}
              ></div>
            ))}
          </div>
          
          <div className="text-center p-5 bg-white/5 rounded-[20px] mb-5 opacity-0 animate-[fadeInUp_0.8s_ease-out_2s_forwards]">
            <p className="text-lg leading-relaxed text-gray-200">
              {prompts[promptIndex]}
            </p>
          </div>
          
          <div className="text-center text-5xl font-thin text-[#667eea] opacity-0 animate-[fadeIn_0.5s_ease-out_2.5s_forwards]">
            {formatTime(seconds)}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
        
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes wave {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.8);
          }
        }
        
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </>
  );
};

export default VoiceRecordingPage; 