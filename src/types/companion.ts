export interface UserProfile {
  name: string;
  personality: {
    core_values: string[];
    communication_style: string;
    energy_type: string;
    interests: string[];
  };
}

export interface Match {
  profile: UserProfile;
  compatibilityAnalysis: CompatibilityAnalysis;
  introductionSent?: boolean;
  firstResponse?: boolean;
  messageCount?: number;
}

export interface AgentConversation {
  transcript: ConversationTurn[];
}

export interface ConversationTurn {
  role: string;
  message: string;
  intent: string;
  emotionalTone: string;
}

export interface InteractionHistory {
  emotionalState: string;
  stage: string;
}

export interface EmotionalState {
  primary: string;
  intensity: number;
}

export interface RelationshipGoals {
  description: string;
}

export interface CompanionContext {
    userProfile: UserProfile;
    currentMatches: Match[];
    agentConversations: AgentConversation[];
    interactionHistory: InteractionHistory[];
    emotionalState: EmotionalState;
    relationshipGoals: RelationshipGoals;
  }
  
export interface CompanionPersonality {
  name: string;
  style: 'supportive' | 'playful' | 'wise' | 'motivational';
  traits: string[];
  communicationPatterns: {
    greetingStyle: string;
    encouragementStyle: string;
    adviceGivingStyle: string;
    humorLevel: number; // 0-1
    directnessLevel: number; // 0-1
  };
}

export interface UserPattern {
  name: string;
  frequency: number;
  firstObserved?: Date;
  lastObserved?: Date;
}

export interface Strategy {
  name: string;
  description: string;
  duration: string;
  effectiveness: string;
}

export interface Preference {
  type: string;
  value: string;
}

export interface GrowthArea {
  name: string;
  description: string;
}

export interface CompanionMemory {
  shortTerm: {
    currentTopic: string;
    recentInsights: string[];
    emotionalContext: string;
    lastAdviceGiven: string;
  };
  longTerm: {
    userPatterns: UserPattern[];
    successfulStrategies: Strategy[];
    userPreferences: Preference[];
    growthAreas: GrowthArea[];
  };
}

export interface CompatibilityAnalysis {
  score: number;
  strengths: string[];
  challenges?: string[];
}

export interface Opportunity {
  type: string;
  description: string;
}

export interface ConversationContext {
  matchProfile: UserProfile;
  agentConversation: AgentConversation;
  compatibilityAnalysis: CompatibilityAnalysis;
  conversationStage: 'pre-intro' | 'introduction' | 'early-conversation' | 'deepening' | 'planning-meeting';
  userConcerns: string[];
  opportunities: Opportunity[];
}

export interface Message {
  role: string;
  content: string;
}

export interface MessageAnalysis {
  intent: string;
  emotionalTone: string;
  topic: string;
  urgency: number;
  subtext: string;
  length?: number;
}

export interface AgentInsight {
  type: 'shared_interest' | 'complementary_dynamic' | 'depth_potential';
  content: string;
  relevance: 'high' | 'medium' | 'low';
  suggestion: string;
}

export interface Suggestion {
  type: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ConversationStarter {
  text: string;
  type: string;
  depth: string;
}

export interface EmotionalSupport {
  validation: string;
  strategies: Strategy[];
  exercises?: string[];
  checkIn?: string;
}

export interface KeyMoment {
  type: string;
  insight: string;
  relevance: string;
  turnIndex: number;
}

export interface JourneyInsights {
  patterns: UserPattern[];
  growthAreas: GrowthArea[];
  successFactors: any[];
  recommendations: any[];
}

export interface CoachingAdvice {
  immediate: any[];
  warnings: any[];
  opportunities: any[];
}

export interface SupportContext {
  recentInteractions: any[];
}

export interface DeepCompatibilityAnalysis {
  overallScore: number;
  dimensions: any;
  growthPotential: number;
  challenges: any[];
  opportunities: any[];
  longTermViability: number;
}

export interface DimensionAnalysis {
  score: number;
  strengths: string[];
  areas_for_growth: any[];
  insights: string[];
}

export interface ConversationDynamics {
  balance: number;
  depth: DepthAnalysis;
  energy: any;
  topics: any[];
  emotionalArc: any;
  connectionMoments: any[];
}

export interface DepthAnalysis {
  score: number;
  moments: any[];
  progression: any;
}