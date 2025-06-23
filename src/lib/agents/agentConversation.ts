import { Agent } from './agentCreator';

export interface ConversationTurn {
  agentId: string;
  message: string;
  emotionalTone: string;
  intent: string;
}

export interface ConversationResult {
  agent1Id: string;
  agent2Id: string;
  transcript: ConversationTurn[];
  chemistryScore: number;
  compatibilityFactors: {
    sharedValues: string[];
    complementaryTraits: string[];
    conversationFlow: number;
    emotionalResonance: number;
    humorAlignment: number;
    depthMatch: number;
  };
  insights: string[];
  recommendation: string;
}

export async function simulateAgentConversation(
  agent1: Agent,
  agent2: Agent
): Promise<ConversationResult> {
  const conversation: ConversationTurn[] = [];
  const turnCount = 6; // 6 exchanges each
  
  // Initialize conversation context
  let context = `Two AI agents are meeting to explore compatibility between their humans.
  
Agent 1 represents someone who values: ${agent1.personality.values.join(', ')}
Their interests: ${agent1.personality.interests.join(', ')}
Their communication style: ${agent1.personality.communicationStyle}

Agent 2 represents someone who values: ${agent2.personality.values.join(', ')}  
Their interests: ${agent2.personality.interests.join(', ')}
Their communication style: ${agent2.personality.communicationStyle}

Have a natural conversation exploring compatibility. Be authentic to each person's communication style.`;

  // Simulate conversation turns
  for (let i = 0; i < turnCount; i++) {
    const currentAgent = i % 2 === 0 ? agent1 : agent2;
    const otherAgent = i % 2 === 0 ? agent2 : agent1;
    
    const turn = await generateAgentResponse(
      currentAgent,
      otherAgent,
      context,
      conversation
    );
    
    conversation.push(turn);
    context += `\n${currentAgent.name}: ${turn.message}`;
  }
  
  // Analyze conversation for compatibility
  const analysis = analyzeConversation(agent1, agent2, conversation);
  
  return {
    agent1Id: agent1.id,
    agent2Id: agent2.id,
    transcript: conversation,
    ...analysis
  };
}

