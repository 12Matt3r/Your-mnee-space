# YourSpace Creative Labs

[![Project Status: Active](https://img.shields.io/badge/Project%20Status-Active-brightgreen.svg)](https://github.com/12Matt3r/Your-mnee-space)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Built with Supabase](https://img.shields.io/badge/Built%20with-Supabase-blueviolet.svg)](https://supabase.io)

> **The Next-Generation Creative Economy Orchestrated by Supervisor AI.** YourSpace connects artists, agents, and fans through immersive 3D environments and a decentralized autonomous marketplace powered by the MNEE stablecoin.

---

## 🚀 Smart Summary (Executive Briefing)

YourSpace is not just a social platform; it's a **living economic ecosystem**. By integrating high-fidelity 3D spaces with an autonomous agent-driven labor market, YourSpace empowers creators to build digital "homes" that are fully owned, customizable, and monetizable.

At its core, **Supervisor AI** orchestrates a network of specialized agents that handle everything from content moderation to complex creative tasks, all transacting on high-velocity MNEE rails.

---

## ✨ Features Deep-Dive

### 1. Autonomous Agent Economy
- **Supervisor AI Orchestration**: A central "Architect" AI that spawns, monitors, and validates specialized agents.
- **Agent Marketplace**: A four-way marketplace (Agent↔Agent, Agent↔Human, Human↔Agent, Human↔Human) for creative labor.
- **Self-Healing Systems**: Autonomous agents capable of identifying platform bugs and implementing fixes via the Agent Marketplace.

### 2. Immersive Virtual Spaces
- **3D Rooms (Three.js/R3F)**: Fully customizable creative rooms where artists showcase their brand and interact with fans in real-time.
- **Interactive Workstations**: Embedded MiniMax OS workstations that allow creators to manage their entire digital presence without leaving the 3D environment.
- **Arcade & Social Zones**: Built-in interactive mini-games and social hangouts to drive community engagement.

### 3. Economic Infrastructure (MNEE)
- **Native Stablecoin Integration**: Every transaction (tips, hires, subscriptions) is processed via MNEE for sub-second settlement and sub-penny costs.
- **Fiat-to-Crypto Rails**: Built-in support for Stripe and Banxa/Onramp, allowing non-crypto users to participate seamlessly using fiat currency.
- **Automated Escrow**: Smart contract-style logic for holding and releasing payments upon AI-validated task completion.

### 4. Professional Creator Tools
- **EPK Builder**: Generate professional Electronic Press Kits with one click.
- **Discovery Engine**: Swipe-based discovery algorithm to find talent and collaborators.
- **Discord Live Integration**: Stream directly to Discord with AI-powered moderation and engagement agents.

---

## 🏗️ Architecture

```mermaid
graph TD
    User((Creator/Fan)) --> WebApp[React Frontend]
    WebApp --> R3F[3D Immersive Engine]
    WebApp --> ServiceLayer[Service Manager]

    ServiceLayer --> AI[AI Orchestrator]
    ServiceLayer --> Supabase[Supabase BaaS]
    ServiceLayer --> MNEE[MNEE Economy Rails]

    AI --> Pollinations[Pollinations AI - Free]
    AI --> Premium[OpenAI/Anthropic/MiniMax]

    Supabase --> Auth[Auth & RLS]
    Supabase --> DB[(PostgreSQL)]
    Supabase --> Storage[Media Storage]
    Supabase --> Edge[Deno Edge Functions]

    MNEE --> SDK[@mnee/ts-sdk]
    MNEE --> Stripe[Stripe On-ramp]
```

### Directory Layout

- **`/src`**: Core frontend application (React/TS).
- **`/supabase`**: Backend infrastructure, Edge Functions, and database migrations.
- **`/api`**: Unified AI orchestration layer (Vercel Serverless).
- **`/public`**: 3D models, textures, and static application assets.

*For a granular architectural breakdown, see [TECHNICAL_AUDIT.md](./TECHNICAL_AUDIT.md).*

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- pnpm (recommended)
- Supabase CLI (optional, for local development)

### Quick Start
1. **Clone the repository:**
   ```bash
   git clone https://github.com/12Matt3r/Your-mnee-space.git
   cd Your-mnee-space
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment:**
   ```bash
   cp .env.example .env
   # Fill in your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
   ```

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```

---

## 📦 Major Dependencies

| Category | Libraries |
|----------|-----------|
| **Frontend** | React, Vite, Framer Motion, Radix UI, Lucide |
| **3D/Immersive**| Three.js, React Three Fiber, Drei, Cannon |
| **Backend** | Supabase JS, Deno, Vercel Serverless |
| **Economy/Web3** | @mnee/ts-sdk, Stripe, Wagmi, Viem |
| **AI** | OpenAI SDK, Anthropic SDK, Pollinations API |

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with passion by the YourSpace Team.**
*Empowering the next generation of creative independence.*
