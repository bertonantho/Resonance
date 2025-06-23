import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BestFriendCompanion } from '../lib/companion/BestFriendCompanion';
import { UserProfile, Match, AgentConversation, ConversationContext } from '../types/companion';

interface BestFriendChatProps {
  userProfile: UserProfile;
  currentMatch?: Match;
  agentConversation?: AgentConversation;
}

export const BestFriendChat: React.FC<BestFriendChatProps> = ({
  userProfile,
  currentMatch,
  agentConversation
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const companion = useRef(
    new BestFriendCompanion(
      userProfile,
      'supportive'
    )
  );

  useEffect(() => {
    // Initial greeting
    const greeting = getPersonalizedGreeting();
    setMessages([{
      id: '1',
      role: 'assistant',
      content: greeting,
      timestamp: new Date()
    }]);
  }, []);

  const getPersonalizedGreeting = () => {
    const greetings = [
      `Hey ${userProfile.name || 'there'}! 💜 How's your heart today?`,
      `Hi friend! I've been thinking about your journey. How are you feeling?`,
      `Hey you! Ready to navigate the world of connections together?`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Build match context if available
    const matchContext = currentMatch && agentConversation ? {
      matchProfile: currentMatch.profile,
      agentConversation,
      compatibilityAnalysis: currentMatch.compatibilityAnalysis,
      conversationStage: determineStage(currentMatch),
      userConcerns: [],
      opportunities: []
    } : undefined;

    try {
      const response = await companion.current.processMessage(input, matchContext);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        extras: {
          insights: response.agentInsights,
          suggestions: response.suggestions,
          affirmations: response.affirmations,
          starters: response.conversationStarters
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-950/20 to-slate-950">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <span className="text-xl">💜</span>
            </div>
            <div>
              <h3 className="font-medium text-white">Your Best Friend</h3>
              <p className="text-xs text-gray-400">Always here for you</p>
            </div>
          </div>
          {currentMatch && (
            <button
              onClick={() => setShowInsights(!showInsights)}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              {showInsights ? 'Hide' : 'Show'} Match Insights
            </button>
          )}
        </div>
      </div>

      {/* Match Insights Panel */}
      <AnimatePresence>
        {showInsights && currentMatch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-purple-900/20 border-b border-purple-500/20 p-4"
          >
            <h4 className="text-sm font-medium text-purple-300 mb-2">
              About Your Match with {currentMatch.profile.name}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-purple-400">Chemistry:</span>
                <span className="text-white">{currentMatch.compatibilityAnalysis.score}%</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400">Strengths:</span>
                <span className="text-white">
                  {currentMatch.compatibilityAnalysis.strengths.join(', ')}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="flex gap-1">
              <motion.div
                className="w-2 h-2 bg-purple-400 rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 bg-purple-400 rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
              />
              <motion.div
                className="w-2 h-2 bg-purple-400 rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
            </div>
            <span className="text-sm">Your friend is thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white/5 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Share what's on your mind..."
            className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-sm ${isUser ? 'order-1' : 'order-2'}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-purple-600/20 text-white'
              : 'bg-white/10 text-white'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Extra components for assistant messages */}
        {!isUser && message.extras && (
          <div className="mt-2 space-y-2">
            {/* Affirmations */}
            {message.extras.affirmations && message.extras.affirmations.length > 0 && (
              <div className="bg-purple-600/10 rounded-lg p-3">
                <p className="text-xs text-purple-400 mb-1">💜 Remember:</p>
                <p className="text-sm text-purple-200">
                  {message.extras.affirmations[0]}
                </p>
              </div>
            )}

            {/* Suggestions */}
            {message.extras.suggestions && message.extras.suggestions.length > 0 && (
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-2">💡 Suggestions:</p>
                <div className="space-y-1">
                  {message.extras.suggestions.map((suggestion, i) => (
                    <p key={i} className="text-sm text-gray-300">
                      • {suggestion.content}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation Starters */}
            {message.extras.starters && message.extras.starters.length > 0 && (
              <div className="bg-pink-600/10 rounded-lg p-3">
                <p className="text-xs text-pink-400 mb-2">💬 Try saying:</p>
                <div className="space-y-2">
                  {message.extras.starters.map((starter, i) => (
                    <button
                      key={i}
                      className="text-left text-sm text-pink-200 hover:text-pink-100 italic"
                      onClick={() => navigator.clipboard.writeText(starter.text)}
                    >
                      "{starter.text}"
                      <span className="text-xs text-pink-400 ml-2">(click to copy)</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
};

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  extras?: {
    insights?: any[];
    suggestions?: any[];
    affirmations?: string[];
    starters?: any[];
  };
}

function determineStage(match: Match): ConversationContext['conversationStage'] {
  if (!match.introductionSent) return 'pre-intro';
  if (!match.firstResponse) return 'introduction';
  if (match.messageCount < 10) return 'early-conversation';
  if (match.messageCount < 30) return 'deepening';
  return 'planning-meeting';
}