import { CaptureQuestion } from '@/types/voiceCapture';

export const CORE_QUESTIONS: CaptureQuestion[] = [
    {
      id: 'weekend-explorer',
      type: 'core',
      category: 'lifestyle',
      question: "Walk me through your perfect weekend - from Friday evening to Sunday night. What makes it perfect for you?",
      purpose: "Understand lifestyle preferences, energy patterns, and values through concrete examples",
      minResponseTime: 30,
      maxResponseTime: 90,
      triggers: [
        {
          keywords: ['friends', 'people', 'group'],
          emotions: ['enthusiastic'],
          pausePatterns: [],
          leadsTo: 'social-energy'
        },
        {
          keywords: ['alone', 'myself', 'quiet', 'peace'],
          emotions: ['calm'],
          pausePatterns: [],
          leadsTo: 'solitude-appreciation'
        },
        {
          keywords: ['create', 'make', 'build', 'art', 'write'],
          emotions: ['passionate'],
          pausePatterns: [],
          leadsTo: 'creative-process'
        }
      ],
      audioPrompt: "Let's start with something fun - tell me about your perfect weekend. Take your time, paint me the picture from Friday evening all the way through Sunday night."
    },
    
    {
      id: 'joy-sources',
      type: 'core',
      category: 'values',
      question: "What's something small that brings you unexpected joy? Something others might not notice but makes you genuinely happy?",
      purpose: "Identify unique personality markers and what truly resonates emotionally",
      minResponseTime: 20,
      maxResponseTime: 60,
      triggers: [
        {
          keywords: ['nature', 'outside', 'weather', 'seasons'],
          emotions: ['peaceful', 'content'],
          pausePatterns: [],
          leadsTo: 'nature-connection'
        },
        {
          keywords: ['help', 'others', 'someone', 'people'],
          emotions: ['warm', 'fulfilled'],
          pausePatterns: [],
          leadsTo: 'service-orientation'
        }
      ]
    },
    
    {
      id: 'connection-moment',
      type: 'core',
      category: 'relationships',
      question: "Tell me about a time you felt truly understood by someone. What did they do or say that made you feel seen?",
      purpose: "Understand communication needs and emotional connection patterns",
      minResponseTime: 30,
      maxResponseTime: 120,
      triggers: [
        {
          keywords: ['listened', 'heard', 'understood'],
          emotions: ['grateful', 'moved'],
          pausePatterns: ['long'],
          leadsTo: 'communication-values'
        }
      ]
    },
    
    {
      id: 'growth-edge',
      type: 'core',
      category: 'personality',
      question: "What's something you're working on improving about yourself right now? What drew you to want to grow in that area?",
      purpose: "Understand self-awareness, growth mindset, and current life phase",
      minResponseTime: 25,
      maxResponseTime: 90,
      triggers: [
        {
          keywords: ['patience', 'understanding', 'listening'],
          emotions: ['thoughtful'],
          pausePatterns: [],
          leadsTo: 'relationship-growth'
        }
      ]
    },
    
    {
      id: 'curiosity-rabbit-hole',
      type: 'core',
      category: 'personality',
      question: "What's the last thing you went down a rabbit hole learning about? What pulled you in?",
      purpose: "Identify interests, learning style, and intellectual curiosity patterns",
      minResponseTime: 20,
      maxResponseTime: 90,
      triggers: [
        {
          keywords: ['fascinating', 'amazing', 'incredible'],
          emotions: ['excited', 'animated'],
          pausePatterns: [],
          leadsTo: 'passion-exploration'
        }
      ]
    }
  ];
  
  // Adaptive follow-up questions
  export const ADAPTIVE_QUESTIONS: CaptureQuestion[] = [
    {
      id: 'social-energy',
      type: 'follow-up',
      category: 'personality',
      question: "You mentioned spending time with people - what kind of social settings energize you versus drain you?",
      purpose: "Clarify social preferences and energy management",
      minResponseTime: 20,
      maxResponseTime: 60
    },
    
    {
      id: 'creative-process',
      type: 'follow-up',
      category: 'personality',
      question: "I love that you create things! Walk me through what happens in your mind when you're in that creative flow.",
      purpose: "Understand creative process and flow states",
      minResponseTime: 25,
      maxResponseTime: 90
    },
    
    {
      id: 'values-conflict',
      type: 'deepening',
      category: 'values',
      question: "Have you ever had to choose between two things you really value? How did you navigate that?",
      purpose: "Understand value hierarchy and decision-making process",
      minResponseTime: 30,
      maxResponseTime: 120
    }
  ];