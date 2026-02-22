# YourSpace Technical Audit & Architectural Analysis

**Date:** January 2026
**Auditor:** Jules (Senior Technical Architect)
**Status:** Comprehensive Review Complete

---

## 1. Executive Summary

YourSpace Creative Labs is a high-resolution creator platform that integrates immersive 3D environments, an autonomous agent-driven economy, and professional creative tools. The system is built on a modern full-stack architecture using React, Three.js, Supabase, and a custom multi-provider AI orchestration layer.

The project differentiates itself through "Supervisor AI," which manages a decentralized marketplace where agents and humans transact using the MNEE stablecoin.

---

## 2. Architectural Mapping

### 2.1 Directory Structure (Global)

| Directory | Purpose | Technical Stack |
|-----------|---------|-----------------|
| `src/` | Frontend Application | React, Vite, TS, Tailwind |
| `supabase/` | Backend Infrastructure | Deno (Edge Functions), Postgres |
| `api/` | Serverless API Layer | Vercel Serverless (Node.js) |
| `public/` | Static Assets & Mock Data | GLTF, JSON, WebP |
| `.jules/` | Engineering Knowledge Base | Markdown (Learnings/Optimizations) |

### 2.2 Granular Breakdown: `/src`

- **`/components/room` (Immersive Engine)**:
    - `ArtistRoom3D.tsx`: The primary scene container.
    - `RoomStructure.tsx`: Handles wall/floor geometry.
    - `Arcade.tsx`: Interactive mini-games within the 3D space.
    - `Computer3DAsset.tsx`: Interactive workstation acting as a bridge to MiniMax OS.
- **`/lib` (Service Layer)**:
    - `ai-services.ts`: Provider-agnostic AI management (Pollinations, OpenAI, Anthropic).
    - `agent-engine.ts`: Core logic for agent behavior and task execution.
    - `mnee.ts`: Financial rails using the MNEE SDK.
    - `supabase.ts`: Type-safe interface to the Supabase BaaS.
- **`/hooks` (Business Logic)**:
    - `useVirtualRooms.tsx`: Manages CRUD and real-time state for 3D spaces.
    - `useAgentJobs.ts`: Orchestrates the autonomous job lifecycle.
- **`/pages` (Feature Domains)**:
    - `/studio`: Creator dashboard including the Supervisor AI management hub.
    - `/rooms`: Discovery and interaction views for virtual spaces.
    - `/wallet`: Financial management for MNEE assets.

### 2.3 Granular Breakdown: `/supabase`

- **`/functions`**:
    - `discord-live`: WebRTC/OAuth bridge for streaming.
    - `computer-interface-sync`: Bi-directional data sync for embedded workstations.
    - `virtual-room-management`: Secure API for room metadata operations.
- **`/migrations`**: SQL definitions for schema, RLS policies, and triggers.

---

## 3. Feature Taxonomy

### 3.1 Core Logic & AI
- **Supervisor AI**: Orchestrates specialized agents, validates outputs, and manages escalations.
- **Agent Economy**: Autonomous agents with independent wallets capable of hiring other entities.
- **Priority Queueing**: AI task management with tiered priority (Urgent/High/Normal/Low).

### 3.2 UI/UX & Immersive
- **3D Workspace**: Interactive rooms with spatial audio and real-time presence.
- **MiniMax OS Integration**: Full-screen embedded OS within 3D rooms for complex creative workflows.
- **Swipe Discovery**: High-engagement artist discovery mechanism.

### 3.3 Backend & Infrastructure
- **Unified AI API**: Single interface for Text, Image, Voice, and Vision tasks across multiple LLM providers.
- **Real-time Synchronization**: Supabase Realtime for chat, presence, and collaborative state.
- **Edge-Computing**: Offloading heavy/sensitive logic to low-latency Deno functions.

### 3.4 Economic Infrastructure
- **MNEE Native Payments**: Sub-penny transaction costs and instant settlement.
- **Automated Revenue Splits**: Intelligent handling of collaborative project payouts.
- **Favoritism Tiers**: Loyalty-based economic model for user engagement.

---

## 4. Deep-Dive: Significant Repo Modules

### 4.1 AI Orchestration Layer (`src/lib/ai-services.ts`)
The system implements a **Provider-Agnostic AI Manager**.
- **Primary Tier**: Pollinations.ai (Free, no-auth) for high-volume, low-criticality tasks.
- **Premium Tier**: OpenAI (GPT-4), Anthropic (Claude), and MiniMax for complex reasoning and high-fidelity generation.
- **Logic**: Implements an `AIServiceManager` singleton that handles fallbacks, cost estimation, and task queueing.

### 4.2 3D Interaction Engine (`src/components/room`)
Built on **React Three Fiber (R3F)**, this module bridges declarative React state with imperative 3D rendering.
- **Interaction Logic**: Uses custom raycasting to detect clicks on 3D assets (like the Computer workstation).
- **Modality**: Seamlessly transitions between 3D navigation and 2D UI overlays (Modals) without breaking the WebGL context.

### 4.3 MNEE Economic Engine (`src/lib/mnee.ts`)
This module encapsulates the platform's financial philosophy.
- **SDK Integration**: Direct usage of `@mnee/ts-sdk` for production-grade stablecoin operations.
- **Pricing Logic**: Centralized definition of `AI_CREDIT_PRICING` and `ECONOMY_LAYERS`, ensuring consistency across the marketplace.

---

## 5. Data Flow Analysis

1. **Task Initialization**: User/Agent creates a job → `useAgentJobs` hook → Supabase `agent_jobs` table.
2. **AI Execution**: Edge Function/Vercel API detects new job → Calls `ai-services.ts` → Selects best provider → Executes.
3. **Outcome Persistence**: Result returned → Job status updated in DB → Real-time broadcast to UI → MNEE transaction triggered upon validation.

---

## 6. Security & Stability

- **Data Privacy**: Strict Row-Level Security (RLS) policies prevent cross-tenant data leakage.
- **AI Safety**: Supervisor AI acts as a validation gate for all agent-generated content.
- **Financial Integrity**: All economic actions are backed by immutable database records and MNEE blockchain transactions.
