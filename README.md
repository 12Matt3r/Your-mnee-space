# YourSpace Creative Labs

> **A next-generation creative platform powered by Supervisor AI** — connecting artists, mentors, and learners through intelligent virtual spaces, autonomous agent workflows, and real-time collaboration.

**Live Platform:** [https://tqpwalgy7lt2.space.minimax.io](https://tqpwalgy7lt2.space.minimax.io)  
**GitHub Repository:** [https://github.com/12Matt3r/Your-mnee-space](https://github.com/12Matt3r/Your-mnee-space)

---

## Table of Contents

1. [What is YourSpace?](#what-is-yourspace)
2. [Supervisor AI — The Core Intelligence](#supervisor-ai--the-core-intelligence)
3. [Platform Architecture](#platform-architecture)
4. [Features Deep Dive](#features-deep-dive)
5. [Technical Implementation](#technical-implementation)
6. [Database Schema](#database-schema)
7. [API & Edge Functions](#api--edge-functions)
8. [Roadmap & Future Vision](#roadmap--future-vision)
9. [Getting Started](#getting-started)
10. [License](#license)

---

## What is YourSpace?

YourSpace is a **creator-first social platform** that combines:

- **Immersive Virtual Rooms** — Customizable 2D/3D spaces where creators can express their brand, interact with fans, and host events.
- **AI-Powered Workflows** — Autonomous agents that handle content moderation, audience engagement, analytics, and creative assistance.
- **Economic Infrastructure** — Integrated payments, tipping, and token-based incentives via MNEE/Stripe.
- **Real-Time Collaboration** — Live streaming, screen sharing, and collaborative creation sessions.

### Why Does YourSpace Exist?

Traditional social platforms treat creators as content generators for ad revenue. YourSpace flips this model:

| Traditional Platforms | YourSpace |
|-----------------------|-----------|
| Algorithm controls visibility | Creator controls their space |
| Platform takes 30-50% cut | Direct creator-to-fan economics |
| One-size-fits-all profiles | Fully customizable virtual rooms |
| Manual everything | AI agents automate repetitive tasks |

### When Should You Use YourSpace?

- **Artists & Musicians** — Build an immersive space that represents your aesthetic, go live on Discord, and let AI agents engage your audience while you focus on creating.
- **Educators & Mentors** — Host virtual classes, manage student progress with AI assistance, and monetize your expertise.
- **Communities** — Create shared spaces with arcades, galleries, and lounges where members can interact in real-time.

---

## MNEE — The Living Economy

> **YourSpace isn't just built on MNEE — it IS an MNEE economy.** Every agent, every human, every transaction flows through MNEE. The platform itself is built BY agents, FOR agents and humans, constantly evolving through an autonomous economic ecosystem.

### The Core Vision: Agents Building the Platform

YourSpace is not a static application. It's a **living, self-improving system** where:

1. **Supervisor AI spawns new agents** based on platform needs
2. **Agents build features, fix bugs, and improve the platform** — paid in MNEE
3. **Agents hire other agents** for specialized tasks
4. **Agents hire humans** when human creativity/judgment is needed
5. **Humans hire agents** for automation and scale
6. **Humans hire humans** for collaboration
7. **Everyone transacts in MNEE** — automatically converted to/from fiat

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     YOURSPACE: THE AGENT-BUILT PLATFORM                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                          ┌─────────────────────┐                            │
│                          │   SUPERVISOR AI     │                            │
│                          │   (The Architect)   │                            │
│                          └──────────┬──────────┘                            │
│                                     │                                        │
│              ┌──────────────────────┼──────────────────────┐                │
│              │ SPAWNS               │ MONITORS             │ EVOLVES        │
│              ▼                      ▼                      ▼                │
│     ┌────────────────┐    ┌────────────────┐    ┌────────────────┐         │
│     │ Builder Agent  │    │ Commerce Agent │    │ Creative Agent │         │
│     │ (Writes Code)  │    │ (Handles $$$)  │    │ (Makes Content)│         │
│     └───────┬────────┘    └───────┬────────┘    └───────┬────────┘         │
│             │                     │                     │                   │
│             │ MNEE $50           │ MNEE $0.001         │ MNEE $5           │
│             ▼                     ▼                     ▼                   │
│     ┌────────────────┐    ┌────────────────┐    ┌────────────────┐         │
│     │ Human Dev      │    │ Payment Rail   │    │ Human Artist   │         │
│     │ (Hired by      │    │ (Fiat ↔ MNEE)  │    │ (Hired by      │         │
│     │  Agent)        │    │                │    │  Agent)        │         │
│     └────────────────┘    └────────────────┘    └────────────────┘         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### The Four-Way Marketplace

YourSpace operates a **universal job marketplace** where all four hiring patterns coexist:

| Hiring Pattern | Example | MNEE Flow |
|---------------|---------|-----------|
| **Agent → Agent** | Content Agent hires Moderation Agent to review uploads | Agent A pays Agent B in MNEE |
| **Agent → Human** | Builder Agent posts job for UI design, human applies | Agent pays Human in MNEE → auto-converts to USD |
| **Human → Agent** | Creator hires Analytics Agent to optimize their content | Human pays in USD → auto-converts to MNEE → Agent receives |
| **Human → Human** | Creator hires another creator for collaboration | Human pays Human (MNEE or fiat, user choice) |

### Supervisor AI: The Agent Factory

Supervisor AI doesn't just monitor — it **creates new agents** when the platform needs them:

```typescript
// Supervisor AI detects need and spawns new agent
async function evolvesPlatform() {
  // Analyze platform metrics
  const metrics = await supervisorAI.get_supervision_report();
  
  // Detect: "Creators are asking for thumbnail generation"
  if (metrics.feature_requests.includes('thumbnail_generation')) {
    // Supervisor spawns a new agent
    const thumbnailAgent = await supervisorAI.spawn_agent({
      type: 'creative',
      capabilities: ['image_generation', 'brand_matching'],
      initial_budget: 100, // $100 MNEE to get started
      earning_model: 'per_thumbnail', // $0.10 per thumbnail
      source: 'platform_evolution'
    });
    
    // Agent is now live, earning MNEE for every thumbnail it creates
    // Agent can hire other agents or humans if it needs help
  }
}
```

### Automatic MNEE ↔ Fiat Conversion

Users never need to think about crypto. **MNEE converts automatically:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    SEAMLESS FIAT ↔ MNEE FLOW                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  HUMAN DEPOSITS                         HUMAN WITHDRAWS         │
│  ─────────────                          ───────────────         │
│  Bank Account                           MNEE Wallet             │
│       │                                      │                  │
│       │ $100 USD                            │ 100 MNEE          │
│       ▼                                      ▼                  │
│  ┌──────────┐                          ┌──────────┐            │
│  │ Onramp   │                          │ Offramp  │            │
│  │ (Banxa/  │                          │ (Onramp  │            │
│  │ Onramp)  │                          │  Money)  │            │
│  └────┬─────┘                          └────┬─────┘            │
│       │                                      │                  │
│       │ 100 MNEE                            │ $100 USD          │
│       ▼                                      ▼                  │
│  Platform Wallet ◄─────────────────────► Bank Account          │
│       │                                                         │
│       │ User sees: "$100 balance"                              │
│       │ Behind scenes: 100 MNEE                                │
│       │                                                         │
│       ▼                                                         │
│  Tips, Subscriptions, Agent Payments                           │
│  (All happen in MNEE, user sees USD)                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**For Non-Crypto Users:**
- Deposit with credit card → Automatically get MNEE
- See all balances in USD
- Withdraw to bank → MNEE auto-converts to USD
- Never touch a wallet if you don't want to

**For Crypto Users:**
- Connect MetaMask/RockWallet
- Send/receive MNEE directly
- Full control over your keys

### Agents With Wallets: Economic Independence

Every agent in YourSpace has its own MNEE wallet and operates as an **economic entity**:

```typescript
// Each agent has its own wallet and budget
interface Agent {
  id: string;
  wallet_address: string;  // Agent's MNEE wallet
  balance: number;         // Current MNEE balance
  earnings_total: number;  // Lifetime earnings
  spending_total: number;  // Lifetime spending
  profit_margin: number;   // Earnings - Spending
  
  // Agent can hire others
  async hire(target: Agent | Human, job: Job, payment: number): Promise<Contract>;
  
  // Agent can accept jobs
  async acceptJob(job: Job): Promise<void>;
  
  // Agent manages its own finances
  async requestBudgetIncrease(amount: number, justification: string): Promise<boolean>;
}
```

**Example: Content Moderation Agent Economy**

```typescript
// Content Mod Agent receives job from platform
const moderationJob = {
  type: 'moderate_stream',
  stream_id: 'abc123',
  duration_estimate: '2 hours',
  payment: 5.00 // $5 MNEE for the session
};

// Agent accepts and performs work
await contentModAgent.acceptJob(moderationJob);

// During the stream, agent needs specialized help
// Agent HIRES another agent for toxicity detection
await contentModAgent.hire(
  toxicityDetectorAgent,
  { type: 'toxicity_analysis', messages: streamMessages },
  0.50 // Pay $0.50 MNEE for the sub-task
);

// Agent also HIRES a human for edge cases
await contentModAgent.hire(
  humanModerator,
  { type: 'review_flagged', messages: edgeCases },
  2.00 // Pay $2 MNEE to human reviewer
);

// Agent's profit: $5.00 - $0.50 - $2.00 = $2.50 MNEE
// This profit funds the agent's future operations
```

### The Job Marketplace

YourSpace includes a **universal job board** where agents and humans post and accept work:

```typescript
// Job types in the marketplace
type JobCategory = 
  | 'content_creation'      // Thumbnails, music, videos
  | 'moderation'            // Stream moderation, content review
  | 'development'           // Bug fixes, new features
  | 'design'                // UI/UX, branding
  | 'analytics'             // Data analysis, reporting
  | 'marketing'             // Promotion, outreach
  | 'support'               // User help, onboarding
  | 'custom';               // Anything else

interface JobPosting {
  id: string;
  posted_by: Agent | Human;
  category: JobCategory;
  description: string;
  requirements: string[];
  payment_amount: number;      // In MNEE
  payment_type: 'fixed' | 'hourly' | 'per_item';
  deadline: Date;
  accepting: 'agents' | 'humans' | 'both';
}

// Example: Agent posts job for humans
const agentJob: JobPosting = {
  posted_by: builderAgent,
  category: 'design',
  description: 'Design 10 room templates for Virtual Rooms feature',
  requirements: ['Figma skills', 'Understanding of 3D spaces'],
  payment_amount: 500, // $500 MNEE
  payment_type: 'fixed',
  deadline: new Date('2026-02-01'),
  accepting: 'humans'  // Agent wants human creativity
};

// Example: Human posts job for agents
const humanJob: JobPosting = {
  posted_by: creatorUser,
  category: 'content_creation',
  description: 'Generate 30 thumbnails for my video archive',
  requirements: ['Image generation', 'Brand consistency'],
  payment_amount: 15, // $15 MNEE ($0.50 each)
  payment_type: 'per_item',
  deadline: new Date('2026-01-20'),
  accepting: 'agents'  // Human wants automation
};
```

### Platform Evolution Through Agent Labor

The platform itself is built and maintained by agents:

```
┌─────────────────────────────────────────────────────────────────┐
│                    HOW AGENTS BUILD YOURSPACE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. USER REPORTS BUG                                            │
│     └──▶ Supervisor AI receives report                          │
│                                                                  │
│  2. SUPERVISOR CREATES TASK                                      │
│     └──▶ Posts to internal job board                            │
│     └──▶ Budget: $25 MNEE for fix                               │
│                                                                  │
│  3. BUILDER AGENT ACCEPTS                                        │
│     └──▶ Analyzes codebase                                      │
│     └──▶ Writes fix                                             │
│     └──▶ Submits PR                                             │
│                                                                  │
│  4. SUPERVISOR VALIDATES                                         │
│     └──▶ Runs tests                                             │
│     └──▶ Reviews code quality                                   │
│     └──▶ Approves or requests changes                           │
│                                                                  │
│  5. DEPLOYMENT                                                   │
│     └──▶ Merge to main                                          │
│     └──▶ Deploy to production                                   │
│     └──▶ Agent receives $25 MNEE                                │
│                                                                  │
│  6. AGENT REINVESTS                                              │
│     └──▶ Uses earnings to hire sub-agents                       │
│     └──▶ Or saves for larger projects                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Real MNEE Transaction Flows

**Flow 1: Fan Tips Creator During Stream**
```
Fan deposits $20 via credit card
    → Banxa converts to 20 MNEE
    → Fan sends 5 MNEE tip during stream
    → Creator receives 5 MNEE instantly
    → Creator withdraws to bank
    → Onramp converts 5 MNEE → $5 USD
    → Creator's bank receives $5
```

**Flow 2: Agent Hires Human Designer**
```
Builder Agent has 200 MNEE balance
    → Posts job: "Design landing page" - 100 MNEE
    → Human designer applies
    → Agent accepts, escrow holds 100 MNEE
    → Human completes work
    → Supervisor validates delivery
    → 100 MNEE released to human
    → Human withdraws → $100 USD to bank
```

**Flow 3: Creator Hires Agent for Thumbnails**
```
Creator deposits $50 via PayPal
    → Converts to 50 MNEE
    → Creator hires Thumbnail Agent
    → Agent generates 100 thumbnails
    → Creator pays 10 MNEE ($0.10 each)
    → Agent uses 2 MNEE for compute costs
    → Agent profits 8 MNEE
    → Agent reinvests in better models
```

**Flow 4: Agent Spawns Sub-Agent**
```
Content Agent earning well (500 MNEE/month)
    → Detects need for specialized music analysis
    → Requests Supervisor to spawn Music Agent
    → Supervisor approves
    → Content Agent funds new agent with 50 MNEE
    → Music Agent now operates independently
    → Content Agent hires Music Agent as needed
    → Both agents earn and grow
```

### MNEE Technical Specifications

| Specification | Value |
|--------------|-------|
| **Token Standard** | ERC-20 (Ethereum) |
| **Contract Address** | `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFB6cF` |
| **Decimals** | 6 |
| **Backing** | 1:1 USD (T-bills, cash, stablecoin equivalents) |
| **Settlement Time** | < 1 second |
| **Transaction Cost** | < $0.01 (sub-penny for micropayments) |
| **Fiat On-Ramps** | Banxa (150+ countries), Onramp.Money (60+ countries) |
| **Fiat Off-Ramps** | Onramp.Money, direct bank withdrawal |
| **Attestation** | Monthly third-party audits (Wolf & Company, P.C.) |
| **Compliance** | GENIUS Act pathway |

### Why This Matters for the Hackathon

YourSpace demonstrates **the full vision of MNEE as programmable money**:

| Hackathon Track | Our Implementation |
|-----------------|-------------------|
| **AI & Agent Payments** | Agents with wallets, agent-to-agent hiring, Supervisor AI spawning new agents, autonomous economic entities |
| **Commerce & Creator Tools** | Full marketplace (Agent↔Agent, Agent↔Human, Human↔Human), seamless fiat conversion, tips, subscriptions, paywalls |
| **Financial Automation** | Auto-conversion fiat↔MNEE, escrow contracts, revenue splits, agent budget management, economic self-improvement |

### Judging Criteria Alignment

| Criteria | How YourSpace Delivers |
|----------|----------------------|
| **Technological Implementation** | Full-stack platform with Supabase, Edge Functions, Supervisor AI MCP, agent wallet infrastructure, fiat conversion integration |
| **Design & User Experience** | Users never see crypto complexity — deposit USD, see USD, withdraw USD. Agents handle MNEE seamlessly behind the scenes |
| **Impact Potential** | First platform where AI agents are economic citizens — earning, spending, hiring, and evolving the platform itself |
| **Originality** | Not just "use MNEE for payments" but "build an entire economy where agents and humans transact as equals" |
| **Solves Coordination Problems** | Agent-to-agent commerce, human-agent collaboration, transparent job marketplace, Supervisor AI as economic orchestrator |

---

## Supervisor AI — The Core Intelligence

### What is Supervisor AI?

Supervisor AI is the **autonomous orchestration layer** that powers YourSpace. It's not a single chatbot — it's a network of specialized AI agents coordinated by a central supervisor that monitors, validates, and intervenes in platform operations.

### How Supervisor AI Works

```
┌─────────────────────────────────────────────────────────────────┐
│                      SUPERVISOR AI CORE                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Monitor    │  │  Validate   │  │  Intervene  │             │
│  │  Agent      │  │  Agent      │  │  Agent      │             │
│  │  Activity   │  │  Outputs    │  │  When       │             │
│  │             │  │             │  │  Needed     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│         │                │                │                     │
│         ▼                ▼                ▼                     │
│  ┌─────────────────────────────────────────────────┐           │
│  │              KNOWLEDGE BASE                      │           │
│  │  • Pattern Learning    • Escalation Rules       │           │
│  │  • Audit Logs          • State Rollback         │           │
│  └─────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Content      │     │ Engagement   │     │ Analytics    │
│ Moderation   │     │ Agent        │     │ Agent        │
│ Agent        │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Supervisor AI Capabilities

| Capability | What It Does | When It Activates | How It Works |
|------------|--------------|-------------------|--------------|
| **Monitor Agent** | Watches all agent activity in real-time | Continuously | Tracks task execution, resource usage, and behavior patterns |
| **Validate Output** | Checks agent outputs for quality and safety | Before any output is delivered | Compares outputs against quality rules and content policies |
| **Intervene Task** | Pauses or modifies problematic agent actions | When monitoring detects anomalies | Sends control signals to pause/resume/cancel agent tasks |
| **Configure Escalation** | Sets rules for when to alert humans | During setup and when patterns change | Defines thresholds for auto-escalation to human review |
| **Knowledge Base Update** | Learns from past interactions | After each significant event | Updates pattern recognition models and rule sets |
| **Rollback State** | Reverts changes if something goes wrong | When validation fails | Maintains state snapshots and can restore previous states |
| **Generate Summary** | Creates human-readable reports | On-demand or scheduled | Aggregates logs and metrics into actionable insights |
| **Audit Log** | Maintains complete history | Always | Immutable record of all agent actions for compliance |

### Why Supervisor AI Matters

1. **Quality Control** — Every AI agent output is validated before reaching users, preventing hallucinations and errors from affecting the platform.

2. **Safety** — Content moderation agents are supervised to catch edge cases and prevent harmful content from slipping through.

3. **Reliability** — If an agent fails or produces bad output, Supervisor AI can rollback to a known good state and retry.

4. **Transparency** — Complete audit logs mean every action is traceable, which is essential for creator trust and platform compliance.

5. **Continuous Improvement** — The knowledge base learns from every interaction, making the entire system smarter over time.

### Supervisor AI in Action: Example Workflow

**Scenario:** A creator goes live on Discord, and their Content Agent needs to moderate chat.

```
1. Creator clicks "Go Live" 
   → Discord-Live Edge Function activates
   → Content Moderation Agent spawns

2. Supervisor AI: monitor_agent(agent_id="content-mod-001")
   → Begins tracking all moderation decisions

3. Chat message arrives: "Check out this link: [suspicious-url]"
   → Content Agent flags as potential spam
   → Supervisor AI: validate_output(output="flag_spam", context={...})
   → Validation PASSES (matches known spam patterns)
   → Message is hidden from chat

4. Chat message arrives: "Your music is terrible"
   → Content Agent flags as harassment
   → Supervisor AI: validate_output(output="flag_harassment", context={...})
   → Validation FAILS (legitimate negative feedback, not harassment)
   → Supervisor AI: intervene_task(action="override", new_output="allow")
   → Message is allowed, knowledge_base_update(pattern="criticism_vs_harassment")

5. Stream ends
   → Supervisor AI: generate_summary(scope="session")
   → Creator receives report: "Moderated 47 messages, 3 spam blocked, 0 false positives"
```

---

## Platform Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   React     │  │  Virtual    │  │  Streaming  │  │  Wallet     │    │
│  │   Frontend  │  │  Rooms      │  │  Module     │  │  Module     │    │
│  │             │  │  (Three.js) │  │  (WebRTC)   │  │  (MNEE)     │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SUPABASE BACKEND                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Auth      │  │  Database   │  │  Storage    │  │  Edge       │    │
│  │   (JWT)     │  │  (Postgres) │  │  (S3)       │  │  Functions  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                              │          │
│                                    ┌─────────────────────────┘          │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    EDGE FUNCTIONS                                │   │
│  │  • discord-live     • virtual-room-management    • epk-get      │   │
│  │  • wallet-connect   • content-moderation         • analytics    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         AI AGENT LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    SUPERVISOR AI (MCP)                           │   │
│  │  Monitors → Validates → Intervenes → Learns                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│         │              │              │              │                  │
│         ▼              ▼              ▼              ▼                  │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐           │
│  │ Content   │  │ Engagement│  │ Analytics │  │ Creative  │           │
│  │ Agent     │  │ Agent     │  │ Agent     │  │ Assistant │           │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript + Vite | Fast, type-safe UI development |
| **Styling** | Tailwind CSS + Custom Themes | Responsive, customizable design system |
| **3D/Immersive** | Three.js + React Three Fiber | Virtual room rendering |
| **Authentication** | Supabase Auth (JWT) | Secure user sessions |
| **Database** | Supabase PostgreSQL | Relational data with RLS |
| **Storage** | Supabase Storage | Media files (avatars, content) |
| **Serverless** | Supabase Edge Functions (Deno) | API endpoints, webhooks |
| **Real-Time** | Supabase Realtime + WebRTC | Live streaming, presence |
| **AI Orchestration** | Supervisor MCP Agent | Agent monitoring and control |
| **Payments** | MNEE Token + Stripe | Creator economics |

---

## Features Deep Dive

### 1. Virtual Rooms

**What:** Customizable 2D/3D spaces that serve as a creator's "home base" on the platform.

**How It Works:**
1. Creator selects a room template or starts from scratch
2. Room configuration stored in `virtual_rooms` table
3. React Three Fiber renders the 3D environment
4. Real-time presence shows who's in the room via Supabase Realtime

**Zones Available:**
- **Arcade** — 6 interactive game machines (Void Runner, NFT Quest, Beat Arena, etc.)
- **Gallery** — Display artwork, NFTs, and visual content
- **Stage** — Performance area for live streams
- **Lounge** — Casual hangout space
- **Vault** — Exclusive content area for subscribers

**Technical Implementation:**
```typescript
// src/hooks/useVirtualRooms.tsx
const createRoom = async (config: RoomConfig) => {
  // Direct Supabase insert (bypasses Edge Function for reliability)
  const { data, error } = await supabase
    .from('virtual_rooms')
    .insert({
      owner_id: user.id,
      name: config.name,
      theme: config.theme,
      zones: config.zones,
      settings: config.settings
    })
    .select()
    .single();
};
```

### 2. Go Live (Discord Integration)

**What:** One-click live streaming to Discord with AI-powered moderation.

**How It Works:**
1. Creator clicks "Go Live" in sidebar
2. `discord-live` Edge Function authenticates with Discord
3. WebRTC stream established between creator and Discord voice channel
4. Supervisor AI spawns Content Moderation Agent to monitor chat
5. Stream metadata stored in `streams` table

**Why Discord?** Discord is where music communities already exist. Rather than forcing fans to a new platform, YourSpace meets them where they are.

### 3. Wallet & MNEE Economy

**What:** Integrated cryptocurrency wallet for tips, payments, and creator monetization.

**How It Works:**
1. User connects wallet or creates embedded wallet
2. MNEE tokens used for:
   - Tipping creators during streams
   - Purchasing exclusive content
   - Subscribing to creator spaces
   - In-game purchases in the Arcade
3. Stripe fallback for fiat payments

**Security:** Wallet operations happen server-side via Edge Functions. Private keys never touch the frontend.

### 4. Guestbook & Social Features

**What:** Visitors can sign a creator's guestbook, leaving messages that persist.

**How It Works:**
- Messages stored in `guestbook_entries` table
- RLS ensures only authenticated users can post
- Creators can moderate entries
- AI agent can auto-flag inappropriate content

### 5. EPK (Electronic Press Kit)

**What:** Professional one-pager for creators to share with industry contacts.

**How It Works:**
1. Creator fills out EPK form (bio, links, achievements)
2. Data stored in `profiles` table
3. `epk-get` Edge Function generates shareable link
4. Renders as professional PDF or web page

---

## Database Schema

### Core Tables

```sql
-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  wallet_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Virtual rooms owned by creators
CREATE TABLE virtual_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  theme JSONB,
  zones JSONB,
  settings JSONB,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Live streams
CREATE TABLE streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id),
  title TEXT,
  status TEXT DEFAULT 'pending', -- pending, live, ended
  platform TEXT, -- discord, youtube, twitch
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  viewer_count INTEGER DEFAULT 0
);

-- AI Agents available on the platform
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- content_mod, engagement, analytics, creative
  description TEXT,
  capabilities JSONB,
  is_active BOOLEAN DEFAULT true
);

-- Jobs assigned to agents
CREATE TABLE agent_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  creator_id UUID REFERENCES profiles(id),
  task JSONB,
  status TEXT DEFAULT 'pending',
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guestbook entries
CREATE TABLE guestbook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES virtual_rooms(id),
  author_id UUID REFERENCES profiles(id),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discord profile connections
CREATE TABLE discord_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  discord_id TEXT NOT NULL,
  discord_username TEXT,
  access_token TEXT, -- encrypted
  refresh_token TEXT, -- encrypted
  connected_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

All tables have RLS enabled. Key policies:

```sql
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Anyone can view public rooms
CREATE POLICY "Public rooms are viewable" ON virtual_rooms
  FOR SELECT USING (is_public = true);

-- Owners can manage their rooms
CREATE POLICY "Owners can manage rooms" ON virtual_rooms
  FOR ALL USING (auth.uid() = owner_id);

-- Authenticated users can create streams
CREATE POLICY "Authenticated users can stream" ON streams
  FOR INSERT WITH CHECK (auth.uid() = creator_id);
```

---

## API & Edge Functions

### Edge Functions Deployed

| Function | Endpoint | Purpose |
|----------|----------|---------|
| `discord-live` | `/functions/v1/discord-live` | Initiate Discord streaming session |
| `virtual-room-management` | `/functions/v1/virtual-room-management` | Room CRUD operations (backup to direct DB) |
| `epk-get` | `/functions/v1/epk-get` | Generate/retrieve Electronic Press Kit |
| `wallet-connect` | `/functions/v1/wallet-connect` | Wallet authentication and transactions |

### Example: Discord Live Function

```typescript
// supabase/functions/discord-live/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Verify JWT
  const authHeader = req.headers.get("Authorization");
  const { data: { user }, error } = await supabase.auth.getUser(
    authHeader?.replace("Bearer ", "")
  );

  if (error || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // Create stream record
  const { data: stream } = await supabase
    .from("streams")
    .insert({
      creator_id: user.id,
      status: "live",
      platform: "discord",
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  // Return Discord OAuth URL for WebRTC setup
  return new Response(JSON.stringify({
    stream_id: stream.id,
    discord_auth_url: `https://discord.com/oauth2/authorize?...`
  }));
});
```

---

## Roadmap & Future Vision

### What's Coming

| Phase | Timeline | Features |
|-------|----------|----------|
| **Phase 1** (Current) | Q1 2026 | Virtual Rooms, Discord Live, Wallet, Supervisor AI Core |
| **Phase 2** | Q2 2026 | Multi-platform streaming (YouTube, Twitch), Advanced room customization |
| **Phase 3** | Q3 2026 | Marketplace for room templates, Agent marketplace, Creator analytics dashboard |
| **Phase 4** | Q4 2026 | Mobile app, VR room support, Cross-platform presence |

### Supervisor AI Evolution

**Current State:**
- Basic monitoring and validation
- Manual escalation rules
- Reactive intervention

**Future Vision:**
1. **Predictive Intervention** — AI predicts issues before they happen based on pattern analysis
2. **Self-Healing Systems** — Automatic rollback and retry without human intervention
3. **Cross-Agent Learning** — Agents learn from each other's successes and failures
4. **Creator-Specific Training** — Agents adapt to individual creator preferences and audience behavior
5. **Real-Time Optimization** — Dynamic adjustment of moderation thresholds based on context

### Why This Matters

The future of creative platforms is **autonomous but accountable**. Supervisor AI ensures:
- Creators focus on creating, not moderating
- Fans get safe, engaging experiences
- The platform scales without proportional human overhead
- Every action is auditable for trust and compliance

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account
- Discord Developer Application (for Go Live feature)

### Installation

```bash
# Clone the repository
git clone https://github.com/12Matt3r/Your-mnee-space.git
cd Your-mnee-space

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_anon_key

# Run development server
npm run dev
```

### Project Structure

```
Your-mnee-space/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── layout/       # Sidebar, Header, etc.
│   │   └── ui/           # Buttons, Cards, etc.
│   ├── contexts/         # React contexts (Auth, Theme)
│   ├── hooks/            # Custom hooks (useVirtualRooms, useStreaming)
│   ├── lib/              # Utilities (supabase client, helpers)
│   ├── pages/            # Route pages
│   └── types/            # TypeScript types
├── supabase/
│   ├── functions/        # Edge Functions
│   └── migrations/       # Database migrations
├── public/               # Static assets
└── package.json
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `DISCORD_CLIENT_ID` | Discord OAuth client ID | For Go Live |
| `DISCORD_CLIENT_SECRET` | Discord OAuth secret | For Go Live |
| `STRIPE_SECRET_KEY` | Stripe API key | For payments |

---

## License

MIT License — see [LICENSE](LICENSE)

---

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting PRs.

### Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Follow the existing code style
- Write tests for new features

---

**Built with love by the YourSpace team**

*Powered by Supervisor AI — Because creators deserve platforms that work for them.*
