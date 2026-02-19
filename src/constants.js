/**
 * Chain configuration constants.
 */
export const CHAINS = {
  ethereum: { chainId: 1, name: 'Ethereum', type: 'evm', usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', explorer: 'https://etherscan.io' },
  base:     { chainId: 8453, name: 'Base', type: 'evm', usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', explorer: 'https://basescan.org' },
  arbitrum: { chainId: 42161, name: 'Arbitrum', type: 'evm', usdc: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', explorer: 'https://arbiscan.io' },
  optimism: { chainId: 10, name: 'Optimism', type: 'evm', usdc: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', explorer: 'https://optimistic.etherscan.io' },
  polygon:  { chainId: 137, name: 'Polygon', type: 'evm', usdc: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', explorer: 'https://polygonscan.com' },
  bsc:      { chainId: 56, name: 'BSC', type: 'evm', usdc: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', explorer: 'https://bscscan.com' },
  avalanche:{ chainId: 43114, name: 'Avalanche', type: 'evm', usdc: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', explorer: 'https://snowtrace.io' },
  solana:   { chainId: null, name: 'Solana', type: 'solana', usdc: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', explorer: 'https://solscan.io' },
};

/**
 * Default SDK configuration.
 */
export const DEFAULTS = {
  baseUrl: 'https://api.solver.trade',
  pollInterval: 3000,       // 3 seconds between status polls
  quoteExpiry: 60000,       // Quotes expire after 60 seconds
  maxTimeout: 300000,       // 5 minute max wait for trade completion
  feePercent: 0.003,        // 0.3% fee
  maxSlippage: 0.005,       // 0.5% default slippage
};

/**
 * API endpoints.
 */
export const ENDPOINTS = {
  CHAINS: '/v1/chains',
  TOKENS: '/v1/tokens',
  QUOTE: '/v1/quote',
  EXECUTE: '/v1/execute',
  TRADES: '/v1/trades',
  WEBHOOKS: '/v1/webhooks',
};
