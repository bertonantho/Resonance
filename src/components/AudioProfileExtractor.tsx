import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AudioProfileExtractor } from '../lib/audio/audioExtractor';

export const AudioProfileExtractorComponent = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  // Initialize the extractor without an API key
  const extractor = new AudioProfileExtractor();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
    }
  };

  const processAudio = async () => {
    if (!audioFile) return;
    
    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const steps = [
        { progress: 20, step: 'Transcribing audio...' },
        { progress: 40, step: 'Analyzing voice patterns...' },
        { progress: 60, step: 'Extracting personality traits...' },
        { progress: 80, step: 'Building your profile...' },
        { progress: 100, step: 'Complete!' }
      ];

      for (const { progress, step } of steps) {
        setProgress(progress);
        setCurrentStep(step);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Extract profile
      try {
        const extractedProfile = await extractor.extractProfile(audioFile);
        setProfile(extractedProfile);
      } catch (error) {
        console.error('Error extracting profile:', error);
        alert('Error extracting profile. Please check the console for details.');
      }

    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-light text-center mb-8">
        Extract Profile from Voice
      </h2>

      {!profile ? (
        <div className="space-y-8">
          {/* File Upload */}
          <div className="bg-white/5 border-2 border-dashed border-white/20 rounded-2xl p-12 text-center">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              id="audio-upload"
            />
            <label htmlFor="audio-upload" className="cursor-pointer">
              <div className="space-y-4">
                <div className="text-6xl">🎙️</div>
                <p className="text-xl">
                  {audioFile ? audioFile.name : 'Upload your 3-minute voice recording'}
                </p>
                <p className="text-sm text-gray-400">
                  Supported formats: MP3, WAV, M4A
                </p>
              </div>
            </label>
          </div>

          {/* Process Button */}
          {audioFile && !isProcessing && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={processAudio}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium text-lg hover:opacity-90 transition-opacity"
            >
              Extract My Voice Profile
            </motion.button>
          )}

          {/* Processing Status */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="text-center text-lg">{currentStep}</div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <ProfileDisplay profile={profile} />
      )}
    </div>
  );
};

interface ProfileDisplayProps {
  profile: any; // Ideally, we would define a proper type for the profile
}

const ProfileDisplay = ({ profile }: ProfileDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white/5 rounded-2xl p-6">
        <h3 className="text-xl font-medium mb-4">Voice Characteristics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400">Pitch:</span>
            <p>{profile.voiceCharacteristics.pitch}</p>
          </div>
          <div>
            <span className="text-gray-400">Pace:</span>
            <p>{profile.voiceCharacteristics.pace}</p>
          </div>
          <div>
            <span className="text-gray-400">Energy:</span>
            <p>{profile.voiceCharacteristics.energy}</p>
          </div>
          <div>
            <span className="text-gray-400">Emotional Range:</span>
            <p>{(profile.voiceCharacteristics.patterns.emotionalRange * 100).toFixed(0)}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-6">
        <h3 className="text-xl font-medium mb-4">Personality Analysis</h3>
        <div className="space-y-3">
          <div>
            <span className="text-gray-400">Core Values:</span>
            <p>{profile.personality.core_values.join(', ')}</p>
          </div>
          <div>
            <span className="text-gray-400">Communication Style:</span>
            <p>{profile.personality.communication_style}</p>
          </div>
          <div>
            <span className="text-gray-400">Energy Type:</span>
            <p>{profile.personality.energy_type}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-6">
        <h3 className="text-xl font-medium mb-4">Transcript</h3>
        <p className="text-gray-300 whitespace-pre-line">
          {profile.transcript}
        </p>
      </div>
    </motion.div>
  );
};