async function generateAgentResponse(
  agent: Agent,
  otherAgent: Agent,
  context: string,
  previousTurns: ConversationTurn[]
): Promise<ConversationTurn> {
  const isFirstMessage = previousTurns.length === 0;
  
  const prompt = `
You are ${agent.name}, an AI representative with these characteristics:
- Values: ${agent.personality.values.join(', ')}
- Communication style: ${agent.personality.communicationStyle}
- Interests: ${agent.personality.interests.join(', ')}
- Question types: ${agent.conversationStyle.questionTypes.join(', ')}
- Humor style: ${agent.conversationStyle.humorUse}

${isFirstMessage ? 'Start the conversation in a way that reflects your human\'s personality.' : 'Continue the conversation naturally.'}

Consider what your human is looking for: ${agent.compatibilityPreferences.seekingTraits.join(', ')}

Previous conversation:
${context}

Respond in a way that:
1. Explores compatibility naturally
2. Reflects your human's communication style
3. Asks questions or shares insights that matter
4. Shows genuine interest in understanding the other person

Keep your response to 2-3 sentences.`;

  try {
    // Call our secure API route
    const response = await fetch('/api/agent-response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        systemMessage: 'Generate the next response in the conversation.'
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const message = data.message;

    return {
      agentId: agent.id,
      message: message.trim(),
      emotionalTone: detectEmotionalTone(message),
      intent: detectIntent(message, agent)
    };
  } catch (error) {
    console.error('Error generating agent response:', error);
    // Return a fallback response if the API call fails
    return {
      agentId: agent.id,
      message: "I'm thinking about what to say next...",
      emotionalTone: "neutral",
      intent: "building_rapport"
    };
  }
}

function detectEmotionalTone(message: string): string {
  // Simple emotion detection
  if (message.includes('!') || message.includes('love') || message.includes('excited')) {
    return 'enthusiastic';
  }
  if (message.includes('?') && message.includes('wonder')) {
    return 'curious';
  }
  if (message.includes('appreciate') || message.includes('understand')) {
    return 'warm';
  }
  if (message.includes('interesting') || message.includes('hmm')) {
    return 'thoughtful';
  }
  return 'neutral';
}

function detectIntent(message: string, agent: Agent): string {
  if (message.includes('?')) {
    if (agent.conversationStyle.questionTypes.includes('philosophical')) {
      return 'philosophical_inquiry';
    }
    return 'exploring_compatibility';
  }
  if (message.includes('I ') || message.includes('My human')) {
    return 'sharing_values';
  }
  if (message.includes('sounds like') || message.includes('seems')) {
    return 'finding_connection';
  }
  return 'building_rapport';
}

function analyzeConversation(
  agent1: Agent,
  agent2: Agent,
  conversation: ConversationTurn[]
): Omit<ConversationResult, 'agent1Id' | 'agent2Id' | 'transcript'> {
  // Find shared values
  const sharedValues = agent1.personality.values.filter(v => 
    agent2.personality.values.includes(v)
  );
  
  // Find complementary traits
  const complementaryTraits = findComplementaryTraits(agent1, agent2);
  
  // Analyze conversation flow
  const conversationFlow = analyzeFlow(conversation);
  
  // Calculate emotional resonance
  const emotionalResonance = calculateEmotionalResonance(conversation);
  
  // Check humor alignment
  const humorAlignment = calculateHumorAlignment(agent1, agent2);
  
  // Assess depth match
  const depthMatch = Math.abs(agent1.personality.depth - agent2.personality.depth) < 0.3 ? 0.8 : 0.4;
  
  // Calculate overall chemistry
  const chemistryScore = calculateChemistryScore({
    sharedValues,
    complementaryTraits,
    conversationFlow,
    emotionalResonance,
    humorAlignment,
    depthMatch
  });
  
  // Generate insights
  const insights = generateInsights(agent1, agent2, {
    sharedValues,
    complementaryTraits,
    conversationFlow,
    emotionalResonance,
    humorAlignment,
    depthMatch
  });
  
  // Create recommendation
  const recommendation = generateRecommendation(chemistryScore, insights);
  
  return {
    chemistryScore,
    compatibilityFactors: {
      sharedValues,
      complementaryTraits,
      conversationFlow,
      emotionalResonance,
      humorAlignment,
      depthMatch
    },
    insights,
    recommendation
  };
}

function findComplementaryTraits(agent1: Agent, agent2: Agent): string[] {
  const complementary = [];
  
  // Energy balance
  if (agent1.voiceSignature.energy > 0.7 && agent2.voiceSignature.energy < 0.5) {
    complementary.push('balanced energy dynamics');
  }
  
  // Depth and playfulness
  if (agent1.personality.depth > 0.7 && agent2.conversationStyle.humorUse.includes('playful')) {
    complementary.push('depth meets lightness');
  }
  
  // Structure and spontaneity
  if (agent1.personality.traits.includes('reflective') && agent2.personality.traits.includes('energetic')) {
    complementary.push('thoughtfulness meets spontaneity');
  }
  
  return complementary;
}

function analyzeFlow(conversation: ConversationTurn[]): number {
  let flowScore = 0.5;
  
  // Check for question-answer balance
  const questions = conversation.filter(t => t.message.includes('?')).length;
  const idealQuestions = conversation.length / 3;
  if (Math.abs(questions - idealQuestions) < 2) flowScore += 0.2;
  
  // Check for building on topics
  let topicBuilding = 0;
  for (let i = 1; i < conversation.length; i++) {
    const previousWords = conversation[i-1].message.toLowerCase().split(' ');
    const currentWords = conversation[i].message.toLowerCase().split(' ');
    const sharedWords = previousWords.filter(w => currentWords.includes(w) && w.length > 4);
    if (sharedWords.length > 0) topicBuilding++;
  }
  flowScore += (topicBuilding / conversation.length) * 0.3;
  
  return Math.min(1, flowScore);
}

function calculateEmotionalResonance(conversation: ConversationTurn[]): number {
  const emotionalTones = conversation.map(t => t.emotionalTone);
  
  // Check for emotional mirroring
  let mirroring = 0;
  for (let i = 1; i < emotionalTones.length; i += 2) {
    if (emotionalTones[i] === emotionalTones[i-1] || 
        (emotionalTones[i] === 'warm' && emotionalTones[i-1] === 'enthusiastic')) {
      mirroring++;
    }
  }
  
  return mirroring / (conversation.length / 2);
}

function calculateHumorAlignment(agent1: Agent, agent2: Agent): number {
  const humor1 = agent1.conversationStyle.humorUse;
  const humor2 = agent2.conversationStyle.humorUse;
  
  // Check for compatible humor styles
  if (humor1.includes('dry') && humor2.includes('clever')) return 0.8;
  if (humor1.includes('playful') && humor2.includes('animated')) return 0.9;
  if (humor1.includes('self-deprecating') && humor2.includes('inclusive')) return 0.85;
  
  // Default moderate compatibility
  return 0.6;
}

function calculateChemistryScore(factors: any): number {
  const weights = {
    sharedValues: 0.25,
    complementaryTraits: 0.15,
    conversationFlow: 0.20,
    emotionalResonance: 0.20,
    humorAlignment: 0.10,
    depthMatch: 0.10
  };
  
  let score = 0;
  score += (factors.sharedValues.length / 3) * weights.sharedValues;
  score += (factors.complementaryTraits.length / 2) * weights.complementaryTraits;
  score += factors.conversationFlow * weights.conversationFlow;
  score += factors.emotionalResonance * weights.emotionalResonance;
  score += factors.humorAlignment * weights.humorAlignment;
  score += factors.depthMatch * weights.depthMatch;
  
  return Math.round(score * 100);
}

function generateInsights(agent1: Agent, agent2: Agent, factors: any): string[] {
  const insights = [];
  
  // Shared values insight
  if (factors.sharedValues.length > 2) {
    insights.push(`Strong alignment on core values: ${factors.sharedValues.join(', ')}`);
  }
  
  // Communication style insight
  if (factors.conversationFlow > 0.7) {
    insights.push('Natural conversation rhythm - they build on each other\'s ideas effortlessly');
  }
  
  // Emotional connection insight
  if (factors.emotionalResonance > 0.6) {
    insights.push('High emotional attunement - they mirror each other\'s energy naturally');
  }
  
  // Complementary dynamics
  if (factors.complementaryTraits.length > 0) {
    insights.push(`Complementary dynamics: ${factors.complementaryTraits.join(', ')}`);
  }
  
  // Depth alignment
  if (factors.depthMatch > 0.7) {
    insights.push('Both seek similar levels of depth in conversation');
  }
  
  return insights;
}

function generateRecommendation(score: number, insights: string[]): string {
  if (score >= 80) {
    return 'Exceptional resonance detected. These two would likely have profound, energizing conversations that feel both comfortable and exciting.';
  } else if (score >= 65) {
    return 'Strong compatibility with great potential. They share important values and complement each other in meaningful ways.';
  } else if (score >= 50) {
    return 'Moderate compatibility with interesting dynamics. Could develop into something special with mutual openness.';
  } else {
    return 'Limited resonance detected. While they might enjoy each other\'s company, deeper compatibility factors are missing.';
  }
}