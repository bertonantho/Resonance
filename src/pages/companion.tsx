import { BestFriendChat } from '../components/BestFriendChat';
import { useUser, useMatch } from '../hooks';

export default function CompanionPage() {
  const { userProfile } = useUser();
  const { currentMatch, agentConversation } = useMatch();

  return (
    <div className="h-screen flex flex-col">
      {/* Header with match context */}
      {currentMatch && (
        <div className="bg-purple-900/20 border-b border-purple-500/20 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">
                Chatting about: {currentMatch.profile.name}
              </h3>
              <p className="text-sm text-gray-400">
                {currentMatch.compatibilityAnalysis.score}% compatibility
              </p>
            </div>
            <button className="text-sm text-purple-400 hover:text-purple-300">
              View Full Analysis →
            </button>
          </div>
        </div>
      )}
      
      {/* Chat Interface */}
      <div className="flex-1">
        <BestFriendChat
          userProfile={userProfile}
          currentMatch={currentMatch}
          agentConversation={agentConversation}
        />
      </div>
    </div>
  );
}