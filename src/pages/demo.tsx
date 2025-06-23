import { AgentConversationDemo } from '../components/AgentConversationDemo';
console.log(AgentConversationDemo);
import { sampleProfiles } from '../data/sampleProfiles';
import React, { useState } from 'react';


export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950/20 text-white">
      <div className="py-12">
        <AgentConversationDemo />
      </div>
      
      {/* Profile Voice Samples Section */}
      <div className="max-w-6xl mx-auto px-8 py-12 border-t border-white/10">
        <h2 className="text-3xl font-light text-center mb-8">Voice Profiles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {sampleProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </div>
    </div>
  );
}

const ProfileCard = ({ profile }) => {
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-medium mb-2">{profile.name}</h3>
      <p className="text-sm text-gray-400 mb-4">
        {profile.age} • {profile.location}
      </p>
      
      <div className="space-y-3 mb-4">
        <div>
          <span className="text-xs text-gray-500">Voice Energy:</span>
          <p className="text-sm">{profile.voiceCharacteristics.energy}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Speaking Style:</span>
          <p className="text-sm">{profile.voiceCharacteristics.pace}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Key Values:</span>
          <p className="text-sm">{profile.personality.core_values.slice(0, 3).join(', ')}</p>
        </div>
      </div>
      
      <button
        onClick={() => setShowTranscript(!showTranscript)}
        className="text-sm text-purple-400 hover:text-purple-300"
      >
        {showTranscript ? 'Hide' : 'Show'} Voice Sample
      </button>
      
      {showTranscript && (
        <div className="mt-4 p-4 bg-black/30 rounded-lg">
          <p className="text-sm text-gray-300 leading-relaxed line-clamp-6">
            {profile.transcript}
          </p>
        </div>
      )}
    </div>
  );
};