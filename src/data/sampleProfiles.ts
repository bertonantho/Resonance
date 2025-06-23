export const sampleProfiles = [
    {
      id: "profile_1",
      name: "Luna Chen",
      age: 28,
      location: "San Francisco",
      voiceCharacteristics: {
        pitch: "medium-high",
        pace: "moderate with thoughtful pauses",
        energy: "calm but enthusiastic when discussing passions",
        patterns: {
          pauseFrequency: "high", // thinks before speaking
          laughterStyle: "quiet, genuine chuckles",
          fillerWords: ["hmm", "you know", "actually"],
          emotionalRange: 0.7
        }
      },
      transcript: `
        My perfect weekend? Hmm... I'd probably start Saturday at the farmer's market - 
        not because I'm super healthy or anything, but there's something about the energy there, 
        you know? All these people who care about what they're creating. 
        
        Actually, I've been really into pottery lately. There's this studio in the Mission 
        where you can just... lose yourself for hours. It's meditative, but also frustrating 
        when your bowl looks more like abstract art. *soft laugh*
        
        Sundays are for hiking. Not intense ones - I'm talking about those trails where you 
        can actually have a conversation without gasping for air. Last week I discovered this 
        spot where you can see the whole bay, and I just sat there for an hour, reading. 
        
        Oh, and Sunday evenings? That's when my friends and I have our philosophy club. 
        We call it that ironically, but... we actually do end up debating consciousness and 
        free will over wine. Last time we spent three hours on whether AI can truly be creative.
      `,
      personality: {
        core_values: ["authenticity", "creativity", "intellectual curiosity", "mindfulness"],
        interests: ["pottery", "hiking", "philosophy", "farmers markets", "reading"],
        communication_style: "thoughtful and measured, asks deep questions, comfortable with silence",
        emotional_patterns: "even-tempered with bursts of enthusiasm, introspective",
        social_preferences: "small groups, meaningful conversations over small talk",
        humor_style: "dry wit, philosophical observations, self-deprecating",
        energy_type: "ambivert leaning introvert"
      }
    },
    {
      id: "profile_2",
      name: "Marcus Rivera",
      age: 31,
      location: "Brooklyn",
      voiceCharacteristics: {
        pitch: "medium-low",
        pace: "quick with animated bursts",
        energy: "high, contagious enthusiasm",
        patterns: {
          pauseFrequency: "low", // stream of consciousness
          laughterStyle: "frequent, hearty laughs",
          fillerWords: ["like", "right?", "I mean"],
          emotionalRange: 0.9
        }
      },
      transcript: `
        Oh man, perfect weekend - okay, so Friday night I'm definitely hitting up this 
        underground jazz spot in Bed-Stuy. Like, you haven't lived until you've heard 
        live bebop at 2am, right? The musicians there are insane.
        
        Saturday morning though - plot twist - I'm at the climbing gym by 7am. I know, 
        I know, who does that after jazz until 3? But there's something about solving 
        those boulder problems when your brain is still kind of fuzzy. It's like... 
        physical meditation? Plus the community there is incredible.
        
        Then I might spend the afternoon working on my graphic novel. I mean, "working" 
        might be generous - mostly I'm sketching and re-sketching the same panel because 
        I'm a perfectionist. It's about time travelers who can only travel forward one 
        second per second. *laughs* Yeah, it's as weird as it sounds.
        
        Sunday is for the boys - we've got this tradition where we cook elaborate brunches 
        and argue about movies. Last week I made shakshuka while defending why Spider-Verse 
        is literally the best film of the decade. Not just animated - best film, period.
      `,
      personality: {
        core_values: ["adventure", "community", "creative expression", "authenticity"],
        interests: ["jazz music", "rock climbing", "graphic novels", "cooking", "film analysis"],
        communication_style: "enthusiastic and expressive, storyteller, uses humor to connect",
        emotional_patterns: "high energy with deep emotional intelligence, passionate",
        social_preferences: "thrives in groups but values one-on-one connections",
        humor_style: "animated storytelling, pop culture references, inclusive jokes",
        energy_type: "extrovert with creative introvert moments"
      }
    },
    {
      id: "profile_3",
      name: "Zara Okafor",
      age: 29,
      location: "London",
      voiceCharacteristics: {
        pitch: "medium with melodic variations",
        pace: "rhythmic, varies with emotion",
        energy: "warm and grounded with sparks of mischief",
        patterns: {
          pauseFrequency: "medium", // dramatic effect
          laughterStyle: "rich, throwing head back",
          fillerWords: ["honestly", "literally", "wait"],
          emotionalRange: 0.8
        }
      },
      transcript: `
        Perfect weekend? Honestly, it starts with sleeping in until my cat decides otherwise. 
        Her name is Schrodinger - yes, I'm that person. *laughs* 
        
        But wait, Saturdays are actually sacred. I volunteer at this community garden in 
        Brixton where we teach kids about growing food. There's this one kid, Amara, who's 
        convinced she can grow pizza. I'm not crushing that dream, you know?
        
        Afternoons, I'm probably at a protest. Last month it was climate action, before that 
        housing rights. I literally cannot walk past injustice. My friends joke that I have 
        a radar for causes, but... someone has to care, right?
        
        Saturday evenings though? Complete 180 - I'm hosting dinner parties where we cook 
        recipes from whatever cuisine I'm obsessing over. Last week was Ethiopian, and 
        literally everyone was eating with their hands by the end, sharing stories. That's 
        when I feel most alive - good food, deep conversations, people being real.
        
        Sunday mornings I write. I'm working on this collection of short stories about 
        African futurism. Imagine Black Panther meets Octavia Butler meets... my grandmother's 
        stories. It's about technology, but really it's about humanity.
      `,
      personality: {
        core_values: ["social justice", "community", "creativity", "authenticity", "growth"],
        interests: ["writing", "cooking", "activism", "gardening", "afrofuturism", "philosophy"],
        communication_style: "warm and engaging, switches between playful and profound",
        emotional_patterns: "passionate with strong empathy, grounds others",
        social_preferences: "builds community wherever she goes, natural connector",
        humor_style: "clever wordplay, cultural observations, inclusive teasing",
        energy_type: "social ambivert who recharges through creative solitude"
      }
    }
  ];


