import Mnee from '@mnee/ts-sdk';

// Initialize the MNEE SDK
// In a real production environment, you would use 'production'
export const mnee = new Mnee({
  environment: 'sandbox', // Default to sandbox for now
});

// MNEE Configuration
export const MNEE_CONFIG = {
  // Address is managed by the SDK, so this might be a treasury or default recipient if needed
  // Keeping this for reference, but SDK handles addresses differently (not Ethereum style)
  address: '0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF',
  symbol: 'MNEE',
  name: 'MNEE Stablecoin',
  decimals: 5, // 1 MNEE = 100,000 atomic units
};

// Helper functions using the official SDK logic

export function toAtomicAmount(mneeAmount: number): number {
  return mnee.toAtomicAmount(mneeAmount);
}

export function fromAtomicAmount(atomicAmount: number): number {
  return mnee.fromAtomicAmount(atomicAmount);
}

// Wrapper for formatMNEE to maintain backward compatibility with existing components
// but using the SDK's conversion logic
export function formatMNEE(amount: number | string | bigint): string {
  const numAmount = typeof amount === 'bigint' ? Number(amount) : Number(amount);
  // Assuming input is atomic units if it's an integer > 1000, otherwise MNEE
  // This heuristic is tricky, so let's stick to explicit conversion if possible.
  // For now, let's assume specific components pass MNEE units for display.

  return numAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function generatePaymentLink(recipient: string, amount: string): string {
  // MNEE might have a specific URI scheme, for now using the web wallet link
  return `https://wallet.mnee.io/send?to=${recipient}&amount=${amount}`;
}

// MNEE to USD conversion (1 MNEE = $1 USD stablecoin)
export const MNEE_USD_RATE = 1.0;

export function mneeToUsd(mneeAmount: number): number {
  return mneeAmount * MNEE_USD_RATE;
}

export function formatMneeWithUsd(mneeAmount: number): string {
  return `${mneeAmount} MNEE (~$${mneeAmount.toFixed(2)} USD)`;
}

// --- Business Logic Constants (Economy Layers, Pricing, Tiers) ---
// These remain unchanged as they describe the platform's economic model

export const AI_CREDIT_PRICING = {
  imageGeneration: { cost: 0.5, unit: 'per image', description: 'AI image generation' },
  textGeneration: { cost: 0.1, unit: 'per 1000 words', description: 'AI text/content generation' },
  designGeneration: { cost: 0.3, unit: 'per design', description: 'AI design/layout creation' },
};

export const SUBSCRIPTION_TIERS = {
  free: { name: 'Basic', price: 0, features: ['View public content', 'Basic profile', 'Limited messages'] },
  pro: { name: 'Pro', price: 10, features: ['All Basic features', 'Priority support', 'Exclusive content', 'No ads'] },
  premium: { name: 'Premium', price: 25, features: ['All Pro features', '1-on-1 sessions', 'Custom requests', 'Early access'] },
};

export const ECONOMY_LAYERS = {
  USER_TO_AGENT: {
    name: 'User to Agent',
    description: 'Users pay MNEE to hire agents for tasks',
  },
  AGENT_EARNS: {
    name: 'Agent Earnings',
    description: 'Agents earn credits with quality multiplier (up to 5.94x)',
    qualityMultipliers: {
      base: 1.0,
      good: 2.0,
      excellent: 3.5,
      outstanding: 5.94,
    },
  },
  AGENT_TO_AI: {
    name: 'Agent to AI',
    description: 'Agents can hire specialized AI services',
    aiServices: {
      minimax: { name: 'MiniMax', costPerHour: 50 },
      claude: { name: 'Claude', costPerHour: 80 },
      gpt4: { name: 'GPT-4', costPerHour: 60 },
      dalle: { name: 'DALL-E', costPerHour: 40 },
      midjourney: { name: 'Midjourney', costPerHour: 55 },
      whisper: { name: 'Whisper', costPerHour: 25 },
      eleven: { name: 'ElevenLabs', costPerHour: 45 },
    },
  },
  AGENT_TO_HUMAN: {
    name: 'Agent to Human',
    description: 'Revolutionary: Agents can hire humans for specialized tasks',
  },
};

export const FAVORITISM_TIERS = {
  regular: { name: 'Regular', discount: 0, waitTime: '4-8 hours', minSpend: 0 },
  patron: { name: 'Patron', discount: 10, waitTime: '2-4 hours', minSpend: 25 },
  supporter: { name: 'Supporter', discount: 25, waitTime: '30 minutes', minSpend: 100 },
  contributor: { name: 'Contributor', discount: 50, waitTime: '5-15 minutes', minSpend: 500 },
  platformBuilder: { name: 'Platform Builder', discount: 75, waitTime: 'Instant', minSpend: 1000 },
};

export function getUserTier(totalSpent: number): keyof typeof FAVORITISM_TIERS {
  if (totalSpent >= 1000) return 'platformBuilder';
  if (totalSpent >= 500) return 'contributor';
  if (totalSpent >= 100) return 'supporter';
  if (totalSpent >= 25) return 'patron';
  return 'regular';
}
