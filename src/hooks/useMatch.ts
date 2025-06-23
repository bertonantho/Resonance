import { useState, useEffect } from 'react';
import { Match, AgentConversation } from '../types/companion';

export function useMatch() {
  const [currentMatch, setCurrentMatch] = useState<Match>({
    profile: {
      name: 'Jamie',
      personality: {
        core_values: ['creativity', 'growth', 'adventure'],
        communication_style: 'expressive',
        energy_type: 'extrovert',
        interests: ['art', 'travel', 'music', 'cooking']
      }
    },
    compatibilityAnalysis: {
      score: 87,
      strengths: ['shared passion for growth', 'complementary communication styles', 'mutual interest in music']
    },
    introductionSent: true,
    firstResponse: true,
    messageCount: 12
  });

  const [agentConversation, setAgentConversation] = useState<AgentConversation>({
    transcript: [
      {
        role: 'user',
        message: "I noticed you're into music too! What kind of genres do you enjoy?",
        intent: 'finding_connection',
        emotionalTone: 'enthusiastic'
      },
      {
        role: 'match',
        message: "Yes! Music is a huge part of my life. I love everything from indie folk to jazz. Do you play any instruments?",
        intent: 'reciprocating_interest',
        emotionalTone: 'engaged'
      },
      {
        role: 'user',
        message: "I've been learning guitar for a few years. It's become a way for me to process emotions and find peace. Do you find that music affects you emotionally?",
        intent: 'philosophical_inquiry',
        emotionalTone: 'thoughtful'
      }
    ]
  });

  return { currentMatch, setCurrentMatch, agentConversation, setAgentConversation };
} 