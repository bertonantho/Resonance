import { WebAudioAnalyzer } from './webAudioHelpers';

// Add type declaration for webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

interface AudioFeatures {
  pitch: {
    mean: number;
    variance: number;
    range: string; // "low", "medium-low", "medium", "medium-high", "high"
  };
  pace: {
    wordsPerMinute: number;
    pauseFrequency: number;
    description: string;
  };
  energy: {
    volumeVariance: number;
    intensityMoments: number[];
    description: string;
  };
  emotions: {
    dominant: string;
    range: number; // 0-1
    moments: Array<{
      timestamp: number;
      emotion: string;
      confidence: number;
    }>;
  };
}

interface TranscriptionResult {
  text: string;
  words: Array<{
    word: string;
    start: number;
    end: number;
    confidence: number;
  }>;
  segments: Array<{
    text: string;
    start: number;
    end: number;
  }>;
}

export class AudioProfileExtractor {
  private audioAnalyzer: WebAudioAnalyzer;
  
  constructor() {
    this.audioAnalyzer = new WebAudioAnalyzer();
  }

  async extractProfile(audioFile: File | Blob) {
    // Step 1: Transcribe audio with timestamps
    const transcription = await this.transcribeAudio(audioFile);
    
    // Step 2: Extract voice features
    const audioFeatures = await this.extractAudioFeatures(audioFile);
    
    // Step 3: Analyze transcript content
    const contentAnalysis = await this.analyzeContent(transcription.text);
    
    // Step 4: Generate voice characteristics
    const voiceCharacteristics = this.generateVoiceCharacteristics(
      audioFeatures,
      transcription
    );
    
    // Step 5: Build complete profile
    return this.buildProfile(
      transcription,
      voiceCharacteristics,
      contentAnalysis
    );
  }

