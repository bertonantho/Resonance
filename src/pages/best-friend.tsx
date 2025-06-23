import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

interface Message {
  type: 'ai' | 'user';
  text: string;
  delay?: number;
}

interface Profile {
  id: number;
  emoji: string;
  name: string;
  match: string;
  isActive: boolean;
}

const BestFriendPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([
    { id: 0, emoji: '🎨', name: 'Luna', match: '87% match', isActive: true },
    { id: 1, emoji: '🎸', name: 'Marcus', match: '82% match', isActive: false },
    { id: 2, emoji: '📚', name: 'Zara', match: '79% match', isActive: false }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Profile-specific responses
  const profileResponses: { [key: number]: string[] } = {
    0: [ // Luna
      "Okay, so Luna is FASCINATING! She's got this calm creative energy that's literally magnetic.",
      "Picture this: She makes pottery while pondering philosophy. Last Sunday she spent 3 hours at her wheel creating 'abstract art' (her words for when bowls go wrong 😄)",
      "But here's what your agents discovered - you both pause in conversations the EXACT same way. It's like your thinking rhythms are synchronized!"
    ],
    1: [ // Marcus
      "Marcus is pure energy! 🚀 This guy climbs rocks at 7am after jazz nights that end at 3am. How?!",
      "He's working on a graphic novel about time travelers who can only travel forward one second per second (I know, right? Genius or madness?)",
      "Your agents had the most animated conversation - they were practically finishing each other's sentences about creative projects!"
    ],
    2: [ // Zara
      "Zara is a force of nature! She's saving the world one community garden at a time while writing afrofuturist stories 🌍",
      "She hosts these dinner parties where everyone ends up sharing deep stories over Ethiopian food. Very 'chosen family' vibes.",
      "What's wild is your agents bonded over how you both see humor as a way to tackle serious topics. That's rare!"
    ]
  };

  // Initial messages
  const initialMessages: Message[] = [
    {
      type: 'ai',
      text: "OMG! You got some amazing matches! 🎉 Luna with 87% is incredible - that's like finding a unicorn!",
      delay: 1000
    },
    {
      type: 'ai',
      text: "I've been analyzing their conversations with other agents, and wow... there's some real magic here. Want me to spill the tea? ☕",
      delay: 3000
    }
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load initial messages
  useEffect(() => {
    let timeoutIds: NodeJS.Timeout[] = [];
    
    initialMessages.forEach(msg => {
      const typingTimeout = setTimeout(() => {
        setIsTyping(true);
        
        const messageTimeout = setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, msg]);
        }, msg.delay || 1000);
        
        timeoutIds.push(messageTimeout);
      }, 500);
      
      timeoutIds.push(typingTimeout);
    });
    
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []);

  // Handle profile selection
  const selectProfile = (index: number) => {
    // Update active profile
    setProfiles(prev => 
      prev.map((profile, i) => ({
        ...profile,
        isActive: i === index
      }))
    );
    
    // Show typing indicator
    setIsTyping(true);
    
    // Clear typing after a delay
    setTimeout(() => {
      setIsTyping(false);
      
      // Add profile-specific messages
      const responses = profileResponses[index];
      if (responses) {
        let delay = 0;
        
        responses.forEach((text, i) => {
          delay += i === 0 ? 500 : 2000;
          
          setTimeout(() => {
            setMessages(prev => [...prev, { type: 'ai', text }]);
            
            // Show typing for next message if there is one
            if (i < responses.length - 1) {
              setTimeout(() => setIsTyping(true), 1000);
              setTimeout(() => setIsTyping(false), 2000);
            }
          }, delay);
        });
      }
    }, 1500);
  };

  // Handle sending a message
  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: inputText }]);
    setInputText('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Add AI response after delay
    setTimeout(() => {
      setIsTyping(false);
      
      const responses = [
        "That's such a great question! Let me think about this...",
        "Ooh, I have thoughts on this! So here's what I noticed...",
        "Yes! I was hoping you'd ask about that!"
      ];
      
      setMessages(prev => [...prev, { 
        type: 'ai', 
        text: responses[Math.floor(Math.random() * responses.length)] 
      }]);
    }, 2000);
  };

  // Handle quick actions
  const quickAction = (action: 'compare' | 'vibe' | 'advice') => {
    const actions = {
      compare: "Want me to compare all three? I love doing compatibility breakdowns!",
      vibe: "Let me paint you a picture of each person's energy...",
      advice: "Ooh, strategic dating advice? I'm SO here for this!"
    };
    
    // Add user message
    const actionText = action === 'compare' 
      ? "Compare them" 
      : action === 'vibe' 
        ? "Tell me their vibe" 
        : "Who should I meet first?";
    
    setMessages(prev => [...prev, { type: 'user', text: actionText }]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Add AI response after delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { type: 'ai', text: actions[action] }]);
      
      // Add insight card after another delay
      setTimeout(() => {
        const insightText = action === 'compare' 
          ? "Luna brings depth and creativity, Marcus brings adventure and energy, Zara brings purpose and warmth. You literally can't go wrong!"
          : action === 'vibe'
            ? "Luna = cozy bookstore energy, Marcus = late night rooftop party, Zara = Sunday farmers market with friends"
            : "Start with whoever made you smile when reading about them. That gut feeling? That's your agents' chemistry talking!";
        
        setMessages(prev => [...prev, { 
          type: 'ai', 
          text: `<div class="insight-card">
            <div class="insight-title">💡 MY TAKE</div>
            <div class="insight-text">${insightText}</div>
          </div>` 
        }]);
      }, 1500);
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Resonance - Your AI Best Friend</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-[#1a0f1f] text-white">
        <div className="w-[400px] h-[700px] bg-white/[0.03] rounded-[40px] border border-white/10 backdrop-blur-xl relative overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-5 text-center border-b border-white/10 bg-black/30">
            <div className="text-sm text-gray-400 mb-1 opacity-0 animate-[fadeIn_0.5s_ease-out_0.3s_forwards]">
              YOUR AI BEST FRIEND
            </div>
            <div className="text-2xl font-light bg-gradient-to-r from-[#667eea] to-[#ec4899] bg-clip-text text-transparent opacity-0 animate-[fadeIn_0.5s_ease-out_0.5s_forwards]">
              Let's Talk About Your Matches
            </div>
          </div>
          
          {/* Profile Cards */}
          <div className="p-5 opacity-0 animate-[slideUp_0.6s_ease-out_0.8s_forwards]">
            <div className="text-xs text-gray-600 uppercase tracking-wider mb-4">
              YOUR TOP RESONANCES
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-2.5 scrollbar-hide">
              {profiles.map((profile, index) => (
                <div 
                  key={profile.id}
                  onClick={() => selectProfile(index)}
                  className={`min-w-[120px] bg-white/5 rounded-[20px] p-4 border border-white/10 cursor-pointer transition-all hover:bg-white/[0.08] hover:-translate-y-0.5 hover:border-[#667eea]/50 opacity-0 ${
                    profile.isActive ? 'bg-[#667eea]/10 border-[#667eea]/50' : ''
                  }`}
                  style={{ 
                    animationName: 'fadeInScale',
                    animationDuration: '0.5s',
                    animationTimingFunction: 'ease-out',
                    animationFillMode: 'forwards',
                    animationDelay: `${1 + (index * 0.2)}s`
                  }}
                >
                  <div className="text-4xl mb-2.5 text-center">{profile.emoji}</div>
                  <div className="text-sm font-medium mb-1">{profile.name}</div>
                  <div className="text-xs text-[#667eea]">{profile.match}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="flex-1 flex flex-col p-5 overflow-hidden">
            <div className="flex-1 overflow-y-auto py-2.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={`message ${message.type} mb-4 opacity-0`}
                  style={{ 
                    animationName: 'messageSlide',
                    animationDuration: '0.4s',
                    animationTimingFunction: 'ease-out',
                    animationFillMode: 'forwards'
                  }}
                >
                  {message.type === 'ai' ? (
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#667eea] to-[#ec4899] rounded-full flex items-center justify-center text-base flex-shrink-0">
                        🤖
                      </div>
                      <div 
                        className="max-w-[80%] p-3 bg-white/5 border border-white/10 rounded-[20px] rounded-tl-[4px] leading-relaxed text-sm"
                        dangerouslySetInnerHTML={{ __html: message.text }}
                      />
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] p-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-[20px] rounded-tr-[4px] leading-relaxed text-sm">
                        {message.text}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing indicator */}
              <div className={`flex items-center gap-2.5 py-1 ${isTyping ? 'opacity-100 animate-[fadeIn_0.3s_ease-out]' : 'opacity-0'}`}>
                <div className="w-8 h-8 bg-gradient-to-r from-[#667eea] to-[#ec4899] rounded-full flex items-center justify-center text-base flex-shrink-0">
                  🤖
                </div>
                <div className="flex gap-1 p-2 px-3 bg-white/5 rounded-[20px]">
                  <div className="w-1.5 h-1.5 bg-[#667eea] rounded-full opacity-30 animate-[typingDot_1.4s_infinite]"></div>
                  <div className="w-1.5 h-1.5 bg-[#667eea] rounded-full opacity-30 animate-[typingDot_1.4s_0.2s_infinite]"></div>
                  <div className="w-1.5 h-1.5 bg-[#667eea] rounded-full opacity-30 animate-[typingDot_1.4s_0.4s_infinite]"></div>
                </div>
              </div>
              
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-4 bg-black/30 border-t border-white/10 opacity-0 animate-[slideUp_0.5s_ease-out_1.8s_forwards]">
            <div className="flex gap-2.5 items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything about your matches..."
                className="flex-1 bg-white/5 border border-white/10 rounded-[25px] py-3 px-5 text-white text-sm outline-none transition focus:bg-white/[0.08] focus:border-[#667eea]/50 placeholder:text-white/40"
              />
              <button 
                onClick={sendMessage}
                className="w-10 h-10 bg-gradient-to-r from-[#667eea] to-[#ec4899] rounded-full flex items-center justify-center text-white transition hover:scale-110 active:scale-95"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2 mt-2.5 flex-wrap">
              <button 
                onClick={() => quickAction('compare')}
                className="py-1.5 px-3 bg-white/5 border border-white/10 rounded-[15px] text-xs cursor-pointer transition hover:bg-[#667eea]/20 hover:border-[#667eea]/50 opacity-0"
                style={{ 
                  animationName: 'fadeInScale',
                  animationDuration: '0.4s',
                  animationTimingFunction: 'ease-out',
                  animationFillMode: 'forwards',
                  animationDelay: '2s'
                }}
              >
                Compare them
              </button>
              <button 
                onClick={() => quickAction('vibe')}
                className="py-1.5 px-3 bg-white/5 border border-white/10 rounded-[15px] text-xs cursor-pointer transition hover:bg-[#667eea]/20 hover:border-[#667eea]/50 opacity-0"
                style={{ 
                  animationName: 'fadeInScale',
                  animationDuration: '0.4s',
                  animationTimingFunction: 'ease-out',
                  animationFillMode: 'forwards',
                  animationDelay: '2.1s'
                }}
              >
                Tell me their vibe
              </button>
              <button 
                onClick={() => quickAction('advice')}
                className="py-1.5 px-3 bg-white/5 border border-white/10 rounded-[15px] text-xs cursor-pointer transition hover:bg-[#667eea]/20 hover:border-[#667eea]/50 opacity-0"
                style={{ 
                  animationName: 'fadeInScale',
                  animationDuration: '0.4s',
                  animationTimingFunction: 'ease-out',
                  animationFillMode: 'forwards',
                  animationDelay: '2.2s'
                }}
              >
                Who should I meet first?
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes typingDot {
          0%, 60%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          30% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        
        .insight-card {
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: 15px;
          padding: 12px;
          margin: 10px 0;
        }
        
        .insight-title {
          font-size: 12px;
          color: #667eea;
          margin-bottom: 5px;
          font-weight: 500;
        }
        
        .insight-text {
          font-size: 13px;
          line-height: 1.4;
        }
      `}</style>
    </>
  );
};

export default BestFriendPage; 