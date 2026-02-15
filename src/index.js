export { TradeStatus, SupportedChains, WebhookEvents } from './types.js';
export { CHAINS, DEFAULTS, ENDPOINTS } from './constants.js';
export { SolverError, AuthenticationError, QuoteError, QuoteExpiredError, ExecutionError, UnsupportedChainError, TimeoutError, InsufficientLiquidityError } from './errors.js';
export { formatAmount, parseAmount, shortenAddress, getExplorerUrl, isValidChain, retry } from './utils.js';

const DEFAULT_API = 'https://api.solver.trade';

export class Solver {
  constructor({ apiKey, baseUrl = DEFAULT_API } = {}) {
    if (!apiKey) throw new Error('apiKey is required');
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async _request(method, path, body = null) {
    const opts = {
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
      throw new Error(err.error || `Request failed: ${res.status}`);
    }
    return res.json();
  }

  /**
   * Get supported chains
   * @returns {Promise<Chain[]>}
   */
  async chains() {
    return this._request('GET', '/v1/chains');
  }

  /**
   * Search for a token by symbol or address
   * @param {string} query - Token symbol (e.g., "ETH") or contract address
   * @param {string} [chain] - Optional chain filter
   * @returns {Promise<Token[]>}
   */
  async tokens(query, chain) {
    const params = new URLSearchParams({ q: query });
    if (chain) params.set('chain', chain);
    return this._request('GET', `/v1/tokens?${params}`);
  }

  /**
   * Get a quote for a cross-chain swap
   * @param {QuoteParams} params
   * @returns {Promise<Quote>}
   */
  async quote({ fromChain, toChain, fromToken, toToken, amount }) {
    return this._request('POST', '/v1/quote', {
      fromChain,
      toChain,
      fromToken,
      toToken,
      amount,
    });
  }

  /**
   * Execute a quoted swap
   * @param {string} quoteId - Quote ID from quote()
   * @returns {Promise<Trade>}
   */
  async execute(quoteId) {
    return this._request('POST', '/v1/execute', { quoteId });
  }

  /**
   * Check trade status
   * @param {string} tradeId
   * @returns {Promise<TradeStatus>}
   */
  async status(tradeId) {
    return this._request('GET', `/v1/trades/${tradeId}`);
  }

  /**
   * Wait for a trade to complete
   * @param {string} tradeId
   * @param {number} [timeout=300000] - Timeout in ms (default 5 min)
   * @returns {Promise<TradeStatus>}
   */
  async waitForCompletion(tradeId, timeout = 300000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const trade = await this.status(tradeId);
      if (trade.status === 'completed') return trade;
      if (trade.status === 'failed') throw new Error(`Trade failed: ${trade.error}`);
      await new Promise(r => setTimeout(r, 3000));
    }
    throw new Error('Trade timeout');
  }

  /**
   * Register a webhook for trade notifications
   * @param {string} url - Webhook URL
   * @param {string[]} [events] - Event types (default: all)
   */
  async registerWebhook(url, events = ['trade.completed', 'trade.failed', 'deposit.confirmed']) {
    return this._request('POST', '/v1/webhooks', { url, events });
  }
}

export default Solver;
