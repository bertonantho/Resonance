// Add type declaration for webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export class WebAudioAnalyzer {
  private audioContext: AudioContext;
  
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  async analyzeAudioFile(file: File): Promise<AudioAnalysis> {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    
    return {
      duration: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate,
      numberOfChannels: audioBuffer.numberOfChannels,
      spectralFeatures: await this.extractSpectralFeatures(audioBuffer),
      temporalFeatures: this.extractTemporalFeatures(audioBuffer)
    };
  }

  private async extractSpectralFeatures(audioBuffer: AudioBuffer) {
    const analyser = this.audioContext.createAnalyser();
    analyser.fftSize = 2048;
    
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyser);
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Get frequency data
    analyser.getByteFrequencyData(dataArray);
    
    return {
      spectralCentroid: this.calculateSpectralCentroid(dataArray),
      spectralRolloff: this.calculateSpectralRolloff(dataArray),
      spectralFlux: this.calculateSpectralFlux(dataArray)
    };
  }

  private calculateSpectralCentroid(frequencyData: Uint8Array): number {
    let weightedSum = 0;
    let magnitudeSum = 0;
    
    for (let i = 0; i < frequencyData.length; i++) {
      weightedSum += i * frequencyData[i];
      magnitudeSum += frequencyData[i];
    }
    
    return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;
  }

  private calculateSpectralRolloff(frequencyData: Uint8Array): number {
    const total = frequencyData.reduce((sum, value) => sum + value, 0);
    const threshold = total * 0.85;
    
    let sum = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      sum += frequencyData[i];
      if (sum >= threshold) {
        return i / frequencyData.length;
      }
    }
    
    return 1;
  }

  private calculateSpectralFlux(frequencyData: Uint8Array): number {
    // Simplified spectral flux calculation
    let flux = 0;
    for (let i = 1; i < frequencyData.length; i++) {
      const diff = frequencyData[i] - frequencyData[i - 1];
      flux += diff > 0 ? diff : 0;
    }
    return flux / frequencyData.length;
  }

  private extractTemporalFeatures(audioBuffer: AudioBuffer) {
    const data = audioBuffer.getChannelData(0);
    
    return {
      zeroCrossingRate: this.calculateZeroCrossingRate(data),
      energy: this.calculateEnergy(data),
      tempo: this.estimateTempo(data, audioBuffer.sampleRate)
    };
  }

  private calculateZeroCrossingRate(data: Float32Array): number {
    let crossings = 0;
    for (let i = 1; i < data.length; i++) {
      if ((data[i] >= 0) !== (data[i - 1] >= 0)) {
        crossings++;
      }
    }
    return crossings / data.length;
  }

  private calculateEnergy(data: Float32Array): number {
    return data.reduce((sum, sample) => sum + sample * sample, 0) / data.length;
  }

  private estimateTempo(data: Float32Array, sampleRate: number): number {
    // Simplified tempo estimation
    // In production, use a proper beat detection algorithm
    return 120; // Default tempo
  }
}

export interface AudioAnalysis {
  duration: number;
  sampleRate: number;
  numberOfChannels: number;
  spectralFeatures: {
    spectralCentroid: number;
    spectralRolloff: number;
    spectralFlux: number;
  };
  temporalFeatures: {
    zeroCrossingRate: number;
    energy: number;
    tempo: number;
  };
}