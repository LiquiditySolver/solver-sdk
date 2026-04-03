/**
 * Solver SDK - TypeScript Reference Implementation
 *
 * This file serves as the TypeScript reference for the Solver API client.
 * The production SDK is in index.js. This file provides a fully typed
 * implementation for TypeScript-first projects.
 */

interface SolverConfig {
  apiKey: string;
  baseUrl?: string;
}

interface QuoteParams {
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
  amount: string;
}

interface Route {
  bridge: string;
  dex: string;
  estimatedTime: number;
  fromChain: string;
  toChain: string;
}

interface Quote {
  id: string;
  amountIn: string;
  amountOut: string;
  fee: string;
  route: Route;
  expiresAt: string;
}

interface Trade {
  id: string;
  status: 'pending' | 'bridging' | 'swapping' | 'completed' | 'failed';
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
  amountIn: string;
  amountOut?: string;
  fee: string;
  bridgeTx?: string;
  swapTx?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

interface Chain {
  key: string;
  name: string;
  chainId: number | null;
  type: 'evm' | 'solana';
  usdcAddress: string;
  explorerUrl: string;
}

interface Token {
  symbol: string;
  name: string;
  address: string;
  chain: string;
  decimals: number;
  logoUrl?: string;
}

interface WebhookPayload {
  event: 'trade.completed' | 'trade.failed' | 'deposit.confirmed';
  data: Record<string, unknown>;
  timestamp: string;
}

const DEFAULT_API = 'https://api.solver.trade';

export class Solver {
  private apiKey: string;
  private baseUrl: string;

  constructor({ apiKey, baseUrl = DEFAULT_API }: SolverConfig) {
    if (!apiKey) throw new Error('apiKey is required');
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const opts: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${this.baseUrl}${path}`, opts);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error((err as { error: string }).error || `Request failed: ${res.status}`);
    }
    return res.json() as Promise<T>;
  }

  /** Get all supported chains */
  async chains(): Promise<Chain[]> {
    return this.request<Chain[]>('GET', '/v1/chains');
  }

  /** Search tokens by symbol or address */
  async tokens(query: string, chain?: string): Promise<Token[]> {
    const params = new URLSearchParams({ q: query });
    if (chain) params.set('chain', chain);
    return this.request<Token[]>('GET', `/v1/tokens?${params}`);
  }

  /** Get a cross-chain swap quote */
  async quote(params: QuoteParams): Promise<Quote> {
    return this.request<Quote>('POST', '/v1/quote', params);
  }

  /** Execute a quoted swap */
  async execute(quoteId: string): Promise<Trade> {
    return this.request<Trade>('POST', '/v1/execute', { quoteId });
  }

  /** Check trade status */
  async status(tradeId: string): Promise<Trade> {
    return this.request<Trade>('GET', `/v1/trades/${tradeId}`);
  }

  /** Poll until trade completes or fails */
  async waitForCompletion(tradeId: string, timeout = 300000): Promise<Trade> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const trade = await this.status(tradeId);
      if (trade.status === 'completed') return trade;
      if (trade.status === 'failed') throw new Error(`Trade failed: ${trade.error}`);
      await new Promise(r => setTimeout(r, 3000));
    }
    throw new Error('Trade timeout');
  }

  /** Register a webhook for trade notifications */
  async registerWebhook(
    url: string,
    events: string[] = ['trade.completed', 'trade.failed', 'deposit.confirmed']
  ): Promise<void> {
    await this.request('POST', '/v1/webhooks', { url, events });
  }
}

export default Solver;

// Re-export types for consumers
export type {
  SolverConfig,
  QuoteParams,
  Route,
  Quote,
  Trade,
  Chain,
  Token,
  WebhookPayload,
};

/** Trade status enum */
export const TradeStatus = {
  PENDING: 'pending' as const,
  BRIDGING: 'bridging' as const,
  SWAPPING: 'swapping' as const,
  COMPLETED: 'completed' as const,
  FAILED: 'failed' as const,
};

/** Supported chain keys */
export const SupportedChains = {
  ETHEREUM: 'ethereum' as const,
  BASE: 'base' as const,
  ARBITRUM: 'arbitrum' as const,
  OPTIMISM: 'optimism' as const,
  POLYGON: 'polygon' as const,
  BSC: 'bsc' as const,
  AVALANCHE: 'avalanche' as const,
  SOLANA: 'solana' as const,
};

/** Chain configuration with USDC addresses and explorers */
export const CHAINS: Record<string, {
  chainId: number | null;
  name: string;
  type: 'evm' | 'solana';
  usdc: string;
  explorer: string;
}> = {
  ethereum: { chainId: 1, name: 'Ethereum', type: 'evm', usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', explorer: 'https://etherscan.io' },
  base: { chainId: 8453, name: 'Base', type: 'evm', usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', explorer: 'https://basescan.org' },
  arbitrum: { chainId: 42161, name: 'Arbitrum', type: 'evm', usdc: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', explorer: 'https://arbiscan.io' },
  optimism: { chainId: 10, name: 'Optimism', type: 'evm', usdc: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', explorer: 'https://optimistic.etherscan.io' },
  polygon: { chainId: 137, name: 'Polygon', type: 'evm', usdc: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', explorer: 'https://polygonscan.com' },
  bsc: { chainId: 56, name: 'BSC', type: 'evm', usdc: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', explorer: 'https://bscscan.com' },
  avalanche: { chainId: 43114, name: 'Avalanche', type: 'evm', usdc: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', explorer: 'https://snowtrace.io' },
  solana: { chainId: null, name: 'Solana', type: 'solana', usdc: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', explorer: 'https://solscan.io' },
};

/** Utility: shorten an address for display */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/** Utility: get block explorer URL for a transaction */
export function getExplorerUrl(chain: string, txHash: string): string {
  const config = CHAINS[chain];
  return config ? `${config.explorer}/tx/${txHash}` : txHash;
}
