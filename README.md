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

## MNEE Integration — The Economic Engine

> **YourSpace is built on MNEE** — the world's fastest USD-backed stablecoin. Every transaction, tip, payment, and AI agent operation flows through MNEE, enabling instant, sub-penny micropayments that traditional payment rails simply cannot support.

### Why MNEE is Perfect for Creator Platforms

| Challenge | Traditional Solution | MNEE Solution |
|-----------|---------------------|---------------|
| **Microtips** ($0.10-$1.00) | Impossible — fees eat 30%+ | ✅ Fees < 1/10th of a penny |
| **Instant Payouts** | 3-5 business days | ✅ < 1 second settlement |
| **Global Access** | Bank account required | ✅ Wallet-based, no banks |
| **AI Agent Payments** | Not supported | ✅ Programmable money for autonomous transactions |
| **Real-Time Earnings** | Batch processing | ✅ Stream earnings in real-time |

### How YourSpace Uses MNEE

#### 1. AI Agent Payments (Autonomous Commerce)

Our Supervisor AI and subordinate agents don't just monitor — they **transact autonomously using MNEE**. This is the future of agent-to-agent commerce:

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI AGENT PAYMENT FLOWS                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    MNEE     ┌──────────────┐                 │
│  │ Content      │───────────▶│ Moderation   │                 │
│  │ Agent        │  $0.001    │ API Service  │                 │
│  └──────────────┘            └──────────────┘                 │
│         │                                                       │
│         │ MNEE $0.0005                                         │
│         ▼                                                       │
│  ┌──────────────┐    MNEE     ┌──────────────┐                 │
│  │ Analytics    │───────────▶│ Data         │                 │
│  │ Agent        │  $0.002    │ Provider     │                 │
│  └──────────────┘            └──────────────┘                 │
│         │                                                       │
│         │ MNEE $0.01                                           │
│         ▼                                                       │
│  ┌──────────────┐    MNEE     ┌──────────────┐                 │
│  │ Creative     │───────────▶│ AI Model     │                 │
│  │ Assistant    │  $0.05     │ Inference    │                 │
│  └──────────────┘            └──────────────┘                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Real Example — Live Stream Moderation:**
```typescript
// Agent pays for each moderation API call using MNEE
async function moderateMessage(message: string) {
  // Supervisor AI approves payment
  const approval = await supervisorAI.validateOutput({
    action: "pay_for_service",
    amount: 0.001, // $0.001 MNEE
    recipient: "moderation-api.eth"
  });
  
  if (approval.valid) {
    // Execute MNEE micropayment
    await mneeClient.transfer({
      to: MODERATION_API_WALLET,
      amount: "0.001",
      memo: `mod:${message.id}`
    });
    
    // Call moderation API (now paid for)
    return await moderationAPI.analyze(message);
  }
}
```

**Why This Matters:** AI agents can now operate economically independently. They pay for their own API calls, data access, and compute resources — all tracked and audited by Supervisor AI.

#### 2. Creator Economy (Commerce & Creator Tools)

MNEE powers every creator monetization feature in YourSpace:

| Feature | How MNEE is Used | Transaction Size |
|---------|------------------|------------------|
| **Live Stream Tips** | Fans send MNEE tips during Discord streams | $0.10 - $100+ |
| **Content Paywalls** | Unlock exclusive vault content | $1 - $50 |
| **Subscription Access** | Monthly creator subscriptions | $5 - $25/month |
| **Arcade Purchases** | In-game currency and items | $0.01 - $10 |
| **Guestbook Highlights** | Pay to pin guestbook messages | $0.25 - $5 |
| **EPK Downloads** | Industry contacts pay for press kit | $0 - $10 |

**Implementation — Tipping During Streams:**
```typescript
// src/hooks/useMNEEPayments.tsx
export function useTipping() {
  const sendTip = async (creatorId: string, amount: number) => {
    // Get creator's MNEE wallet from profile
    const { data: creator } = await supabase
      .from('profiles')
      .select('wallet_address')
      .eq('id', creatorId)
      .single();
    
    // Execute MNEE transfer
    const tx = await mneeContract.transfer(
      creator.wallet_address,
      ethers.parseUnits(amount.toString(), 6) // MNEE uses 6 decimals
    );
    
    // Record in database for analytics
    await supabase.from('transactions').insert({
      sender_id: user.id,
      recipient_id: creatorId,
      amount,
      type: 'tip',
      tx_hash: tx.hash,
      created_at: new Date().toISOString()
    });
    
    // Trigger real-time notification
    await supabase.channel(`creator:${creatorId}`)
      .send({ type: 'tip', amount, from: user.username });
  };
  
  return { sendTip };
}
```

