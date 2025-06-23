# AI Dating App with Voice-Based Matching

This project is a next-generation dating app that uses AI to analyze voice recordings, extract personality profiles, and match users based on compatibility. It features a best friend AI companion that provides emotional support and insights.

## Core Features

### 1. Voice Profile Extraction
- Upload voice recordings (MP3, WAV, M4A)
- AI analysis of voice characteristics (pitch, pace, energy)
- Personality trait extraction from speech patterns
- Transcript generation and content analysis

### 2. AI Agent Conversation Simulation
- Simulates conversations between AI agents representing potential matches
- Analyzes compatibility based on shared values, conversation flow, and emotional resonance
- Generates chemistry scores and compatibility insights
- Provides match recommendations

### 3. Best Friend AI Companion
- Personal AI companion that provides emotional support
- Remembers conversations and personal details
- Offers insights based on your interactions and emotional state
- Adapts to your communication style over time

## Getting Started

### Prerequisites
- Node.js 14.x or higher
- npm or yarn
- OpenAI API key

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Access the different features:
   - Voice Profile: [http://localhost:3000/audio-profile](http://localhost:3000/audio-profile)
   - AI Companion: [http://localhost:3000/companion](http://localhost:3000/companion)
   - Agent Demo: [http://localhost:3000/demo](http://localhost:3000/demo)
   - Home Page: [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── components/         # React components
│   ├── companion/      # Companion-related components
│   ├── matches/        # Matching-related components
│   ├── mixing-chamber/ # Profile mixing components
│   ├── onboarding/     # Onboarding flow components
│   └── shared/         # Shared UI components
├── data/               # Static data and sample profiles
├── hooks/              # Custom React hooks
├── lib/                # Core functionality
│   ├── agents/         # AI agent simulation
│   ├── audio/          # Audio processing and analysis
│   ├── companion/      # Best friend companion logic
│   └── voice/          # Voice analysis and profiling
├── pages/              # Next.js pages and API routes
│   └── api/            # Secure API endpoints
└── types/              # TypeScript type definitions
```

## Security Implementation

This application implements a secure approach for handling API keys:

1. The OpenAI API key is stored as an environment variable on the server
2. API requests are made through secure Next.js API routes:
   - `/api/openai` - General OpenAI API proxy
   - `/api/audio-transcription` - Audio transcription endpoint
   - `/api/content-analysis` - Content analysis endpoint
   - `/api/agent-response` - Agent conversation endpoint
3. The API key is never exposed to the client-side code
4. All OpenAI API calls are proxied through the server

This approach follows security best practices by keeping sensitive credentials on the server side only.

## Key Components

### Voice Capture & Analysis
The app uses the Web Audio API to capture and analyze voice recordings. The `AudioProfileExtractor` component handles the UI for recording, while the backend processes the audio using OpenAI's Whisper for transcription and GPT-4 for analysis.

### Agent Conversation System
The `AgentConversationDemo` component showcases how AI agents can simulate conversations between potential matches. The system analyzes compatibility factors and generates insights based on the conversation flow.

### Best Friend Companion
The `BestFriendChat` component provides an interface for interacting with an AI companion. The companion remembers past conversations, provides emotional support, and offers personalized insights.

## Technologies

- **Frontend**: Next.js, TypeScript, Framer Motion, Tailwind CSS
- **AI**: OpenAI API (GPT-4, Whisper)
- **Audio Processing**: Web Audio API
- **State Management**: React Hooks
- **Styling**: Tailwind CSS with custom animations

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OpenAI for providing the AI capabilities
- Next.js team for the excellent framework
- All contributors who have helped shape this project 