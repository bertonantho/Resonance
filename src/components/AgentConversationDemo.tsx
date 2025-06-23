import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createAllAgents } from '../lib/agents/agentCreator';
import { simulateAgentConversation, ConversationResult } from '../lib/agents/agentConversation';
import { sampleProfiles } from '../data/sampleProfiles';

export const AgentConversationDemo = () => {
  const [agents] = useState(createAllAgents());
  const [selectedAgents, setSelectedAgents] = useState<[number, number]>([0, 1]);
  const [isConversing, setIsConversing] = useState(false);
  const [conversation, setConversation] = useState<ConversationResult | null>(null);

  const runConversation = async () => {
    setIsConversing(true);
    setConversation(null);
    
    const agent1 = agents[selectedAgents[0]];
    const agent2 = agents[selectedAgents[1]];
    
    try {
      const result = await simulateAgentConversation(agent1, agent2);
      setConversation(result);
    } catch (error) {
      console.error('Conversation failed:', error);
    } finally {
      setIsConversing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-light text-center mb-8">Agent Conversation Demo</h1>
      
      {/* Agent Selection */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <AgentSelector
          agents={agents}
          selectedIndex={selectedAgents[0]}
          onSelect={(index) => setSelectedAgents([index, selectedAgents[1]])}
          title="Select First Agent"
        />
        <AgentSelector
          agents={agents}
          selectedIndex={selectedAgents[1]}
          onSelect={(index) => setSelectedAgents([selectedAgents[0], index])}
          title="Select Second Agent"
        />
      </div>

      {/* Run Conversation Button */}
      <div className="text-center mb-12">
        <button
          onClick={runConversation}
          disabled={isConversing || selectedAgents[0] === selectedAgents[1]}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {isConversing ? (
            <span className="flex items-center gap-3">
              <Spinner className="animate-spin" />
              Agents are conversing...
            </span>
          ) : (
            'Start Agent Conversation'
          )}
        </button>
      </div>

      {/* Conversation Display */}
      <AnimatePresence>
        {conversation && (
          <ConversationDisplay conversation={conversation} agents={agents} />
        )}
      </AnimatePresence>
    </div>
  );
};

// Agent Selector Component
const AgentSelector = ({ agents, selectedIndex, onSelect, title }) => {
  const selectedAgent = agents[selectedIndex];
  const profile = sampleProfiles[selectedIndex];

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-medium mb-4">{title}</h3>
      
      <div className="space-y-3 mb-4">
        {agents.map((agent, index) => (
          <button
            key={agent.id}
            onClick={() => onSelect(index)}
            className={`w-full text-left p-3 rounded-lg transition-all ${
              selectedIndex === index
                ? 'bg-purple-600/20 border border-purple-500'
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="font-medium">{sampleProfiles[index].name}</div>
            <div className="text-sm text-gray-400">
              {sampleProfiles[index].location} • {sampleProfiles[index].age}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Profile Details */}
      <div className="border-t border-white/10 pt-4">
        <h4 className="font-medium mb-2">Profile Summary</h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-400">Values:</span>
            <span className="ml-2">{profile.personality.core_values.slice(0, 3).join(', ')}</span>
          </div>
          <div>
            <span className="text-gray-400">Interests:</span>
            <span className="ml-2">{profile.personality.interests.slice(0, 3).join(', ')}</span>
          </div>
          <div>
            <span className="text-gray-400">Energy:</span>
            <span className="ml-2">{profile.personality.energy_type}</span>
          </div>
          <div>
            <span className="text-gray-400">Voice:</span>
            <span className="ml-2">{profile.voiceCharacteristics.energy}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Conversation Display Component
const ConversationDisplay = ({ conversation, agents }) => {
  const [showTranscript, setShowTranscript] = useState(true);
  const agent1 = agents.find(a => a.id === conversation.agent1Id);
  const agent2 = agents.find(a => a.id === conversation.agent2Id);
  const profile1 = sampleProfiles.find(p => `agent_profile_${p.id}` === conversation.agent1Id);
  const profile2 = sampleProfiles.find(p => `agent_profile_${p.id}` === conversation.agent2Id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Chemistry Score */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-block"
        >
          <div className="relative">
            <svg className="w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-white/10"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - conversation.chemistryScore / 100)}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - conversation.chemistryScore / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="transform -rotate-90 origin-center"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <div className="text-5xl font-light">{conversation.chemistryScore}%</div>
                <div className="text-sm text-gray-400">Chemistry Score</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Compatibility Factors */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CompatibilityFactor
          label="Shared Values"
          value={conversation.compatibilityFactors.sharedValues.length}
          max={5}
          items={conversation.compatibilityFactors.sharedValues}
        />
        <CompatibilityFactor
          label="Conversation Flow"
          value={conversation.compatibilityFactors.conversationFlow}
          max={1}
          percentage
        />
        <CompatibilityFactor
          label="Emotional Resonance"
          value={conversation.compatibilityFactors.emotionalResonance}
          max={1}
          percentage
        />
        <CompatibilityFactor
          label="Humor Alignment"
          value={conversation.compatibilityFactors.humorAlignment}
          max={1}
          percentage
        />
        <CompatibilityFactor
          label="Depth Match"
          value={conversation.compatibilityFactors.depthMatch}
          max={1}
          percentage
        />
        <CompatibilityFactor
          label="Complementary Traits"
          value={conversation.compatibilityFactors.complementaryTraits.length}
          max={3}
          items={conversation.compatibilityFactors.complementaryTraits}
        />
      </div>

      {/* Insights */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-medium mb-4">AI Insights</h3>
        <div className="space-y-3">
          {conversation.insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">{insight}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-purple-600/10 border border-purple-500/20 rounded-lg">
          <p className="text-purple-300 font-medium mb-1">Recommendation</p>
          <p className="text-gray-300">{conversation.recommendation}</p>
        </div>
      </div>

      {/* Conversation Transcript */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">Agent Conversation</h3>
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            {showTranscript ? 'Hide' : 'Show'} Transcript
          </button>
        </div>
        
        <AnimatePresence>
          {showTranscript && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              {conversation.transcript.map((turn, index) => {
                const isAgent1 = turn.agentId === conversation.agent1Id;
                const profile = isAgent1 ? profile1 : profile2;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${isAgent1 ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-md ${isAgent1 ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-center gap-2 mb-1 ${isAgent1 ? '' : 'justify-end'}`}>
                        <span className="text-sm text-gray-400">{profile?.name}'s AI</span>
                        <span className="text-xs text-gray-500">
                          {turn.emotionalTone} • {turn.intent.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          isAgent1
                            ? 'bg-purple-600/20 text-purple-100'
                            : 'bg-pink-600/20 text-pink-100'
                        }`}
                      >
                        {turn.message}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Compatibility Factor Component
const CompatibilityFactor = ({ label, value, max, percentage = false, items = [] }) => {
  const displayValue = percentage ? Math.round(value * 100) : value;
  const progressValue = percentage ? value : value / max;

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="font-medium">
          {displayValue}{percentage ? '%' : `/${max}`}
        </span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressValue * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {items.length > 0 && (
        <div className="mt-2 text-xs text-gray-400">
          {items.join(', ')}
        </div>
      )}
    </div>
  );
};

// Spinner Component
const Spinner = ({ className = "" }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);