#### 3. Programmable Finance & Automation

YourSpace uses MNEE for automated financial workflows that run without human intervention:

**Revenue Splitting:**
```typescript
// Automatic revenue split when creator earns
async function processEarning(creatorId: string, amount: number) {
  const splits = await getRevenueSplits(creatorId);
  // Example: Creator 85%, Platform 10%, Agent Fund 5%
  
  for (const split of splits) {
    await mneeContract.transfer(
      split.wallet,
      ethers.parseUnits((amount * split.percentage).toString(), 6)
    );
  }
}
```

**Escrow for Collaborations:**
```typescript
// Creator collaboration with escrow
async function createCollabEscrow(terms: CollabTerms) {
  const escrowContract = await MNEEEscrow.deploy(
    terms.creator1Wallet,
    terms.creator2Wallet,
    terms.totalAmount,
    terms.milestones
  );
  
  // Funds released automatically when milestones complete
  // Supervisor AI validates milestone completion
}
```

**Subscription Auto-Renewal:**
```typescript
// Monthly subscription check (runs via cron)
async function processSubscriptions() {
  const dueSubscriptions = await supabase
    .from('subscriptions')
    .select('*')
    .lte('next_billing', new Date().toISOString());
  
  for (const sub of dueSubscriptions) {
    // Attempt MNEE charge
    const success = await mneeContract.transferFrom(
      sub.subscriber_wallet,
      sub.creator_wallet,
      sub.amount
    );
    
    if (success) {
      // Extend subscription
      await supabase.from('subscriptions')
        .update({ next_billing: addMonths(1) })
        .eq('id', sub.id);
    }
  }
}
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
| **Attestation** | Monthly third-party audits (Wolf & Company, P.C.) |
| **Compliance** | GENIUS Act pathway |

### MNEE Wallet Integration

YourSpace supports multiple wallet connection methods:

```typescript
// src/lib/mnee-wallet.ts
export async function connectWallet(): Promise<WalletConnection> {
  // Option 1: MetaMask/Browser Wallet
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { type: 'browser', signer };
  }
  
  // Option 2: Embedded Wallet (for non-crypto users)
  const embeddedWallet = await createEmbeddedWallet(user.id);
  return { type: 'embedded', signer: embeddedWallet };
  
  // Option 3: RockWallet Integration
  const rockWallet = await RockWallet.connect();
  return { type: 'rockwallet', signer: rockWallet };
}
```

### Why MNEE Over Other Payment Options?

| Comparison | MNEE | Stripe | PayPal | Crypto (ETH/BTC) |
|------------|------|--------|--------|------------------|
| **$0.25 tip** | $0.001 fee ✅ | $0.32 fee ❌ | $0.35 fee ❌ | $2+ gas ❌ |
| **Settlement** | < 1 sec ✅ | 2-7 days | 1-3 days | 1-60 min |
| **Global** | ✅ Instant | Partial | Partial | ✅ |
| **AI Agents** | ✅ Native | ❌ | ❌ | Expensive |
| **Programmable** | ✅ Smart contracts | API only | API only | ✅ |
| **Price Stable** | ✅ $1 = 1 MNEE | N/A | N/A | ❌ Volatile |

### MNEE in the Hackathon Context

YourSpace demonstrates all three hackathon tracks:

| Track | Our Implementation |
|-------|-------------------|
| **AI & Agent Payments** | Supervisor AI agents pay for moderation APIs, data services, and compute resources autonomously using MNEE micropayments |
| **Commerce & Creator Tools** | Live stream tipping, content paywalls, subscription payments, arcade in-game purchases — all via MNEE |
| **Financial Automation** | Programmable revenue splits, escrow contracts for collaborations, auto-renewal subscriptions |

### Judging Criteria Alignment

| Criteria | How YourSpace Delivers |
|----------|----------------------|
| **Technological Implementation** | Production-ready Supabase backend, Edge Functions, real-time WebRTC streaming, Supervisor AI MCP integration |
| **Design & User Experience** | Immersive "Enter the Void" virtual rooms, one-click Discord streaming, intuitive wallet UX |
| **Impact Potential** | Solves real creator monetization pain (fees, delays, global access), enables AI agent economy |
| **Originality** | First platform combining AI agent supervision with MNEE micropayments for creator tools |
| **Solves Coordination Problems** | Transparent creator-fan economics, auditable AI agent actions, programmable revenue sharing |

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
