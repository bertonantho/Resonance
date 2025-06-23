import { CaptureQuestion, VoiceSession, VoiceResponse, ResponseAnalysis, AudioFeatures, AudioAnalysis } from '@/types/voiceCapture';
import { CORE_QUESTIONS, ADAPTIVE_QUESTIONS } from '@/data/coreQuestions';

export class AdaptiveQuestionEngine {
    private askedQuestions: Set<string> = new Set();
    private responseAnalyzer: ResponseAnalyzer;
    private sessionContext: VoiceSession;
    
    constructor(sessionContext: VoiceSession) {
      this.sessionContext = sessionContext;
      this.responseAnalyzer = new ResponseAnalyzer();
    }
  
    async getNextQuestion(
      lastResponse?: VoiceResponse
    ): Promise<CaptureQuestion> {
      // First 5 questions are always core questions
      if (this.askedQuestions.size < 5) {
        return this.getNextCoreQuestion();
      }
      
      // After core questions, adapt based on responses
      if (lastResponse) {
        const analysis = await this.responseAnalyzer.analyze(lastResponse);
        
        // Check for triggered follow-ups
        const triggeredQuestion = this.checkTriggers(analysis, lastResponse);
        if (triggeredQuestion) {
          return triggeredQuestion;
        }
        
        // Check if we need deepening questions
        if (this.shouldDeepen(analysis)) {
          return this.getDeepeningQuestion(analysis);
        }
      }
      
      // Continue with remaining core questions
      return this.getNextCoreQuestion();
    }
  
    private async checkTriggers(
      analysis: ResponseAnalysis,
      response: VoiceResponse
    ): Promise<CaptureQuestion | null> {
      const lastQuestion = CORE_QUESTIONS.find(q => q.id === response.questionId);
      if (!lastQuestion?.triggers) return null;
      
      for (const trigger of lastQuestion.triggers) {
        // Check keywords
        const hasKeyword = trigger.keywords.some(keyword => 
          response.transcript.toLowerCase().includes(keyword.toLowerCase())
        );
        
        // Check emotions
        const hasEmotion = trigger.emotions.some(emotion =>
          analysis.detectedEmotions.includes(emotion)
        );
        
        // Check pause patterns
        const hasPausePattern = trigger.pausePatterns.length === 0 ||
          trigger.pausePatterns.some(pattern => analysis.pausePattern === pattern);
        
        if (hasKeyword || hasEmotion || hasPausePattern) {
          const followUp = ADAPTIVE_QUESTIONS.find(q => q.id === trigger.leadsTo);
          if (followUp && !this.askedQuestions.has(followUp.id)) {
            return followUp;
          }
        }
      }
      
      return null;
    }
  
    private shouldDeepen(analysis: ResponseAnalysis): boolean {
      // Deepen if user shows high engagement
      return (
        analysis.responseLength > 45 && // Talking for more than 45 seconds
        analysis.emotionalIntensity > 0.7 &&
        analysis.detectedThemes.length > 2
      );
    }
  
    private getDeepeningQuestion(analysis: ResponseAnalysis): CaptureQuestion {
      // Select deepening question based on detected themes
      const deepeningQuestions = ADAPTIVE_QUESTIONS.filter(q => 
        q.type === 'deepening' && !this.askedQuestions.has(q.id)
      );
      
      // Match question to themes
      const matchedQuestion = deepeningQuestions.find(q =>
        analysis.detectedThemes.some(theme => q.category === theme)
      );
      
      return matchedQuestion || deepeningQuestions[0];
    }
  