  private async transcribeAudio(audioFile: File | Blob): Promise<TranscriptionResult> {
    try {
      const formData = new FormData();
      formData.append('file', audioFile);
      
      // Use our secure API route for audio transcription
      const response = await fetch('/api/audio-transcription', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error transcribing audio:', error);
      // Return a minimal transcription result if API call fails
      return {
        text: "Failed to transcribe audio. Please try again.",
        words: [],
        segments: []
      };
    }
  }

  private async extractAudioFeatures(audioFile: File | Blob): Promise<AudioFeatures> {
    // Use WebAudioAnalyzer to get basic audio analysis
    const audioAnalysis = await this.audioAnalyzer.analyzeAudioFile(audioFile as File);
    
    // Convert audio to array buffer for our specific feature extraction
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Extract features
    const pitch = this.analyzePitch(audioBuffer);
    const pace = this.analyzePace(audioBuffer);
    
    // Use energy data from the analyzer
    const energy = {
      volumeVariance: audioAnalysis.temporalFeatures.energy,
      intensityMoments: [], // We'll calculate this from the analyzer data
      description: this.describeEnergy(audioAnalysis.temporalFeatures.energy, 0)
    };
    
    const emotions = await this.analyzeEmotions(audioBuffer);
    
    return { pitch, pace, energy, emotions };
  }

  private analyzePitch(audioBuffer: AudioBuffer) {
    const data = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    
    // Simple pitch detection using autocorrelation
    const pitchValues = [];
    const windowSize = 2048;
    const hop = 1024;
    
    for (let i = 0; i < data.length - windowSize; i += hop) {
      const window = data.slice(i, i + windowSize);
      const pitch = this.detectPitch(window, sampleRate);
      if (pitch > 0) pitchValues.push(pitch);
    }
    
    const mean = pitchValues.reduce((a, b) => a + b, 0) / pitchValues.length;
    const variance = this.calculateVariance(pitchValues, mean);
    
    return {
      mean,
      variance,
      range: this.categorizePitch(mean)
    };
  }

  private detectPitch(buffer: Float32Array, sampleRate: number): number {
    // Simplified autocorrelation-based pitch detection
    const minPeriod = Math.floor(sampleRate / 400); // 400 Hz max
    const maxPeriod = Math.floor(sampleRate / 75);  // 75 Hz min
    
    let maxCorr = 0;
    let bestPeriod = 0;
    
    for (let period = minPeriod; period < maxPeriod; period++) {
      let corr = 0;
      for (let i = 0; i < buffer.length - period; i++) {
        corr += buffer[i] * buffer[i + period];
      }
      if (corr > maxCorr) {
        maxCorr = corr;
        bestPeriod = period;
      }
    }
    
    return bestPeriod > 0 ? sampleRate / bestPeriod : 0;
  }

  private categorizePitch(meanPitch: number): string {
    if (meanPitch < 110) return "low";
    if (meanPitch < 150) return "medium-low";
    if (meanPitch < 200) return "medium";
    if (meanPitch < 250) return "medium-high";
    return "high";
  }

  private analyzePace(audioBuffer: AudioBuffer) {
    // Simplified pace analysis
    const duration = audioBuffer.duration;
    const estimatedWords = duration * 2.5; // Average speaking rate estimate
    
    return {
      wordsPerMinute: Math.round((estimatedWords / duration) * 60),
      pauseFrequency: this.detectPauses(audioBuffer),
      description: this.describePace(estimatedWords / duration)
    };
  }

  private detectPauses(audioBuffer: AudioBuffer): number {
    const data = audioBuffer.getChannelData(0);
    const threshold = 0.01;
    let pauseCount = 0;
    let inPause = false;
    
    for (let i = 0; i < data.length; i++) {
      if (Math.abs(data[i]) < threshold) {
        if (!inPause) {
          pauseCount++;
          inPause = true;
        }
      } else {
        inPause = false;
      }
    }
    
    return pauseCount / audioBuffer.duration; // Pauses per second
  }

  private describePace(wordsPerSecond: number): string {
    if (wordsPerSecond < 2) return "slow with many pauses";
    if (wordsPerSecond < 2.5) return "moderate with thoughtful pauses";
    if (wordsPerSecond < 3) return "moderate";
    if (wordsPerSecond < 3.5) return "quick with animated bursts";
    return "rapid-fire";
  }

  private analyzeEnergy(audioBuffer: AudioBuffer) {
    const data = audioBuffer.getChannelData(0);
    const windowSize = Math.floor(audioBuffer.sampleRate * 0.5); // 0.5 second windows
    const energyValues = [];
    
    for (let i = 0; i < data.length - windowSize; i += windowSize) {
      let energy = 0;
      for (let j = 0; j < windowSize; j++) {
        energy += data[i + j] * data[i + j];
      }
      energyValues.push(Math.sqrt(energy / windowSize));
    }
    
    const variance = this.calculateVariance(energyValues);
    const intensityMoments = this.findIntensityPeaks(energyValues);
    
    return {
      volumeVariance: variance,
      intensityMoments,
      description: this.describeEnergy(variance, intensityMoments.length)
    };
  }

  private calculateVariance(values: number[], mean?: number): number {
    const m = mean || values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - m, 2), 0) / values.length;
    return variance;
  }

  private findIntensityPeaks(energyValues: number[]): number[] {
    const threshold = Math.max(...energyValues) * 0.7;
    return energyValues
      .map((v, i) => ({ value: v, index: i }))
      .filter(item => item.value > threshold)
      .map(item => item.index);
  }

  private describeEnergy(variance: number, peakCount: number): string {
    if (variance < 0.1 && peakCount < 3) return "calm and steady";
    if (variance < 0.2 && peakCount < 5) return "calm but enthusiastic when discussing passions";
    if (variance < 0.3) return "moderate with occasional emphasis";
    if (variance < 0.4) return "animated and expressive";
    return "high energy and dynamic";
  }

  private async analyzeEmotions(audioBuffer: AudioBuffer): Promise<any> {
    // Simplified emotion detection based on prosody
    // In production, use a specialized emotion detection API
    return {
      dominant: "thoughtful",
      range: 0.7,
      moments: []
    };
  }

  private async analyzeContent(transcript: string) {
    try {
      // Use our secure API route for content analysis
      const response = await fetch('/api/content-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing content:', error);
      // Return a default analysis if API call fails
      return {
        topics: ['conversation'],
        personality: {
          core_values: ['authenticity'],
          communication_style: 'thoughtful',
          energy_type: 'balanced'
        },
        interests: ['general']
      };
    }
  }

  private generateVoiceCharacteristics(
    features: AudioFeatures,
    transcription: TranscriptionResult
  ) {
    // Extract filler words
    const fillerWords = this.extractFillerWords(transcription);
    
    // Detect laughter
    const laughterStyle = this.detectLaughterStyle(transcription.text);
    
    return {
      pitch: features.pitch.range,
      pace: features.pace.description,
      energy: features.energy.description,
      patterns: {
        pauseFrequency: features.pace.pauseFrequency > 2 ? "high" : 
                       features.pace.pauseFrequency > 1 ? "medium" : "low",
        laughterStyle,
        fillerWords,
        emotionalRange: features.emotions.range
      }
    };
  }

  private extractFillerWords(transcription: TranscriptionResult): string[] {
    const commonFillers = ['um', 'uh', 'hmm', 'like', 'you know', 'actually', 'basically', 'literally'];
    const text = transcription.text.toLowerCase();
    
    return commonFillers.filter(filler => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = text.match(regex);
      return matches && matches.length > 2; // Used at least 3 times
    });
  }

  private detectLaughterStyle(text: string): string {
    const laughPatterns = {
      'haha|lol': 'hearty, open laughter',
      'heh|hehe': 'quiet, genuine chuckles',
      '\\*laugh\\*|\\*laughs\\*': 'warm, natural laughter',
      '\\*chuckle\\*|\\*chuckles\\*': 'soft, appreciative chuckles'
    };
    
    for (const [pattern, style] of Object.entries(laughPatterns)) {
      if (new RegExp(pattern, 'i').test(text)) {
        return style;
      }
    }
    
    return 'subtle, restrained';
  }

  private buildProfile(
    transcription: TranscriptionResult,
    voiceCharacteristics: any,
    contentAnalysis: any
  ) {
    return {
      id: `profile_${Date.now()}`,
      name: "User", // To be filled by user
      age: null, // To be filled by user
      location: null, // To be filled by user
      voiceCharacteristics,
      transcript: this.formatTranscript(transcription.text),
      personality: contentAnalysis
    };
  }

  private formatTranscript(text: string): string {
    // Clean up and format the transcript
    return text
      .replace(/\s+/g, ' ')
      .replace(/([.!?])\s+/g, '$1\n\n')
      .trim();
  }
}