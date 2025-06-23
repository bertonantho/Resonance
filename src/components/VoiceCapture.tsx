import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdaptiveQuestionEngine } from '@/lib/voice/AdaptiveQuestionEngine';
import { CaptureQuestion, VoiceResponse, VoiceSession } from '@/types/voiceCapture';

// Helper components
const RecordingVisualizer: React.FC<{ isRecording: boolean }> = ({ isRecording }) => {
  return (
    <div className="w-64 h-16 bg-black/20 rounded-lg overflow-hidden">
      {isRecording && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex items-end space-x-1">
            {Array.from({ length: 20 }).map((_, i) => {
              const height = Math.random() * 100;
              return (
                <motion.div
                  key={i}
                  className="w-1 bg-gradient-to-t from-purple-600 to-pink-500"
                  animate={{ height: `${height}%` }}
                  transition={{
                    duration: 0.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.05
                  }}
                  style={{ height: '10%' }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const Spinner: React.FC = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
);

// Format time in mm:ss
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const VoiceCaptureSession: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<CaptureQuestion | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Create a session context
  const sessionContext = useRef<VoiceSession>({
    id: `session_${Date.now()}`,
    userId: 'user123', // This would come from auth in a real app
    questions: [],
    responses: [],
    extractedProfile: {},
    sessionMetrics: {
      startTime: new Date(),
      questionsAsked: 0,
      averageResponseTime: 0,
      adaptationCount: 0
    }
  });
  
  const questionEngine = useRef(new AdaptiveQuestionEngine(sessionContext.current));
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load first question
    loadNextQuestion();
    
    // Cleanup
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, []);

  const loadNextQuestion = async (lastResponse?: VoiceResponse) => {
    setIsProcessing(true);
    
    const nextQuestion = await questionEngine.current.getNextQuestion(lastResponse);
    
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      // Add to session questions
      sessionContext.current.questions.push({
        questionId: nextQuestion.id,
        orderAsked: sessionContext.current.questions.length + 1,
        timeAsked: new Date()
      });
      // Speak question with AI voice
      await speakQuestion(nextQuestion.audioPrompt || nextQuestion.question);
    } else {
      // Session complete
      completeSession();
    }
    
    setIsProcessing(false);
  };

  const speakQuestion = async (text: string) => {
    // Use Web Speech API or AI voice service
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    
    const chunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
    
    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(chunks, { type: 'audio/webm' });
      await processResponse(audioBlob);
    };
    
    mediaRecorder.current.start();
    setIsRecording(true);
    startTimer();
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      stopTimer();
    }
  };

  const startTimer = () => {
    setRecordingTime(0);
    timerInterval.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  const processResponse = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    // Process audio and extract features
    const response = await processAudioResponse(audioBlob, currentQuestion);
    
    // Update session progress
    setSessionProgress(prev => prev + (100 / 8)); // Assuming ~8 questions total
    
    // Get next question based on this response
    await loadNextQuestion(response);
  };

  const processAudioResponse = async (audioBlob: Blob, question: CaptureQuestion): Promise<VoiceResponse> => {
    // In a real implementation, this would:
    // 1. Send audio to a speech-to-text service
    // 2. Extract audio features using audio analysis
    // 3. Store the audio file
    
    // For now, we'll simulate these steps
    const transcript = await simulateTranscription(audioBlob);
    
    const response: VoiceResponse = {
      id: `response_${Date.now()}`,
      questionId: question.id,
      transcript,
      audioUrl: URL.createObjectURL(audioBlob),
      duration: recordingTime,
      audioFeatures: {
        pauses: simulatePauses(recordingTime),
        duration: recordingTime,
        volume: simulateVolumeData(recordingTime),
        pitch: simulatePitchData(recordingTime),
        speechRate: 1.0 + (Math.random() * 0.4 - 0.2), // 0.8-1.2
        fillerWords: detectFillerWords(transcript)
      }
    };
    
    // Add to session responses
    sessionContext.current.responses.push(response);
    
    return response;
  };

  const simulateTranscription = async (audioBlob: Blob): Promise<string> => {
    // Simulate a delay for transcription
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a simulated transcript based on the current question
    const simulatedResponses = {
      'weekend-explorer': "I love spending my weekends outdoors when the weather is nice. Usually Friday night I'll have dinner with friends, then Saturday I like to go hiking or to the beach. Sunday is more relaxed, maybe reading or catching up on shows.",
      'joy-sources': "It's kind of silly, but I really love the smell of coffee in the morning. Even if I'm having a rough day, that first smell of coffee brewing just makes me happy.",
      'connection-moment': "There was this time when I was going through a tough breakup and my friend just sat with me. They didn't try to fix anything, just listened. That meant everything.",
      'growth-edge': "I'm working on being more patient, especially in stressful situations. I tend to get anxious when things don't go as planned.",
      'curiosity-rabbit-hole': "Recently I went down a rabbit hole learning about urban planning. It started with a YouTube video about walkable cities and then I spent hours reading about how different cities are designed."
    };
    
    return simulatedResponses[currentQuestion?.id] || 
      "That's an interesting question. I need some time to think about that.";
  };

  const simulatePauses = (duration: number): { startTime: number, duration: number }[] => {
    const pauseCount = Math.floor(duration / 10) + Math.floor(Math.random() * 3);
    const pauses = [];
    
    for (let i = 0; i < pauseCount; i++) {
      pauses.push({
        startTime: Math.random() * duration,
        duration: 0.5 + Math.random() * 1.5 // 0.5-2s pauses
      });
    }
    
    return pauses;
  };

  const simulateVolumeData = (duration: number): number[] => {
    const samples = Math.floor(duration * 5); // 5 samples per second
    return Array.from({ length: samples }, () => 0.3 + Math.random() * 0.7); // 0.3-1.0
  };

  const simulatePitchData = (duration: number): number[] => {
    const samples = Math.floor(duration * 5); // 5 samples per second
    return Array.from({ length: samples }, () => 0.4 + Math.random() * 0.6); // 0.4-1.0
  };

  const detectFillerWords = (transcript: string): string[] => {
    const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically'];
    return fillerWords.filter(word => transcript.toLowerCase().includes(word));
  };

  const completeSession = () => {
    // Update session metrics
    sessionContext.current.sessionMetrics.endTime = new Date();
    sessionContext.current.sessionMetrics.totalDuration = 
      (sessionContext.current.sessionMetrics.endTime.getTime() - 
       sessionContext.current.sessionMetrics.startTime.getTime()) / 1000;
    
    // In a real app, this would:
    // 1. Save the session data
    // 2. Generate a user profile
    // 3. Navigate to results page
    
    console.log('Session completed', sessionContext.current);
    
    // For demo, reset to beginning
    setTimeout(() => {
      setSessionProgress(0);
      sessionContext.current = {
        id: `session_${Date.now()}`,
        userId: 'user123',
        questions: [],
        responses: [],
        extractedProfile: {},
        sessionMetrics: {
          startTime: new Date(),
          questionsAsked: 0,
          averageResponseTime: 0,
          adaptationCount: 0
        }
      };
      questionEngine.current = new AdaptiveQuestionEngine(sessionContext.current);
      loadNextQuestion();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950/20 to-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Getting to know you...</span>
            <span>{Math.round(sessionProgress)}% complete</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
              animate={{ width: `${sessionProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Display */}
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-light leading-relaxed">
                {currentQuestion.question}
              </h2>
              {currentQuestion.type === 'follow-up' && (
                <p className="text-purple-400 mt-4">
                  I'd love to hear more about that...
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recording Interface */}
        <div className="flex flex-col items-center">
          <RecordingVisualizer isRecording={isRecording} />
          
          {!isProcessing && (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`mt-8 px-8 py-4 rounded-full font-medium text-lg transition-all ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90'
              }`}
            >
              {isRecording ? 'Stop Recording' : 'Start Talking'}
            </button>
          )}
          
          {isRecording && (
            <div className="mt-4 text-center">
              <p className="text-2xl font-light">{formatTime(recordingTime)}</p>
              <p className="text-sm text-gray-400 mt-2">
                Take your time... {getTimeHint(currentQuestion, recordingTime)}
              </p>
            </div>
          )}
          
          {isProcessing && (
            <div className="mt-8 text-center">
              <div className="flex justify-center mb-4">
                <Spinner />
              </div>
              <p className="text-gray-400">Understanding your response...</p>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>💡 Tip: The more authentic you are, the better matches we can find</p>
        </div>
      </div>
    </div>
  );
};

function getTimeHint(question: CaptureQuestion, currentTime: number): string {
  if (!question) return "";
  if (currentTime < question.minResponseTime) {
    return `Aim for at least ${question.minResponseTime} seconds`;
  }
  if (currentTime > question.maxResponseTime) {
    return "Feel free to wrap up when ready";
  }
  return "You're doing great";
}
