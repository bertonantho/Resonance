import React from 'react';
import { motion } from 'framer-motion';
import { AgentInsight } from '../../types/companion';

export const InsightCard: React.FC<{ insight: AgentInsight }> = ({ insight }) => {
    const icons = {
      shared_interest: '🔗',
      complementary_dynamic: '⚡',
      depth_potential: '🌊'
    };
  
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-4"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">{icons[insight.type]}</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-purple-300 mb-1">
              {insight.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </p>
            <p className="text-sm text-gray-300">{insight.content}</p>
            {insight.suggestion && (
              <p className="text-xs text-purple-400 mt-2">
                💡 {insight.suggestion}
              </p>
            )}
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            insight.relevance === 'high' ? 'bg-purple-600/30 text-purple-300' :
            insight.relevance === 'medium' ? 'bg-blue-600/30 text-blue-300' :
            'bg-gray-600/30 text-gray-300'
          }`}>
            {insight.relevance}
          </span>
        </div>
      </motion.div>
    );
  };