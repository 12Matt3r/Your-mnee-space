// MNEE Stablecoin Configuration
// Ethereum Mainnet: 0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF

export const MNEE_CONFIG = {
  address: '0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF' as const,
  chainId: 1,
  symbol: 'MNEE',
  name: 'MNEE Stablecoin',
  decimals: 18,
  etherscan: 'https://etherscan.io/token/0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF',
};

// Standard ERC-20 ABI for MNEE interactions
export const MNEE_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_to', type: 'address' }, { name: '_value', type: 'uint256' }],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_spender', type: 'address' }, { name: '_value', type: 'uint256' }],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }, { name: '_spender', type: 'address' }],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
] as const;

export const TRANSFER_EVENT_SIGNATURE = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

// Helper functions
export function formatMNEE(weiAmount: bigint | string | number): string {
  const amount = typeof weiAmount === 'string' ? BigInt(weiAmount) : BigInt(weiAmount);
  const formatted = Number(amount) / Math.pow(10, MNEE_CONFIG.decimals);
  return formatted.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseMNEE(mneeAmount: string | number): bigint {
  const amount = typeof mneeAmount === 'string' ? parseFloat(mneeAmount) : mneeAmount;
  return BigInt(Math.floor(amount * Math.pow(10, MNEE_CONFIG.decimals)));
}

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function generatePaymentLink(recipient: string, amount: string): string {
  return `https://swap-user.mnee.net/swap?recipient=${recipient}&amount=${amount}`;
}

// MNEE to USD conversion (1 MNEE = $1 USD stablecoin)
export const MNEE_USD_RATE = 1.0;

export function mneeToUsd(mneeAmount: number): number {
  return mneeAmount * MNEE_USD_RATE;
}

export function formatMneeWithUsd(mneeAmount: number): string {
  return `${mneeAmount} MNEE (~$${mneeAmount.toFixed(2)} USD)`;
}

// AI Credit System Pricing
export const AI_CREDIT_PRICING = {
  imageGeneration: { cost: 0.5, unit: 'per image', description: 'AI image generation' },
  textGeneration: { cost: 0.1, unit: 'per 1000 words', description: 'AI text/content generation' },
  designGeneration: { cost: 0.3, unit: 'per design', description: 'AI design/layout creation' },
};

// Subscription Tiers
export const SUBSCRIPTION_TIERS = {
  free: { name: 'Basic', price: 0, features: ['View public content', 'Basic profile', 'Limited messages'] },
  pro: { name: 'Pro', price: 10, features: ['All Basic features', 'Priority support', 'Exclusive content', 'No ads'] },
  premium: { name: 'Premium', price: 25, features: ['All Pro features', '1-on-1 sessions', 'Custom requests', 'Early access'] },
};

// 4-Layer Economy Configuration
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

// 5-Tier Favoritism System
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