// Voice feature extraction function
export function extractVoiceFeatures(profile: typeof sampleProfiles[0]) {
    const { voiceCharacteristics, transcript } = profile;
    
    // Analyze speaking patterns
    const sentences = transcript.split(/[.!?]+/);
    const avgSentenceLength = sentences.reduce((acc, s) => acc + s.split(' ').length, 0) / sentences.length;
    
    // Extract emotional indicators
    const emotionalWords = transcript.match(/\*(.*?)\*/g) || [];
    const questionCount = (transcript.match(/\?/g) || []).length;
    
    return {
      speakingRate: voiceCharacteristics.pace,
      pitchPattern: voiceCharacteristics.pitch,
      energyLevel: extractEnergyLevel(voiceCharacteristics.energy),
      pausePatterns: voiceCharacteristics.patterns.pauseFrequency,
      sentenceComplexity: avgSentenceLength > 15 ? 'complex' : 'simple',
      emotionalExpression: emotionalWords.length,
      questioningTendency: questionCount / sentences.length,
      laughterFrequency: voiceCharacteristics.patterns.laughterStyle,
      conversationDynamics: {
        fillerWords: voiceCharacteristics.patterns.fillerWords,
        emotionalRange: voiceCharacteristics.patterns.emotionalRange
      }
    };
  }
  
  function extractEnergyLevel(energyDescription: string): number {
    const highEnergyWords = ['high', 'enthusiastic', 'animated', 'contagious'];
    const lowEnergyWords = ['calm', 'quiet', 'measured', 'grounded'];
    
    let score = 0.5; // neutral
    highEnergyWords.forEach(word => {
      if (energyDescription.toLowerCase().includes(word)) score += 0.1;
    });
    lowEnergyWords.forEach(word => {
      if (energyDescription.toLowerCase().includes(word)) score -= 0.1;
    });
    
    return Math.max(0, Math.min(1, score));
  }