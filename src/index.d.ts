declare module '@solver/sdk' {
  export interface SolverConfig {
    apiKey: string;
    baseUrl?: string;
  }

  export interface Chain {
    key: string;
    name: string;
    chainId: number | null;
    type: 'evm' | 'solana';
    usdcAddress: string;
    explorerUrl: string;
  }

  export interface Token {
    symbol: string;
    name: string;
    address: string;
    chain: string;
    decimals: number;
    logoUrl?: string;
  }

  export interface QuoteParams {
    fromChain: string;
    toChain: string;
    fromToken: string;
    toToken: string;
    amount: string;
  }

  export interface Route {
    bridge: string;
    dex: string;
    estimatedTime: number;
    fromChain: string;
    toChain: string;
  }

  export interface Quote {
    id: string;
    amountIn: string;
    amountOut: string;
    fee: string;
    route: Route;
    expiresAt: string;
  }

  export interface Trade {
    id: string;
    status: TradeStatusType;
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

  export type TradeStatusType = 'pending' | 'bridging' | 'swapping' | 'completed' | 'failed';

  export interface WebhookPayload {
    event: 'trade.completed' | 'trade.failed' | 'deposit.confirmed';
    data: Record<string, any>;
    timestamp: string;
  }

  export class Solver {
    constructor(config: SolverConfig);

    /** Get all supported chains */
    chains(): Promise<Chain[]>;

    /** Search tokens by symbol or address */
    tokens(query: string, chain?: string): Promise<Token[]>;

    /** Get a cross-chain swap quote */
    quote(params: QuoteParams): Promise<Quote>;

    /** Execute a quoted swap */
    execute(quoteId: string): Promise<Trade>;

    /** Check trade status */
    status(tradeId: string): Promise<Trade>;

    /** Poll until trade completes or fails */
    waitForCompletion(tradeId: string, timeout?: number): Promise<Trade>;

    /** Register a webhook for trade notifications */
    registerWebhook(url: string, events?: string[]): Promise<void>;
  }

  export default Solver;

  // Enums
  export const TradeStatus: {
    PENDING: 'pending';
    BRIDGING: 'bridging';
    SWAPPING: 'swapping';
    COMPLETED: 'completed';
    FAILED: 'failed';
  };

  export const SupportedChains: {
    ETHEREUM: 'ethereum';
    BASE: 'base';
    ARBITRUM: 'arbitrum';
    OPTIMISM: 'optimism';
    POLYGON: 'polygon';
    BSC: 'bsc';
    AVALANCHE: 'avalanche';
    SOLANA: 'solana';
  };

  export const WebhookEvents: {
    TRADE_COMPLETED: 'trade.completed';
    TRADE_FAILED: 'trade.failed';
    DEPOSIT_CONFIRMED: 'deposit.confirmed';
  };

  // Errors
  export class SolverError extends Error {
    code: string;
    details?: any;
  }
  export class AuthenticationError extends SolverError {}
  export class QuoteError extends SolverError {}
  export class QuoteExpiredError extends SolverError {
    quoteId: string;
  }
  export class ExecutionError extends SolverError {
    tradeId: string;
  }
  export class UnsupportedChainError extends SolverError {
    chain: string;
  }
  export class TimeoutError extends SolverError {
    tradeId: string;
  }
  export class InsufficientLiquidityError extends SolverError {}

  // Utils
  export function formatAmount(amount: string | bigint, decimals?: number): string;
  export function parseAmount(amount: string, decimals?: number): string;
  export function shortenAddress(address: string, chars?: number): string;
  export function getExplorerUrl(chain: string, txHash: string): string;
  export function isValidChain(chain: string): boolean;
  export function retry<T>(fn: () => Promise<T>, maxRetries?: number, baseDelay?: number): Promise<T>;
}
