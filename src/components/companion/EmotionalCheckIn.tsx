import React from 'react';

export const EmotionalCheckIn: React.FC = () => {
    const emotions = [
      { emoji: '😰', label: 'Anxious', value: 'anxious' },
      { emoji: '😊', label: 'Excited', value: 'excited' },
      { emoji: '🤔', label: 'Confused', value: 'confused' },
      { emoji: '😌', label: 'Calm', value: 'calm' },
      { emoji: '🥺', label: 'Vulnerable', value: 'vulnerable' }
    ];
  
    return (
      <div className="bg-white/5 rounded-2xl p-6">
        <h3 className="text-lg font-medium mb-4">How are you feeling?</h3>
        <div className="grid grid-cols-5 gap-3">
          {emotions.map(emotion => (
            <button
              key={emotion.value}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="text-3xl">{emotion.emoji}</span>
              <span className="text-xs">{emotion.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };