import { VoiceSession, UserProfile, AudioAnalysis, VoiceCharacteristics, PersonalityTraits } from '@/types/voiceCapture';

export class VoiceProfileExtractor {
    async extractCompleteProfile(
      session: VoiceSession,
      audioAnalysis: AudioAnalysis[]
    ): Promise<UserProfile> {
      // Combine all responses
      const allTranscripts = session.responses.map(r => r.transcript).join('\n\n');
      
      // Extract voice characteristics
      const voiceCharacteristics = this.extractVoiceCharacteristics(audioAnalysis);
      
      // Extract personality using GPT-4
      const personality = await this.extractPersonality(allTranscripts, session.responses);
      
      // Build complete profile
      return {
        id: `profile_${Date.now()}`,
        voiceCharacteristics,
        transcript: this.formatTranscript(allTranscripts),
        personality,
        metadata: {
          captureMethod: 'adaptive_questioning',
          sessionDuration: this.calculateSessionDuration(session),
          questionCount: session.questions.length,
          adaptationRate: this.calculateAdaptationRate(session)
        }
      };
    }
  
    private calculateAdaptationRate(session: VoiceSession): number {
      const totalQuestions = session.questions.length;
      const adaptedQuestions = session.questions.filter(q => 
        q.adaptationReason !== undefined
      ).length;
      
      return adaptedQuestions / totalQuestions;
    }

    private extractVoiceCharacteristics(audioAnalysis: AudioAnalysis[]): VoiceCharacteristics {
      // Aggregate audio analysis data
      const energyValues = audioAnalysis.map(a => a.energyLevel);
      const avgEnergy = energyValues.reduce((sum, val) => sum + val, 0) / audioAnalysis.length;
      
      // Determine tone based on emotions
      const allEmotions = audioAnalysis.flatMap(a => a.emotions);
      const emotionCounts = allEmotions.reduce((counts, emotion) => {
        counts[emotion] = (counts[emotion] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);
      
      // Find dominant emotion
      let dominantEmotion = 'neutral';
      let maxCount = 0;
      for (const [emotion, count] of Object.entries(emotionCounts)) {
        if (count > maxCount) {
          maxCount = count;
          dominantEmotion = emotion;
        }
      }
      
      // Map dominant emotion to tone
      const toneMap: Record<string, string> = {
        happy: 'warm and upbeat',
        sad: 'reflective and measured',
        thoughtful: 'analytical and deliberate',
        passionate: 'intense and expressive',
        calm: 'steady and composed',
        neutral: 'balanced and even'
      };
      
      return {
        tone: toneMap[dominantEmotion] || 'balanced',
        pace: this.determinePace(audioAnalysis),
        energy: avgEnergy,
        clarity: this.determineClarity(audioAnalysis)
      };
    }
    
    private determinePace(audioAnalysis: AudioAnalysis[]): string {
      // Calculate average speech rate
      const speechRates = audioAnalysis.map(a => {
        // This would come from the audio analysis in a real implementation
        // Here we're simulating it
        return Math.random() * 0.5 + 0.75; // 0.75-1.25 range
      });
      
      const avgRate = speechRates.reduce((sum, rate) => sum + rate, 0) / speechRates.length;
      
      if (avgRate < 0.85) return 'measured and deliberate';
      if (avgRate > 1.15) return 'quick and animated';
      return 'moderate and steady';
    }
    
    private determineClarity(audioAnalysis: AudioAnalysis[]): number {
      // Simulated clarity score based on speech patterns
      // In a real implementation, this would analyze pronunciation, articulation, etc.
      return Math.random() * 0.4 + 0.6; // 0.6-1.0 range
    }
    
    private async extractPersonality(transcript: string, responses: any[]): Promise<PersonalityTraits> {
      // In a real implementation, this would use GPT-4 or similar to analyze personality
      // For now, we'll return a simulated personality profile
      
      return {
        values: this.extractValues(transcript),
        communicationStyle: this.determineCommunicationStyle(transcript),
        interests: this.extractInterests(transcript),
        traits: this.extractTraits(transcript)
      };
    }
    
    private extractValues(transcript: string): string[] {
      const valueKeywords = {
        'family': ['family', 'parents', 'children', 'siblings'],
        'achievement': ['success', 'accomplish', 'achieve', 'goal'],
        'growth': ['learn', 'grow', 'develop', 'improve'],
        'connection': ['connect', 'relationship', 'together', 'community'],
        'autonomy': ['freedom', 'independence', 'choice', 'decide']
      };
      
      return this.extractKeywordMatches(transcript, valueKeywords, 2);
    }
    
    private extractInterests(transcript: string): string[] {
      const interestKeywords = {
        'arts': ['art', 'music', 'film', 'creative', 'design'],
        'outdoors': ['nature', 'hike', 'outdoor', 'adventure'],
        'technology': ['tech', 'computer', 'digital', 'code'],
        'wellness': ['health', 'fitness', 'meditation', 'yoga'],
        'culinary': ['food', 'cook', 'restaurant', 'cuisine']
      };
      
      return this.extractKeywordMatches(transcript, interestKeywords, 3);
    }
    
    private extractTraits(transcript: string): string[] {
      const traitKeywords = {
        'analytical': ['think', 'analyze', 'consider', 'detail'],
        'empathetic': ['feel', 'understand', 'care', 'perspective'],
        'adventurous': ['try', 'new', 'experience', 'explore'],
        'reliable': ['consistent', 'depend', 'trust', 'responsible'],
        'adaptable': ['change', 'adjust', 'flexible', 'different']
      };
      
      return this.extractKeywordMatches(transcript, traitKeywords, 3);
    }
    
    private extractKeywordMatches(
      transcript: string, 
      categories: Record<string, string[]>, 
      limit: number
    ): string[] {
      const matches: [string, number][] = [];
      const lowercaseText = transcript.toLowerCase();
      
      for (const [category, keywords] of Object.entries(categories)) {
        let count = 0;
        for (const keyword of keywords) {
          // Count occurrences of keyword in transcript
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
          const matches = lowercaseText.match(regex);
          if (matches) count += matches.length;
        }
        
        if (count > 0) matches.push([category, count]);
      }
      
      // Sort by frequency and take top matches
      return matches
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([category]) => category);
    }
    
    private determineCommunicationStyle(transcript: string): string {
      const styles = [
        'direct and concise',
        'thoughtful and reflective',
        'warm and expressive',
        'analytical and detailed',
        'storytelling and narrative'
      ];
      
      // In a real implementation, this would analyze communication patterns
      // For now, we'll return a random style
      return styles[Math.floor(Math.random() * styles.length)];
    }
    
    private formatTranscript(text: string): string {
      // Clean up and format transcript for storage
      return text.trim();
    }
    
    private calculateSessionDuration(session: VoiceSession): number {
      // Sum up the duration of all responses
      return session.responses.reduce((total, response) => total + response.duration, 0);
    }
  }