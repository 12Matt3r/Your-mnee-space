# YourSpace Creative Labs

A next-generation creative platform connecting artists, mentors, and learners through interactive virtual spaces and real-time collaboration.

**Live Demo:** [https://7d74cho3vka6.space.minimax.io](https://7d74cho3vka6.space.minimax.io)

## Features

- **Interactive Virtual Rooms**: 2D/3D customizable spaces for "vibe coding" and creative expression.
- **Live Streaming & Collaboration**: Real-time social streaming, screen sharing, and collaborative sessions.
- **Creative Learning Hub**: Interactive modules and mentorship programs.
- **Discovery Engine**: Vibe-based filtering (Chill, Energetic, Dark, Retro) to find content that matches your mood.
- **Economy Layer**: Integrated payments and tipping via MNEE/Stripe.

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Auth, Database, Storage, Edge Functions)
- **Realtime:** Supabase Realtime, WebRTC
- **Deployment:** Matrix Space

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Add your Supabase credentials

# Run development server
npm run dev
```

## Architecture

- **`src/hooks`**: Custom hooks for business logic (e.g., `useStreaming`, `useStreamingSession`).
- **`src/components`**: Reusable UI components.
- **`src/pages`**: Application routes.
- **`src/contexts`**: Global state providers (`AuthContext`, `ThemeContext`).

## Streaming Implementation

The streaming architecture is built on two layers:
1. **`useStreaming`**: The low-level provider managing WebRTC connections, media tracks, and Supabase signaling.
2. **`useStreamingSession`**: A session-level hook that manages the lifecycle of a stream within a specific room, including host/participant roles and UI state.

## License

MIT License - see [LICENSE](LICENSE)