    private getNextCoreQuestion(): CaptureQuestion {
      const unanswered = CORE_QUESTIONS.filter(q => 
        !this.askedQuestions.has(q.id)
      );
      
      if (unanswered.length === 0) {
        // All questions asked, end session
        return null;
      }
      
      // Return questions in order unless adapting
      return unanswered[0];
    }
  }
  
  // Response Analyzer
  export class ResponseAnalyzer {
    async analyze(response: VoiceResponse): Promise<ResponseAnalysis> {
      const features = await this.extractFeatures(response);
      
      return {
        responseLength: response.duration,
        emotionalIntensity: features.emotionalIntensity,
        detectedEmotions: features.emotions,
        detectedThemes: this.extractThemes(response.transcript),
        pausePattern: this.analyzePauses(response.audioFeatures),
        energyLevel: features.energyLevel,
        authenticity: this.measureAuthenticity(features)
      };
    }
  
    private extractThemes(transcript: string): string[] {
      const themeKeywords = {
        values: ['important', 'believe', 'value', 'matter', 'principle'],
        relationships: ['friend', 'family', 'partner', 'connection', 'people'],
        lifestyle: ['day', 'routine', 'enjoy', 'weekend', 'time'],
        dreams: ['hope', 'dream', 'future', 'want', 'wish'],
        personality: ['I am', 'I feel', 'I think', 'always', 'never']
      };
      
      const detectedThemes: string[] = [];
      
      for (const [theme, keywords] of Object.entries(themeKeywords)) {
        const hasTheme = keywords.some(keyword => 
          transcript.toLowerCase().includes(keyword)
        );
        if (hasTheme) detectedThemes.push(theme);
      }
      
      return detectedThemes;
    }
  
    private analyzePauses(audioFeatures: AudioFeatures): string {
      const pauseFrequency = audioFeatures.pauses.length / audioFeatures.duration;
      
      if (pauseFrequency > 0.3) return 'high';
      if (pauseFrequency > 0.15) return 'moderate';
      return 'low';
    }
  
    private measureAuthenticity(features: any): number {
      // Higher authenticity indicated by:
      // - Natural speech patterns (not rehearsed)
      // - Emotional variance
      // - Personal anecdotes
      // - Thoughtful pauses
      
      let score = 0.5; // baseline
      
      if (features.speechVariability > 0.7) score += 0.1;
      if (features.emotionalRange > 0.6) score += 0.1;
      if (features.fillerWords.length > 2) score += 0.1; // Natural speech
      if (features.personalPronouns > 5) score += 0.1;
      if (features.pauseAuthenticity > 0.7) score += 0.1;
      
      return Math.min(score, 1.0);
    }

    private async extractFeatures(response: VoiceResponse): Promise<AudioAnalysis> {
      // This would normally call an audio analysis service
      // For now, we'll simulate the analysis
      return {
        questionId: response.questionId,
        emotions: this.detectEmotions(response),
        emotionalIntensity: this.calculateEmotionalIntensity(response),
        speechVariability: Math.random() * 0.5 + 0.5, // 0.5-1.0
        emotionalRange: Math.random() * 0.5 + 0.5, // 0.5-1.0
        personalPronouns: this.countPersonalPronouns(response.transcript),
        pauseAuthenticity: this.calculatePauseAuthenticity(response.audioFeatures),
        energyLevel: this.calculateEnergyLevel(response.audioFeatures)
      };
    }

    private detectEmotions(response: VoiceResponse): string[] {
      // Simplified emotion detection based on keywords
      const emotionKeywords = {
        happy: ['happy', 'joy', 'excited', 'love', 'wonderful'],
        sad: ['sad', 'upset', 'disappointed', 'unhappy', 'miss'],
        thoughtful: ['think', 'consider', 'reflect', 'wonder', 'curious'],
        passionate: ['love', 'hate', 'never', 'always', 'must'],
        calm: ['peaceful', 'quiet', 'relax', 'gentle', 'easy']
      };
      
      const detected: string[] = [];
      
      for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
        const hasEmotion = keywords.some(keyword => 
          response.transcript.toLowerCase().includes(keyword)
        );
        if (hasEmotion) detected.push(emotion);
      }
      
      return detected.length > 0 ? detected : ['neutral'];
    }

    private calculateEmotionalIntensity(response: VoiceResponse): number {
      // Simple heuristic based on audio features
      const volumeVariance = this.calculateVariance(response.audioFeatures.volume);
      const pitchVariance = this.calculateVariance(response.audioFeatures.pitch);
      
      return Math.min((volumeVariance + pitchVariance) / 2, 1.0);
    }

    private calculateVariance(values: number[]): number {
      if (values.length === 0) return 0;
      
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      
      return Math.min(variance * 10, 1.0); // Normalized to 0-1
    }

    private countPersonalPronouns(transcript: string): number {
      const pronouns = ['i', 'me', 'my', 'mine', 'myself'];
      const words = transcript.toLowerCase().split(/\s+/);
      
      return words.filter(word => pronouns.includes(word)).length;
    }

    private calculatePauseAuthenticity(audioFeatures: AudioFeatures): number {
      // Authentic pauses tend to be varied in length and placement
      const pauseLengths = audioFeatures.pauses.map(p => p.duration);
      const pauseVariance = this.calculateVariance(pauseLengths);
      
      return Math.min(pauseVariance * 5 + 0.5, 1.0); // 0.5-1.0 range
    }

    private calculateEnergyLevel(audioFeatures: AudioFeatures): number {
      // Energy level based on volume and speech rate
      const avgVolume = audioFeatures.volume.reduce((sum, vol) => sum + vol, 0) / 
                       (audioFeatures.volume.length || 1);
      
      return Math.min((avgVolume * 0.7 + audioFeatures.speechRate * 0.3), 1.0);
    }
  }