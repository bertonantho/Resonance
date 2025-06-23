import {
    InteractionHistory,
    UserPattern,
    Message,
    UserProfile,
    EmotionalState,
    Strategy,
    SupportContext,
    EmotionalSupport,
    CoachingAdvice,
    AgentConversation,
    DeepCompatibilityAnalysis,
    DimensionAnalysis,
    ConversationDynamics,
    DepthAnalysis,
    JourneyInsights,
    GrowthArea
  } from '../../types/companion';
  
  // Define extended interfaces for internal use
  interface ExtendedUserPattern extends UserPattern {
    impact?: string;
    description?: string;
  }
  
  interface DimensionScore {
    score: number;
    [key: string]: any;
  }
  
  export class CompanionInsightEngine {
      // Analyze patterns across all user interactions
      async analyzeUserJourney(
        userId: string,
        interactions: InteractionHistory[]
      ): Promise<JourneyInsights> {
        const patterns = this.extractPatterns(interactions);
        const growthAreas = this.identifyGrowthAreas(patterns);
        const successFactors = this.identifySuccessFactors(interactions);
        
        return {
          patterns,
          growthAreas,
          successFactors,
          recommendations: this.generateRecommendations(patterns, growthAreas)
        };
      }
    
      private extractPatterns(interactions: InteractionHistory[]): UserPattern[] {
        const patterns: ExtendedUserPattern[] = [];
        
        // Communication patterns
        const messageStyles = interactions.map(i => this.analyzeMessageStyle(i));
        if (this.hasPattern(messageStyles, 'overthinking')) {
          patterns.push({
            name: 'overthinking',
            frequency: this.countFrequency(messageStyles, 'overthinking'),
            impact: 'negative',
            description: 'Tendency to overanalyze messages before sending'
          });
        }
        
        // Emotional patterns
        const emotionalStates = interactions.map(i => i.emotionalState);
        const anxietyBeforeIntros = emotionalStates.filter(
          (state, i) => state === 'anxious' && interactions[i].stage === 'pre-intro'
        );
        
        if (anxietyBeforeIntros.length > 3) {
          patterns.push({
            name: 'introduction-anxiety',
            frequency: anxietyBeforeIntros.length,
            impact: 'neutral',
            description: 'Natural nervousness before new connections'
          });
        }
        
        return patterns;
      }
  
      // Missing methods implementation
      private analyzeMessageStyle(interaction: InteractionHistory): string {
        // Simple analysis based on message characteristics
        // In a real implementation, this would use NLP
        return interaction.emotionalState === 'anxious' ? 'overthinking' : 'confident';
      }
  
      private hasPattern(styles: string[], pattern: string): boolean {
        return styles.filter(style => style === pattern).length >= 3;
      }
  
      private countFrequency(styles: string[], pattern: string): number {
        return styles.filter(style => style === pattern).length;
      }
  
      private identifyGrowthAreas(patterns: UserPattern[]): GrowthArea[] {
        const growthAreas: GrowthArea[] = [];
        
        // Map patterns to growth areas
        patterns.forEach(pattern => {
          if (pattern.name === 'overthinking' && pattern.frequency > 5) {
            growthAreas.push({
              name: 'confidence-building',
              description: 'Building confidence in authentic communication'
            });
          }
          
          if (pattern.name === 'introduction-anxiety') {
            growthAreas.push({
              name: 'comfort-with-vulnerability',
              description: 'Becoming more comfortable with the initial stages of connection'
            });
          }
        });
        
        return growthAreas;
      }
  
      private identifySuccessFactors(interactions: InteractionHistory[]): any[] {
        const factors = [];
        
        // Identify positive patterns
        const positiveEmotions = interactions.filter(i => 
          ['excited', 'happy', 'hopeful'].includes(i.emotionalState)
        );
        
        if (positiveEmotions.length > interactions.length * 0.6) {
          factors.push({
            name: 'emotional-resilience',
            strength: 'high',
            description: 'Maintains positive outlook throughout dating journey'
          });
        }
        
        return factors;
      }
  
      private generateRecommendations(patterns: UserPattern[], growthAreas: GrowthArea[]): any[] {
        const recommendations = [];
        
        growthAreas.forEach(area => {
          if (area.name === 'confidence-building') {
            recommendations.push({
              type: 'practice',
              description: 'Try sending messages without editing them more than once',
              expected_outcome: 'Reduced anxiety about perfect communication'
            });
          }
          
          if (area.name === 'comfort-with-vulnerability') {
            recommendations.push({
              type: 'mindset',
              description: 'Before conversations, remind yourself that the other person is likely nervous too',
              expected_outcome: 'Normalized feelings of vulnerability'
            });
          }
        });
        
        return recommendations;
      }
    
      // Real-time coaching during conversations
      async provideRealTimeCoaching(
        currentMessage: string,
        conversationHistory: Message[],
        matchProfile: UserProfile
      ): Promise<CoachingAdvice> {
        const messageAnalysis = this.analyzeMessage(currentMessage);
        const conversationDynamics = this.analyzeConversationFlow(conversationHistory);
        
        const advice: CoachingAdvice = {
          immediate: [],
          warnings: [],
          opportunities: []
        };
        
        // Check for red flags
        if (messageAnalysis.length > 500) {
          advice.warnings.push({
            type: 'message-length',
            message: 'This message is quite long. Consider breaking it into smaller, more digestible parts.',
            severity: 'low'
          });
        }
        
        // Identify opportunities
        if (this.detectsSharedInterest(currentMessage, matchProfile)) {
          advice.opportunities.push({
            type: 'shared-interest',
            message: 'Great! You\'re connecting on shared interests. Ask a follow-up question to go deeper.',
            action: 'Ask about their personal experience with this interest'
          });
        }
        
        // Conversation balance
        if (conversationDynamics.userDominance > 0.7) {
          advice.immediate.push({
            type: 'balance',
            message: 'You\'ve been sharing a lot (which is great!). Maybe ask them something?',
            priority: 'medium'
          });
        }
        
        return advice;
      }
  
      private analyzeMessage(message: string): any {
        // Simple message analysis
        return {
          intent: message.includes('?') ? 'question' : 'statement',
          tone: message.includes('!') ? 'enthusiastic' : 'neutral',
          length: message.length
        };
      }
  
      private analyzeConversationFlow(messages: Message[]): any {
        // Calculate basic conversation metrics
        const userMessages = messages.filter(m => m.role === 'user');
        const userWordCount = userMessages.reduce((sum, m) => sum + m.content.split(' ').length, 0);
        const totalWordCount = messages.reduce((sum, m) => sum + m.content.split(' ').length, 0);
        
        return {
          userDominance: userWordCount / (totalWordCount || 1),
          messageCount: messages.length,
          averageResponseTime: 2.5 // Placeholder
        };
      }
  
      private detectsSharedInterest(message: string, profile: UserProfile): boolean {
        // Check if message mentions any of the profile's interests
        return profile.personality.interests.some(interest => 
          message.toLowerCase().includes(interest.toLowerCase())
        );
      }
    }
    
    // Emotional Support System
    export class EmotionalSupportSystem {
      async provideSupport(
        emotionalState: EmotionalState,
        context: SupportContext
      ): Promise<EmotionalSupport> {
        const support: EmotionalSupport = {
          validation: this.validateEmotions(emotionalState),
          strategies: this.getSupportStrategies(emotionalState, context),
          exercises: this.getGroundingExercises(emotionalState),
          checkIn: this.scheduleCheckIn(emotionalState.intensity)
        };
        
        return support;
      }
    
      private validateEmotions(state: EmotionalState): string {
        const validations = {
          anxious: "It's completely normal to feel nervous about new connections. Your feelings are valid.",
          excited: "Your excitement is beautiful! It shows you're open to possibilities.",
          disappointed: "Disappointment is part of the journey. It means you're putting yourself out there.",
          confused: "Confusion often comes before clarity. Let's work through this together.",
          hopeful: "Hope is a powerful compass. Trust where it's guiding you."
        };
        
        return validations[state.primary] || "Whatever you're feeling right now is okay.";
      }
    
      private getSupportStrategies(
        state: EmotionalState,
        context: SupportContext
      ): Strategy[] {
        const strategies: Strategy[] = [];
        
        if (state.primary === 'anxious') {
          strategies.push({
            name: '5-4-3-2-1 Grounding',
            description: 'Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste',
            duration: '2 minutes',
            effectiveness: 'high'
          });
          
          strategies.push({
            name: 'Reframe Perspective',
            description: 'Instead of "What if it goes wrong?" try "What if it goes right?"',
            duration: 'ongoing',
            effectiveness: 'medium'
          });
        }
        
        return strategies;
      }
  
      private getGroundingExercises(state: EmotionalState): string[] {
        const exercises = [];
        
        if (state.intensity > 0.7) {
          exercises.push('Box breathing: Inhale for 4, hold for 4, exhale for 4, hold for 4');
          exercises.push('Progressive muscle relaxation: Tense and release each muscle group');
        } else if (state.primary === 'anxious') {
          exercises.push('Focus on your feet touching the ground');
          exercises.push('Name 5 things you can see right now');
        }
        
        return exercises;
      }
  
      private scheduleCheckIn(intensity: number): string {
        if (intensity > 0.8) {
          return '15 minutes';
        } else if (intensity > 0.5) {
          return '1 hour';
        } else {
          return 'tomorrow';
        }
      }
    }
    
    // Match Analysis Engine
    export class MatchAnalysisEngine {
      async analyzeCompatibilityDeeply(
        userProfile: UserProfile,
        matchProfile: UserProfile,
        agentConversation: AgentConversation
      ): Promise<DeepCompatibilityAnalysis> {
        const analysis: DeepCompatibilityAnalysis = {
          overallScore: 0,
          dimensions: {},
          growthPotential: 0,
          challenges: [],
          opportunities: [],
          longTermViability: 0
        };
        
        // Analyze multiple dimensions
        analysis.dimensions = {
          values: this.analyzeValueAlignment(userProfile, matchProfile),
          communication: this.analyzeCommunicationCompatibility(userProfile, matchProfile, agentConversation),
          lifestyle: this.analyzeLifestyleCompatibility(userProfile, matchProfile),
          emotional: this.analyzeEmotionalCompatibility(userProfile, matchProfile),
          growth: this.analyzeGrowthCompatibility(userProfile, matchProfile)
        };
        
        // Calculate overall score
        analysis.overallScore = this.calculateWeightedScore(analysis.dimensions);
        
        // Identify specific challenges and opportunities
        analysis.challenges = this.identifyChallenges(analysis.dimensions);
        analysis.opportunities = this.identifyOpportunities(userProfile, matchProfile);
        
        // Assess long-term potential
        analysis.longTermViability = this.assessLongTermPotential(analysis);
        
        return analysis;
      }
    
      private analyzeValueAlignment(user: UserProfile, match: UserProfile): DimensionAnalysis {
        const sharedValues = user.personality.core_values.filter(
          v => match.personality.core_values.includes(v)
        );
        
        const conflictingValues = this.identifyValueConflicts(user, match);
        
        return {
          score: (sharedValues.length / user.personality.core_values.length) * 100,
          strengths: sharedValues.map(v => `Both value ${v}`),
          areas_for_growth: conflictingValues,
          insights: [
            `${sharedValues.length} out of ${user.personality.core_values.length} core values align`,
            conflictingValues.length > 0 ? 'Some values differ but could complement each other' : 'Strong value alignment'
          ]
        };
      }
  
      private identifyValueConflicts(user: UserProfile, match: UserProfile): string[] {
        // Simple implementation to identify potentially conflicting values
        const conflicts = [];
        
        // Example of potential value conflicts
        const conflictPairs = [
          ['tradition', 'innovation'],
          ['stability', 'adventure'],
          ['independence', 'interdependence']
        ];
        
        conflictPairs.forEach(([value1, value2]) => {
          if (user.personality.core_values.includes(value1) && match.personality.core_values.includes(value2)) {
            conflicts.push(`${value1} vs ${value2}`);
          }
        });
        
        return conflicts;
      }
  
      private analyzeCommunicationCompatibility(
        user: UserProfile, 
        match: UserProfile, 
        conversation: AgentConversation
      ): DimensionAnalysis {
        // Analyze communication styles
        const userStyle = user.personality.communication_style;
        const matchStyle = match.personality.communication_style;
        
        let score = 70; // Base score
        
        // Adjust based on complementary styles
        if (userStyle === 'direct' && matchStyle === 'thoughtful') {
          score += 10;
        } else if (userStyle === matchStyle) {
          score += 15;
        }
        
        return {
          score,
          strengths: [`${userStyle} meets ${matchStyle}`],
          areas_for_growth: [],
          insights: ['Communication styles appear compatible']
        };
      }
  
      private analyzeLifestyleCompatibility(user: UserProfile, match: UserProfile): DimensionAnalysis {
        // Simple placeholder implementation
        return {
          score: 75,
          strengths: ['Similar activity levels'],
          areas_for_growth: [],
          insights: ['Lifestyle compatibility looks promising']
        };
      }
  
      private analyzeEmotionalCompatibility(user: UserProfile, match: UserProfile): DimensionAnalysis {
        // Simple placeholder implementation
        return {
          score: 80,
          strengths: ['Complementary emotional processing'],
          areas_for_growth: [],
          insights: ['Emotional compatibility is strong']
        };
      }
  
      private analyzeGrowthCompatibility(user: UserProfile, match: UserProfile): DimensionAnalysis {
        // Simple placeholder implementation
        return {
          score: 85,
          strengths: ['Shared growth mindset'],
          areas_for_growth: [],
          insights: ['Both value personal development']
        };
      }
  
      private calculateWeightedScore(dimensions: Record<string, DimensionScore>): number {
        // Calculate weighted average of dimension scores
        const weights = {
          values: 0.3,
          communication: 0.25,
          lifestyle: 0.15,
          emotional: 0.2,
          growth: 0.1
        };
        
        let weightedSum = 0;
        let totalWeight = 0;
        
        for (const [dimension, analysis] of Object.entries(dimensions)) {
          weightedSum += analysis.score * weights[dimension as keyof typeof weights];
          totalWeight += weights[dimension as keyof typeof weights];
        }
        
        return weightedSum / totalWeight;
      }
  
      private identifyChallenges(dimensions: Record<string, DimensionScore>): any[] {
        const challenges = [];
        
        // Identify dimensions with lower scores
        for (const [dimension, analysis] of Object.entries(dimensions)) {
          if (analysis.score < 70) {
            challenges.push({
              area: dimension,
              description: `Potential mismatch in ${dimension}`,
              severity: analysis.score < 50 ? 'high' : 'medium'
            });
          }
        }
        
        return challenges;
      }
  
      private identifyOpportunities(user: UserProfile, match: UserProfile): any[] {
        const opportunities = [];
        
        // Identify complementary traits
        if (user.personality.energy_type !== match.personality.energy_type) {
          opportunities.push({
            type: 'complementary-energy',
            description: `${user.personality.energy_type} and ${match.personality.energy_type} energies can balance each other`
          });
        }
        
        // Shared interests create opportunities
        const sharedInterests = user.personality.interests.filter(
          i => match.personality.interests.includes(i)
        );
        
        if (sharedInterests.length > 0) {
          opportunities.push({
            type: 'shared-activities',
            description: `Bond through shared interests in ${sharedInterests.join(', ')}`
          });
        }
        
        return opportunities;
      }
  
      private assessLongTermPotential(analysis: DeepCompatibilityAnalysis): number {
        // Calculate long-term viability score
        let score = analysis.overallScore;
        
        // Adjust based on challenges and opportunities
        score -= analysis.challenges.length * 5;
        score += analysis.opportunities.length * 3;
        
        // Cap at 100
        return Math.min(Math.max(score, 0), 100);
      }
    }
    
    // Conversation Flow Analyzer
    export class ConversationFlowAnalyzer {
      analyzeFlow(messages: Message[]): ConversationDynamics {
        return {
          balance: this.calculateBalance(messages),
          depth: this.assessDepth(messages),
          energy: this.analyzeEnergy(messages),
          topics: this.extractTopics(messages),
          emotionalArc: this.traceEmotionalArc(messages),
          connectionMoments: this.identifyConnectionMoments(messages)
        };
      }
    
      private calculateBalance(messages: Message[]): number {
        const userMessages = messages.filter(m => m.role === 'user');
        const userWordCount = userMessages.reduce((sum, m) => sum + m.content.split(' ').length, 0);
        const totalWordCount = messages.reduce((sum, m) => sum + m.content.split(' ').length, 0);
        
        return userWordCount / totalWordCount;
      }
    
      private assessDepth(messages: Message[]): DepthAnalysis {
        const deepIndicators = [
          'feel', 'believe', 'value', 'dream', 'fear', 'hope', 'wonder',
          'meaningful', 'important', 'why', 'purpose', 'passion'
        ];
        
        let depthScore = 0;
        messages.forEach(message => {
          const content = message.content.toLowerCase();
          deepIndicators.forEach(indicator => {
            if (content.includes(indicator)) depthScore++;
          });
        });
        
        return {
          score: Math.min(depthScore / messages.length, 1),
          moments: this.findDeepMoments(messages, deepIndicators),
          progression: this.trackDepthProgression(messages, deepIndicators)
        };
      }
  
      private analyzeEnergy(messages: Message[]): any {
        // Analyze conversation energy
        const energyIndicators = {
          high: ['!', 'excited', 'amazing', 'love', 'awesome', 'wow'],
          medium: ['interesting', 'good', 'nice', 'enjoy'],
          low: ['hmm', 'okay', 'i see', 'alright']
        };
        
        let highCount = 0;
        let mediumCount = 0;
        let lowCount = 0;
        
        messages.forEach(message => {
          const content = message.content.toLowerCase();
          
          energyIndicators.high.forEach(indicator => {
            if (content.includes(indicator)) highCount++;
          });
          
          energyIndicators.medium.forEach(indicator => {
            if (content.includes(indicator)) mediumCount++;
          });
          
          energyIndicators.low.forEach(indicator => {
            if (content.includes(indicator)) lowCount++;
          });
        });
        
        const total = highCount + mediumCount + lowCount || 1;
        
        return {
          level: highCount > mediumCount && highCount > lowCount ? 'high' : 
                 mediumCount > lowCount ? 'medium' : 'low',
          distribution: {
            high: highCount / total,
            medium: mediumCount / total,
            low: lowCount / total
          },
          trend: this.analyzeEnergyTrend(messages)
        };
      }
  
      private analyzeEnergyTrend(messages: Message[]): string {
        // Simple placeholder
        return messages.length > 5 ? 'increasing' : 'stable';
      }
  
      private extractTopics(messages: Message[]): any[] {
        // Simple topic extraction
        const commonTopics = [
          'work', 'family', 'hobbies', 'travel', 'food', 
          'movies', 'music', 'books', 'philosophy', 'future'
        ];
        
        const topicCounts: Record<string, number> = {};
        
        commonTopics.forEach(topic => {
          topicCounts[topic] = messages.filter(
            m => m.content.toLowerCase().includes(topic)
          ).length;
        });
        
        // Convert to array of objects
        return Object.entries(topicCounts)
          .filter(([_, count]) => count > 0)
          .map(([topic, count]) => ({
            name: topic,
            mentions: count,
            engagement: count > 2 ? 'high' : 'low'
          }));
      }
  
      private traceEmotionalArc(messages: Message[]): any {
        // Placeholder implementation
        return {
          start: 'neutral',
          middle: messages.length > 5 ? 'engaged' : 'neutral',
          end: messages.length > 10 ? 'connected' : 'engaged',
          key_shifts: []
        };
      }
  
      private identifyConnectionMoments(messages: Message[]): any[] {
        // Identify moments of strong connection
        const connectionMoments = [];
        
        messages.forEach((message, index) => {
          if (index > 0 && message.content.length > 100) {
            // Long responses often indicate engagement
            connectionMoments.push({
              index,
              type: 'deep-sharing',
              strength: 'medium'
            });
          }
          
          if (message.content.includes('?') && 
              index < messages.length - 1 && 
              messages[index + 1].content.length > 80) {
            // Question followed by long answer
            connectionMoments.push({
              index,
              type: 'curiosity-vulnerability',
              strength: 'high'
            });
          }
        });
        
        return connectionMoments;
      }
  
      private findDeepMoments(messages: Message[], indicators: string[]): any[] {
        const deepMoments = [];
        
        messages.forEach((message, index) => {
          const content = message.content.toLowerCase();
          let indicatorCount = 0;
          
          indicators.forEach(indicator => {
            if (content.includes(indicator)) indicatorCount++;
          });
          
          if (indicatorCount >= 2) {
            deepMoments.push({
              index,
              indicators: indicatorCount,
              excerpt: message.content.substring(0, 50) + '...'
            });
          }
        });
        
        return deepMoments;
      }
  
      private trackDepthProgression(messages: Message[], indicators: string[]): any {
        // Track how conversation depth changes over time
        const depthScores = messages.map(message => {
          const content = message.content.toLowerCase();
          return indicators.filter(i => content.includes(i)).length;
        });
        
        // Calculate progression
        const firstThird = depthScores.slice(0, Math.floor(depthScores.length / 3));
        const lastThird = depthScores.slice(-Math.floor(depthScores.length / 3));
        
        const firstAvg = firstThird.reduce((sum, score) => sum + score, 0) / firstThird.length || 0;
        const lastAvg = lastThird.reduce((sum, score) => sum + score, 0) / lastThird.length || 0;
        
        return {
          trend: lastAvg > firstAvg ? 'deepening' : 
                 lastAvg < firstAvg ? 'lightening' : 'consistent',
          change_magnitude: Math.abs(lastAvg - firstAvg)
        };
      }
    }