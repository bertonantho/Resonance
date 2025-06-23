import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Agent {
  id: number;
  element: HTMLDivElement | null;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'user' | 'other' | 'connecting' | 'matched';
}

const AIMinglingPage = () => {
  const router = useRouter();
  const chamberRef = useRef<HTMLDivElement>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState({
    agentsMet: 0,
    conversations: 0,
    resonanceFound: 0
  });
  const [showMatchNotification, setShowMatchNotification] = useState(false);
  const animationRef = useRef<number>();

  // Initialize agents
  useEffect(() => {
    if (!chamberRef.current) return;

    const newAgents: Agent[] = [];
    
    // Create user agent
    newAgents.push({
      id: 0,
      element: null,
      x: 50,
      y: 50,
      vx: 0,
      vy: 0,
      type: 'user'
    });
    
    // Create other agents
    for (let i = 1; i <= 20; i++) {
      newAgents.push({
        id: i,
        element: null,
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        type: 'other'
      });
    }
    
    setAgents(newAgents);
  }, []);

  // Animate agents
  useEffect(() => {
    if (!chamberRef.current || agents.length === 0) return;
    
    const chamber = chamberRef.current;
    
    const animate = () => {
      setAgents(prevAgents => {
        return prevAgents.map(agent => {
          if (agent.type === 'user') return agent;
          
          // Update position
          let newX = agent.x + agent.vx;
          let newY = agent.y + agent.vy;
          let newVx = agent.vx;
          let newVy = agent.vy;
          
          // Bounce off walls
          if (newX <= 5 || newX >= 95) newVx *= -1;
          if (newY <= 5 || newY >= 95) newVy *= -1;
          
          // Occasionally create connections with user
          let newType = agent.type;
          if (agent.type === 'other' && Math.random() > 0.995) {
            createConnection(prevAgents[0], agent);
            newType = 'connecting';
            
            // Set back to 'other' after a while
            setTimeout(() => {
              setAgents(prevAgents => 
                prevAgents.map(a => 
                  a.id === agent.id ? { ...a, type: 'other' } : a
                )
              );
            }, 2000);
          }
          
          return {
            ...agent,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            type: newType
          };
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    // Set up interval to update stats
    const statsInterval = setInterval(() => {
      setStats(prev => {
        const newAgentsMet = prev.agentsMet + Math.floor(Math.random() * 5) + 1;
        const newConversations = prev.conversations + Math.floor(Math.random() * 15) + 5;
        let newResonance = prev.resonanceFound;
        
        if (newConversations > 100 && newResonance === 0) {
          newResonance = 1;
          
          // Mark one agent as matched
          const randomAgentId = Math.floor(Math.random() * 20) + 1;
          setAgents(prevAgents => 
            prevAgents.map(a => 
              a.id === randomAgentId ? { ...a, type: 'matched' } : a
            )
          );
          
          // Show match notification after a delay
          setTimeout(() => {
            setShowMatchNotification(true);
            
            // Redirect to best friend page after notification
            setTimeout(() => {
              router.push('/best-friend');
            }, 3000);
          }, 3000);
        }
        
        return {
          agentsMet: newAgentsMet,
          conversations: newConversations,
          resonanceFound: newResonance
        };
      });
    }, 1000);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearInterval(statsInterval);
    };
  }, [agents.length, router]);

  // Create connection between agents
  const createConnection = (agent1: Agent, agent2: Agent) => {
    if (!chamberRef.current) return;
    
    const chamber = chamberRef.current;
    const chamberRect = chamber.getBoundingClientRect();
    
    // Create line element
    const line = document.createElement('div');
    line.className = 'connection-line';
    
    // Calculate positions
    const agent1Element = chamber.querySelector(`[data-agent-id="${agent1.id}"]`);
    const agent2Element = chamber.querySelector(`[data-agent-id="${agent2.id}"]`);
    
    if (!agent1Element || !agent2Element) return;
    
    const rect1 = agent1Element.getBoundingClientRect();
    const rect2 = agent2Element.getBoundingClientRect();
    
    const x1 = rect1.left - chamberRect.left + rect1.width / 2;
    const y1 = rect1.top - chamberRect.top + rect1.height / 2;
    const x2 = rect2.left - chamberRect.left + rect2.width / 2;
    const y2 = rect2.top - chamberRect.top + rect2.height / 2;
    
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    line.style.width = `${distance}px`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    line.style.transform = `rotate(${angle}deg)`;
    
    chamber.appendChild(line);
    
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${x1 - 50}px`;
    ripple.style.top = `${y1 - 50}px`;
    chamber.appendChild(ripple);
    
    // Remove elements after animation
    setTimeout(() => {
      line.remove();
      ripple.remove();
    }, 2000);
  };

  return (
    <>
      <Head>
        <title>Resonance - AI Mingling</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="w-[400px] h-[700px] bg-white/[0.02] rounded-[40px] border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="text-center p-8 relative z-10">
            <h1 className="text-4xl font-thin tracking-[-1px] mb-1">Resonance</h1>
            <p className="text-gray-400 text-sm">Your agent is mingling...</p>
          </div>
          
          <div 
            ref={chamberRef} 
            className="absolute top-[100px] left-5 right-5 h-[400px] rounded-[20px] overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at center, rgba(102, 126, 234, 0.1) 0%, transparent 70%)' }}
          >
            {agents.map((agent) => (
              <div
                key={agent.id}
                data-agent-id={agent.id}
                className={`absolute rounded-full ${
                  agent.type === 'user' 
                    ? 'w-4 h-4 bg-[#667eea] shadow-[0_0_20px_#667eea,0_0_40px_#667eea] z-10' 
                    : agent.type === 'connecting'
                    ? 'w-2.5 h-2.5 bg-[#f39c12] animate-[pulse_1s_infinite]'
                    : agent.type === 'matched'
                    ? 'w-2.5 h-2.5 bg-[#00ff88] shadow-[0_0_20px_#00ff88]'
                    : 'w-2.5 h-2.5 bg-[#444] shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                }`}
                style={{
                  left: `${agent.x}%`,
                  top: `${agent.y}%`,
                  transform: agent.type === 'user' ? 'translate(-50%, -50%)' : 'none',
                  opacity: 0.8,
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
          
          <div className="absolute bottom-[100px] left-5 right-5 bg-white/5 rounded-[20px] p-5">
            <div className="flex justify-between mb-4 opacity-0 animate-[fadeInUp_0.5s_ease-out_0.5s_forwards]">
              <span className="text-gray-400 text-sm">Agents Met</span>
              <span className="font-semibold text-[#667eea] text-base">{stats.agentsMet}</span>
            </div>
            <div className="flex justify-between mb-4 opacity-0 animate-[fadeInUp_0.5s_ease-out_0.7s_forwards]">
              <span className="text-gray-400 text-sm">Conversations</span>
              <span className="font-semibold text-[#667eea] text-base">{stats.conversations}</span>
            </div>
            <div className="flex justify-between opacity-0 animate-[fadeInUp_0.5s_ease-out_0.9s_forwards]">
              <span className="text-gray-400 text-sm">Resonance Found</span>
              <span className="font-semibold text-[#667eea] text-base">{stats.resonanceFound}</span>
            </div>
          </div>
          
          {showMatchNotification && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#667eea] to-[#764ba2] p-5 rounded-[20px] text-center z-20 scale-0 animate-[matchPop_0.5s_ease-out_forwards]">
              <div className="text-lg font-medium mb-1">Deep Resonance Found!</div>
              <div className="text-4xl font-thin">87%</div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }
        
        @keyframes matchPop {
          to {
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes fadeConnection {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        
        @keyframes rippleEffect {
          from {
            width: 0;
            height: 0;
            opacity: 1;
          }
          to {
            width: 100px;
            height: 100px;
            opacity: 0;
          }
        }
        
        .connection-line {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, transparent, #667eea, transparent);
          transform-origin: left center;
          animation: fadeConnection 2s ease-in-out;
          pointer-events: none;
        }
        
        .ripple {
          position: absolute;
          border: 2px solid #667eea;
          border-radius: 50%;
          opacity: 0;
          animation: rippleEffect 2s ease-out;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default AIMinglingPage; 