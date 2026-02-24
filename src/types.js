/**
 * @typedef {Object} SolverConfig
 * @property {string} apiKey - API key for authentication
 * @property {string} [baseUrl] - Custom API base URL
 */

/**
 * @typedef {Object} Chain
 * @property {string} key - Chain identifier (e.g., 'base', 'ethereum')
 * @property {string} name - Human-readable chain name
 * @property {number|null} chainId - EVM chain ID (null for non-EVM)
 * @property {'evm'|'solana'} type - Chain type
 * @property {string} usdcAddress - USDC contract address on this chain
 * @property {string} explorerUrl - Block explorer base URL
 */

/**
 * @typedef {Object} Token
 * @property {string} symbol - Token symbol (e.g., 'SOL')
 * @property {string} name - Token name (e.g., 'Solana')
 * @property {string} address - Contract address
 * @property {string} chain - Chain key
 * @property {number} decimals - Token decimals
 * @property {string} [logoUrl] - Token logo URL
 */

/**
 * @typedef {Object} QuoteParams
 * @property {string} fromChain - Source chain key
 * @property {string} toChain - Destination chain key
 * @property {string} fromToken - Source token (symbol or address)
 * @property {string} toToken - Destination token (symbol or address)
 * @property {string} amount - Amount in human-readable units
 */

/**
 * @typedef {Object} Quote
 * @property {string} id - Quote ID
 * @property {string} amountIn - Input amount
 * @property {string} amountOut - Expected output amount
 * @property {string} fee - Fee amount
 * @property {Route} route - Selected route
 * @property {string} expiresAt - Quote expiration timestamp
 */

/**
 * @typedef {Object} Route
 * @property {string} bridge - Bridge provider name
 * @property {string} dex - DEX aggregator name
 * @property {number} estimatedTime - Estimated completion time in seconds
 * @property {string} fromChain - Source chain
 * @property {string} toChain - Destination chain
 */

/**
 * @typedef {Object} Trade
 * @property {string} id - Trade ID
 * @property {'pending'|'bridging'|'swapping'|'completed'|'failed'} status - Trade status
 * @property {string} fromChain - Source chain
 * @property {string} toChain - Destination chain
 * @property {string} fromToken - Input token
 * @property {string} toToken - Output token
 * @property {string} amountIn - Input amount
 * @property {string} [amountOut] - Output amount (available after completion)
 * @property {string} fee - Fee charged
 * @property {string} [bridgeTx] - Bridge transaction hash
 * @property {string} [swapTx] - Destination chain swap tx hash
 * @property {string} [error] - Error message (if failed)
 * @property {string} createdAt - Creation timestamp
 * @property {string} [completedAt] - Completion timestamp
 */

/**
 * @typedef {Object} WebhookPayload
 * @property {'trade.completed'|'trade.failed'|'deposit.confirmed'} event - Event type
 * @property {Object} data - Event data
 * @property {string} timestamp - Event timestamp
 */

export const TradeStatus = {
  PENDING: 'pending',
  BRIDGING: 'bridging',
  SWAPPING: 'swapping',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export const SupportedChains = {
  ETHEREUM: 'ethereum',
  BASE: 'base',
  ARBITRUM: 'arbitrum',
  OPTIMISM: 'optimism',
  POLYGON: 'polygon',
  BSC: 'bsc',
  AVALANCHE: 'avalanche',
  SOLANA: 'solana',
};

export const WebhookEvents = {
  TRADE_COMPLETED: 'trade.completed',
  TRADE_FAILED: 'trade.failed',
  DEPOSIT_CONFIRMED: 'deposit.confirmed',
};
