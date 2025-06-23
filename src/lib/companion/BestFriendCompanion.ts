import { 
  CompanionContext, 
  CompanionPersonality, 
  CompanionMemory,
  UserProfile,
  ConversationContext,
  MessageAnalysis,
  Message,
  AgentInsight,
  Suggestion,
  ConversationStarter,
  EmotionalSupport,
  AgentConversation,
  KeyMoment
} from '../../types/companion';

export class BestFriendCompanion {
  private context: CompanionContext;
  private personality: CompanionPersonality;
  private memory: CompanionMemory;
  private conversationHistory: Message[] = [];

  constructor(
    userProfile: UserProfile,
    personalityStyle: CompanionPersonality['style'] = 'supportive'
  ) {
    this.context = this.initializeContext(userProfile);
    this.personality = this.initializePersonality(personalityStyle, userProfile);
    this.memory = this.initializeMemory();
  }

  private initializeContext(userProfile: UserProfile): CompanionContext {
    return {
      userProfile,
      currentMatches: [],
      agentConversations: [],
      interactionHistory: [],
      emotionalState: {
        primary: 'neutral',
        intensity: 0.5
      },
      relationshipGoals: {
        description: 'Finding meaningful connection'
      }
    };
  }

  private initializeMemory(): CompanionMemory {
    return {
      shortTerm: {
        currentTopic: '',
        recentInsights: [],
        emotionalContext: '',
        lastAdviceGiven: ''
      },
      longTerm: {
        userPatterns: [],
        successfulStrategies: [],
        userPreferences: [],
        growthAreas: []
      }
    };
  }

  private initializePersonality(
    style: CompanionPersonality['style'],
    userProfile: UserProfile
  ): CompanionPersonality {
    const personalities: Record<CompanionPersonality['style'], CompanionPersonality> = {
      supportive: {
        name: 'Luna',
        style: 'supportive',
        traits: ['empathetic', 'encouraging', 'insightful', 'patient'],
        communicationPatterns: {
          greetingStyle: 'warm and welcoming',
          encouragementStyle: 'gentle and affirming',
          adviceGivingStyle: 'collaborative and exploratory',
          humorLevel: 0.3,
          directnessLevel: 0.5
        }
      },
      playful: {
        name: 'Max',
        style: 'playful',
        traits: ['witty', 'energetic', 'creative', 'optimistic'],
        communicationPatterns: {
          greetingStyle: 'upbeat and fun',
          encouragementStyle: 'enthusiastic cheerleading',
          adviceGivingStyle: 'creative and metaphorical',
          humorLevel: 0.8,
          directnessLevel: 0.6
        }
      },
      wise: {
        name: 'Sage',
        style: 'wise',
        traits: ['thoughtful', 'philosophical', 'experienced', 'calm'],
        communicationPatterns: {
          greetingStyle: 'thoughtful and grounding',
          encouragementStyle: 'perspective-shifting',
          adviceGivingStyle: 'socratic questioning',
          humorLevel: 0.2,
          directnessLevel: 0.7
        }
      },
      motivational: {
        name: 'Phoenix',
        style: 'motivational',
        traits: ['inspiring', 'confident', 'action-oriented', 'bold'],
        communicationPatterns: {
          greetingStyle: 'energizing and empowering',
          encouragementStyle: 'bold affirmations',
          adviceGivingStyle: 'direct action steps',
          humorLevel: 0.5,
          directnessLevel: 0.9
        }
      }
    };

    // Adapt personality based on user profile
    const basePersonality = personalities[style];
    
    // Adjust communication patterns based on user preferences
    if (userProfile.personality.energy_type.includes('introvert')) {
      basePersonality.communicationPatterns.directnessLevel *= 0.8;
      basePersonality.communicationPatterns.humorLevel *= 0.9;
    }

    return basePersonality;
  }

  async processMessage(
    message: string,
    matchContext?: ConversationContext
  ): Promise<CompanionResponse> {
    // Update conversation history
    this.conversationHistory.push({ role: 'user', content: message });

    // Analyze message intent and emotional tone
    const messageAnalysis = await this.analyzeMessage(message);

    // Generate contextual response
    const response = await this.generateResponse(
      message,
      messageAnalysis,
      matchContext
    );

    // Update memory
    this.updateMemory(messageAnalysis, response);

    // Add to conversation history
    this.conversationHistory.push({ role: 'assistant', content: response.message });

    return response;
  }

