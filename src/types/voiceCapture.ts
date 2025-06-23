export interface CaptureQuestion {
    id: string;
    type: 'core' | 'follow-up' | 'deepening';
    category: 'values' | 'lifestyle' | 'relationships' | 'dreams' | 'personality';
    question: string;
    purpose: string; // What we're trying to learn
    minResponseTime: number; // seconds
    maxResponseTime: number;
    triggers?: ResponseTrigger[]; // What triggers follow-up questions
    audioPrompt?: string; // How the AI voice asks it
  }
  
  export interface ResponseTrigger {
    keywords: string[];
    emotions: string[];
    pausePatterns: string[];
    leadsTo: string; // next question id
  }
  
  export interface VoiceSession {
    id: string;
    userId: string;
    questions: QuestionFlow[];
    responses: VoiceResponse[];
    extractedProfile: Partial<UserProfile>;
    sessionMetrics: SessionMetrics;
  }
  
  export interface QuestionFlow {
    questionId: string;
    orderAsked: number;
    timeAsked: Date;
    adaptationReason?: string; // Why this question was chosen
  }

  export interface VoiceResponse {
    id: string;
    questionId: string;
    transcript: string;
    audioUrl: string;
    duration: number;
    audioFeatures: AudioFeatures;
  }

  export interface AudioFeatures {
    pauses: Pause[];
    duration: number;
    volume: number[];
    pitch: number[];
    speechRate: number;
    fillerWords: string[];
  }

  export interface Pause {
    startTime: number;
    duration: number;
  }

  export interface UserProfile {
    id: string;
    voiceCharacteristics: VoiceCharacteristics;
    transcript: string;
    personality: PersonalityTraits;
    metadata: ProfileMetadata;
  }

  export interface VoiceCharacteristics {
    tone: string;
    pace: string;
    energy: number;
    clarity: number;
  }

  export interface PersonalityTraits {
    values: string[];
    communicationStyle: string;
    interests: string[];
    traits: string[];
  }

  export interface ProfileMetadata {
    captureMethod: string;
    sessionDuration: number;
    questionCount: number;
    adaptationRate: number;
  }

  export interface SessionMetrics {
    startTime: Date;
    endTime?: Date;
    totalDuration?: number;
    questionsAsked: number;
    averageResponseTime: number;
    adaptationCount: number;
  }

  export interface ResponseAnalysis {
    responseLength: number;
    emotionalIntensity: number;
    detectedEmotions: string[];
    detectedThemes: string[];
    pausePattern: string;
    energyLevel: number;
    authenticity: number;
  }

  export interface AudioAnalysis {
    questionId: string;
    emotions: string[];
    emotionalIntensity: number;
    speechVariability: number;
    emotionalRange: number;
    personalPronouns: number;
    pauseAuthenticity: number;
    energyLevel: number;
  }