import { sampleProfiles, extractVoiceFeatures } from '../../data/sampleProfiles';

export interface Agent {
  id: string;
  profileId: string;
  name: string;
  personality: {
    traits: string[];
    values: string[];
    communicationStyle: string;
    interests: string[];
    emotionalIntelligence: number;
    openness: number;
    depth: number;
  };
  voiceSignature: {
    energy: number;
    pace: string;
    emotionalRange: number;
    conversationalDynamics: any;
  };
  compatibilityPreferences: {
    seekingTraits: string[];
    dealBreakers: string[];
    idealDynamics: string[];
  };
  conversationStyle: {
    greetingStyle: string;
    questionTypes: string[];
    sharingDepth: string;
    humorUse: string;
  };
}

export function createAgentFromProfile(profile: typeof sampleProfiles[0]): Agent {
  const voiceFeatures = extractVoiceFeatures(profile);
  
  // Derive agent characteristics from profile
  const agent: Agent = {
    id: `agent_${profile.id}`,
    profileId: profile.id,
    name: `${profile.name}'s AI`,
    personality: {
      traits: deriveTraits(profile.personality),
      values: profile.personality.core_values,
      communicationStyle: profile.personality.communication_style,
      interests: profile.personality.interests,
      emotionalIntelligence: profile.voiceCharacteristics.patterns.emotionalRange,
      openness: calculateOpenness(profile),
      depth: calculateDepth(profile)
    },
    voiceSignature: {
      energy: voiceFeatures.energyLevel,
      pace: voiceFeatures.speakingRate,
      emotionalRange: voiceFeatures.conversationDynamics.emotionalRange,
      conversationalDynamics: voiceFeatures.conversationDynamics
    },
    compatibilityPreferences: deriveCompatibilityPreferences(profile),
    conversationStyle: {
      greetingStyle: deriveGreetingStyle(profile),
      questionTypes: deriveQuestionTypes(profile),
      sharingDepth: profile.personality.social_preferences.includes('meaningful') ? 'deep' : 'moderate',
      humorUse: profile.personality.humor_style
    }
  };
  
  return agent;
}

function deriveTraits(personality: any): string[] {
  const traits = [];
  
  // Analyze communication style
  if (personality.communication_style.includes('thoughtful')) traits.push('reflective');
  if (personality.communication_style.includes('enthusiastic')) traits.push('energetic');
  if (personality.communication_style.includes('questions')) traits.push('curious');
  
  // Analyze social preferences
  if (personality.social_preferences.includes('small groups')) traits.push('intimate');
  if (personality.social_preferences.includes('meaningful')) traits.push('depth-seeking');
  
  // Analyze energy type
  if (personality.energy_type.includes('introvert')) traits.push('introspective');
  if (personality.energy_type.includes('extrovert')) traits.push('social');
  if (personality.energy_type.includes('ambivert')) traits.push('adaptable');
  
  return traits;
}

function calculateOpenness(profile: any): number {
  let score = 0.5;
  
  // Factors that increase openness
  if (profile.personality.interests.length > 5) score += 0.1;
  if (profile.personality.humor_style.includes('self-deprecating')) score += 0.1;
  if (profile.transcript.includes('actually')) score += 0.05;
  if (
    profile.personality.core_values &&
    Array.isArray(profile.personality.core_values) &&
    profile.personality.core_values.includes('authenticity')
  ) score += 0.1;
  
  return Math.min(1, score);
}

function calculateDepth(profile: any): number {
  let score = 0.5;
  
  // Factors that indicate depth
  if (profile.personality.interests.includes('philosophy')) score += 0.2;
  if (profile.transcript.includes('consciousness') || profile.transcript.includes('humanity')) score += 0.15;
  if (profile.personality.communication_style.includes('deep questions')) score += 0.1;
  if (profile.voiceCharacteristics.patterns.pauseFrequency === 'high') score += 0.1;
  
  return Math.min(1, score);
}

function deriveCompatibilityPreferences(profile: any): any {
  const preferences = {
    seekingTraits: [],
    dealBreakers: [],
    idealDynamics: []
  };
  
  // Luna seeks depth and creativity
  if (profile.name === "Luna Chen") {
    preferences.seekingTraits = ['intellectual curiosity', 'creativity', 'emotional intelligence'];
    preferences.dealBreakers = ['superficiality', 'closed-mindedness'];
    preferences.idealDynamics = ['philosophical discussions', 'comfortable silence', 'creative collaboration'];
  }
  
  // Marcus seeks adventure and authenticity
  if (profile.name === "Marcus Rivera") {
    preferences.seekingTraits = ['passion', 'humor', 'openness to adventure'];
    preferences.dealBreakers = ['negativity', 'lack of curiosity'];
    preferences.idealDynamics = ['shared adventures', 'creative projects', 'deep late-night talks'];
  }
  
  // Zara seeks purpose and connection
  if (profile.name === "Zara Okafor") {
    preferences.seekingTraits = ['social awareness', 'warmth', 'growth mindset'];
    preferences.dealBreakers = ['apathy', 'selfishness'];
    preferences.idealDynamics = ['meaningful action', 'community building', 'intellectual sparring'];
  }
  
  return preferences;
}

function deriveGreetingStyle(profile: any): string {
  if (profile.personality.energy_type.includes('introvert')) {
    return 'warm but reserved';
  } else if (profile.personality.energy_type.includes('extrovert')) {
    return 'enthusiastic and open';
  } else {
    return 'friendly and adaptive';
  }
}

function deriveQuestionTypes(profile: any): string[] {
  const questions = [];
  
  if (profile.personality.interests.includes('philosophy')) {
    questions.push('philosophical', 'hypothetical');
  }
  if (typeof profile.personality.communication_style === 'string' && profile.personality.communication_style.includes('storyteller')) {
    questions.push('experiential', 'narrative');
  }
  if (Array.isArray(profile.personality.values) && profile.personality.values.includes('creativity')) {
    questions.push('imaginative', 'exploratory');
  }
  if (Array.isArray(profile.personality.values) && profile.personality.values.includes('community')) {
    questions.push('relational', 'value-based');
  }
  
  return questions;
}

// Create all agents
export function createAllAgents() {
  return sampleProfiles.map(profile => createAgentFromProfile(profile));
}