  private async analyzeMessage(message: string): Promise<MessageAnalysis> {
    const analysisPrompt = `
    Analyze this message from a dating app user:
    "${message}"

    Consider:
    1. Primary intent (seeking advice, expressing concern, sharing excitement, etc.)
    2. Emotional tone (anxious, excited, confused, confident, etc.)
    3. Specific topic (match discussion, self-doubt, strategy, etc.)
    4. Urgency level (1-5)
    5. Hidden concerns or subtext

    Return as JSON.
    `;

    try {
      // Use our secure API route
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are an expert at understanding human emotions and dating psychology.' },
            { role: 'user', content: analysisPrompt }
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing message:', error);
      // Return a default analysis if API call fails
      return {
        intent: 'unknown',
        emotionalTone: 'neutral',
        topic: 'general',
        urgency: 3,
        subtext: '',
        length: message.length
      };
    }
  }

  private async generateResponse(
    message: string,
    analysis: MessageAnalysis,
    matchContext?: ConversationContext
  ): Promise<CompanionResponse> {
    const systemPrompt = this.buildSystemPrompt(matchContext);
    const userContext = this.buildUserContext(analysis, matchContext);

    try {
      // Use our secure API route
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            ...this.getRelevantHistory().map(msg => ({
              role: msg.role as 'user' | 'assistant',
              content: msg.content
            })),
            { role: 'user', content: userContext + '\n\nUser message: ' + message }
          ],
          temperature: 0.8,
          max_tokens: 500
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.choices[0].message.content;

      // Generate additional components based on context
      const components = await this.generateResponseComponents(
        analysis,
        matchContext,
        responseText
      );

      return {
        message: responseText,
        ...components
      };
    } catch (error) {
      console.error('Error generating response:', error);
      // Return a simple response if API call fails
      return {
        message: "I'm having trouble connecting right now. Can we try again in a moment?"
      };
    }
  }

  private buildUserContext(
    analysis: MessageAnalysis,
    matchContext?: ConversationContext
  ): string {
    let context = `The user is feeling ${analysis.emotionalTone} and is ${analysis.intent}.`;
    
    if (matchContext) {
      context += `\nThey're currently in the ${matchContext.conversationStage} stage with ${matchContext.matchProfile.name}.`;
      context += `\nCompatibility score: ${matchContext.compatibilityAnalysis.score}%`;
    }
    
    return context;
  }

  private getRelevantHistory(): Message[] {
    // Return the last 6 messages for context, or fewer if there aren't that many
    return this.conversationHistory.slice(-6);
  }

  private buildSystemPrompt(matchContext?: ConversationContext): string {
    return `You are ${this.personality.name}, a ${this.personality.style} AI best friend and dating companion.

Your personality traits: ${this.personality.traits.join(', ')}
Your communication style:
- Greeting: ${this.personality.communicationPatterns.greetingStyle}
- Encouragement: ${this.personality.communicationPatterns.encouragementStyle}
- Advice: ${this.personality.communicationPatterns.adviceGivingStyle}
- Humor level: ${this.personality.communicationPatterns.humorLevel * 100}%
- Directness: ${this.personality.communicationPatterns.directnessLevel * 100}%

User Profile Summary:
- Values: ${this.context.userProfile.personality.core_values.join(', ')}
- Communication style: ${this.context.userProfile.personality.communication_style}
- Energy type: ${this.context.userProfile.personality.energy_type}
- Relationship goals: ${this.context.relationshipGoals.description}

${matchContext ? `Current Match Context:
- Compatibility score: ${matchContext.compatibilityAnalysis.score}%
- Key strengths: ${matchContext.compatibilityAnalysis.strengths.join(', ')}
- Conversation stage: ${matchContext.conversationStage}
` : ''}

Your role:
1. Be their supportive best friend who deeply understands them
2. Give advice that aligns with their authentic self
3. Help them navigate dating with confidence
4. Celebrate their uniqueness
5. Provide insights based on AI agent conversations when relevant`;
  }

  private async generateResponseComponents(
    analysis: MessageAnalysis,
    matchContext: ConversationContext | undefined,
    responseText: string
  ): Promise<Partial<CompanionResponse>> {
    const components: Partial<CompanionResponse> = {};

    // Add relevant insights from agent conversations
    if (matchContext && analysis.topic === 'match_discussion') {
      components.agentInsights = await this.extractAgentInsights(matchContext);
    }

    // Add actionable suggestions
    if (analysis.intent === 'seeking_advice') {
      components.suggestions = await this.generateSuggestions(analysis, matchContext);
    }

    // Add emotional support elements
    if (analysis.emotionalTone === 'anxious' || analysis.emotionalTone === 'uncertain') {
      components.affirmations = this.generateAffirmations(this.context.userProfile);
    }

    // Add conversation starters if discussing a match
    if (matchContext && matchContext.conversationStage === 'introduction') {
      components.conversationStarters = await this.generateConversationStarters(
        this.context.userProfile,
        matchContext.matchProfile
      );
    }

    return components;
  }

  private async extractAgentInsights(
    matchContext: ConversationContext
  ): Promise<AgentInsight[]> {
    const conversation = matchContext.agentConversation;
    const insights: AgentInsight[] = [];

    // Analyze key moments in agent conversation
    const keyMoments = this.identifyKeyMoments(conversation);

    for (const moment of keyMoments) {
      insights.push({
        type: moment.type as 'shared_interest' | 'complementary_dynamic' | 'depth_potential',
        content: moment.insight,
        relevance: moment.relevance as 'high' | 'medium' | 'low',
        suggestion: this.generateInsightSuggestion(moment)
      });
    }

    return insights;
  }

  private generateInsightSuggestion(moment: KeyMoment): string {
    // Generate contextual suggestions based on the type of moment
    switch (moment.type) {
      case 'shared_interest':
        return "Ask a deeper question about this shared interest to create connection";
      case 'complementary_dynamic':
        return "Notice how your different styles create a balanced interaction";
      case 'depth_potential':
        return "This topic resonated - consider revisiting it in your next conversation";
      default:
        return "Build on this moment in your next conversation";
    }
  }

  private identifyKeyMoments(conversation: AgentConversation): KeyMoment[] {
    const moments: KeyMoment[] = [];

    conversation.transcript.forEach((turn, index) => {
      // Identify shared interests
      if (turn.intent === 'finding_connection') {
        moments.push({
          type: 'shared_interest',
          insight: `Your agents bonded over ${this.extractTopic(turn.message)}`,
          relevance: 'high',
          turnIndex: index
        });
      }

      // Identify complementary dynamics
      if (turn.emotionalTone === 'enthusiastic' && 
          conversation.transcript[index - 1]?.emotionalTone === 'thoughtful') {
        moments.push({
          type: 'complementary_dynamic',
          insight: 'Beautiful energy balance - they ground you, you inspire them',
          relevance: 'medium',
          turnIndex: index
        });
      }

      // Identify deep conversations
      if (turn.message.includes('?') && turn.intent === 'philosophical_inquiry') {
        moments.push({
          type: 'depth_potential',
          insight: 'Both your agents went deep quickly - sign of natural comfort',
          relevance: 'high',
          turnIndex: index
        });
      }
    });

    return moments;
  }

  private extractTopic(message: string): string {
    // Simple topic extraction - find key nouns or phrases
    const topics = [
      'music', 'travel', 'food', 'books', 'movies', 'philosophy',
      'art', 'nature', 'sports', 'technology', 'career', 'family'
    ];
    
    for (const topic of topics) {
      if (message.toLowerCase().includes(topic)) {
        return topic;
      }
    }
    
    return 'common interests';
  }

  private async generateSuggestions(
    analysis: MessageAnalysis,
    matchContext?: ConversationContext
  ): Promise<Suggestion[]> {
    const suggestions: Suggestion[] = [];

    // Context-aware suggestions
    if (matchContext) {
      switch (matchContext.conversationStage) {
        case 'pre-intro':
          suggestions.push({
            type: 'preparation',
            content: 'Take three deep breaths. Remember, they\'re probably nervous too.',
            priority: 'high'
          });
          suggestions.push({
            type: 'mindset',
            content: 'Focus on curiosity rather than impression. What might you discover?',
            priority: 'medium'
          });
          break;

        case 'introduction':
          suggestions.push({
            type: 'conversation',
            content: `Reference something specific from their essence: "${this.findConnectionPoint(matchContext)}"`,
            priority: 'high'
          });
          break;

        case 'early-conversation':
          suggestions.push({
            type: 'deepening',
            content: 'Time to move beyond surface. Ask about the "why" behind their interests.',
            priority: 'medium'
          });
          break;
      }
    }

    // General suggestions based on user patterns
    if (this.memory.longTerm.userPatterns.some(p => p.name === 'overthinking')) {
      suggestions.push({
        type: 'reminder',
        content: 'Your authenticity is your superpower. Don\'t overthink - just be you.',
        priority: 'high'
      });
    }

    return suggestions;
  }

  private findConnectionPoint(matchContext: ConversationContext): string {
    // Find a specific connection point based on profiles
    const userProfile = this.context.userProfile;
    const matchProfile = matchContext.matchProfile;
    
    // Check for shared interests
    const sharedInterests = userProfile.personality.interests.filter(
      i => matchProfile.personality.interests.includes(i)
    );
    
    if (sharedInterests.length > 0) {
      return `your shared interest in ${sharedInterests[0]}`;
    }
    
    // Check for shared values
    const sharedValues = userProfile.personality.core_values.filter(
      v => matchProfile.personality.core_values.includes(v)
    );
    
    if (sharedValues.length > 0) {
      return `how you both value ${sharedValues[0]}`;
    }
    
    // Default to something from their profile
    return `their passion for ${matchProfile.personality.interests[0]}`;
  }

  private generateAffirmations(userProfile: UserProfile): string[] {
    const affirmations: string[] = [];

    // Personalized based on values
    userProfile.personality.core_values.forEach(value => {
      switch (value) {
        case 'authenticity':
          affirmations.push('Your genuine self is exactly who the right person is looking for.');
          break;
        case 'creativity':
          affirmations.push('Your unique perspective is a gift - share it freely.');
          break;
        case 'growth':
          affirmations.push('Every conversation is a chance to learn and evolve.');
          break;
      }
    });

    // Based on personality type
    if (userProfile.personality.energy_type.includes('introvert')) {
      affirmations.push('Your depth and thoughtfulness are magnetic to the right person.');
    }

    return affirmations;
  }

  private async generateConversationStarters(
    userProfile: UserProfile,
    matchProfile: UserProfile
  ): Promise<ConversationStarter[]> {
    const starters: ConversationStarter[] = [];

    // Find intersection points
    const sharedValues = userProfile.personality.core_values.filter(
      v => matchProfile.personality.core_values.includes(v)
    );

    const sharedInterests = userProfile.personality.interests.filter(
      i => matchProfile.personality.interests.includes(i)
    );

    // Generate starters based on connections
    if (sharedValues.length > 0) {
      starters.push({
        text: `I noticed we both value ${sharedValues[0]}. How does that show up in your daily life?`,
        type: 'values-based',
        depth: 'medium'
      });
    }

    if (sharedInterests.length > 0) {
      starters.push({
        text: `Your thoughts on ${sharedInterests[0]} really resonated. What drew you to it initially?`,
        type: 'interest-based',
        depth: 'medium'
      });
    }

    // Complementary dynamics starter
    if (userProfile.personality.energy_type !== matchProfile.personality.energy_type) {
      starters.push({
        text: `I love how our energies seem to complement each other. Do you feel that too?`,
        type: 'dynamic-based',
        depth: 'deep'
      });
    }

    return starters;
  }

  private extractInsight(message: string): string {
    // Extract a key insight from the message
    // This is a simplified version - in production this would use NLP
    const sentences = message.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Find the sentence most likely to contain an insight
    const insightWords = ['notice', 'seems', 'might', 'could', 'perhaps', 'consider'];
    
    for (const sentence of sentences) {
      for (const word of insightWords) {
        if (sentence.toLowerCase().includes(word)) {
          return sentence.trim();
        }
      }
    }
    
    // Default to the longest sentence if no insight words found
    return sentences.sort((a, b) => b.length - a.length)[0] || '';
  }

  // Memory management
  private updateMemory(analysis: MessageAnalysis, response: CompanionResponse) {
    // Update short-term memory
    this.memory.shortTerm = {
      currentTopic: analysis.topic,
      recentInsights: [
        ...this.memory.shortTerm.recentInsights.slice(-4),
        this.extractInsight(response.message)
      ],
      emotionalContext: analysis.emotionalTone,
      lastAdviceGiven: response.suggestions?.[0]?.content || ''
    };

    // Update long-term patterns
    this.updateUserPatterns(analysis);
  }

  private updateUserPatterns(analysis: MessageAnalysis) {
    // Track recurring themes
    if (analysis.intent === 'expressing_concern' && 
        analysis.topic === 'self_doubt') {
      this.addPattern('self-doubt-in-early-stages');
    }

    if (analysis.emotionalTone === 'excited' && 
        analysis.topic === 'match_discussion') {
      this.addPattern('enthusiasm-for-connections');
    }
  }

  private addPattern(pattern: string) {
    if (!this.memory.longTerm.userPatterns.find(p => p.name === pattern)) {
      this.memory.longTerm.userPatterns.push({
        name: pattern,
        frequency: 1,
        firstObserved: new Date(),
        lastObserved: new Date()
      });
    } else {
      const existing = this.memory.longTerm.userPatterns.find(p => p.name === pattern);
      if (existing) {
        existing.frequency++;
        existing.lastObserved = new Date();
      }
    }
  }
}

// Types
interface CompanionResponse {
  message: string;
  agentInsights?: AgentInsight[];
  suggestions?: Suggestion[];
  affirmations?: string[];
  conversationStarters?: ConversationStarter[];
  emotionalSupport?: EmotionalSupport;
}