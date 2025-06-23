import { useState, useEffect } from 'react';
import { UserProfile } from '../types/companion';

export function useUser() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex',
    personality: {
      core_values: ['authenticity', 'growth', 'connection'],
      communication_style: 'thoughtful',
      energy_type: 'ambivert',
      interests: ['hiking', 'philosophy', 'music', 'technology']
    }
  });

  return { userProfile, setUserProfile };
} 