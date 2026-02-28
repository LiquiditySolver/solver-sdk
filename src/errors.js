/**
 * Base error class for Solver SDK errors.
 */
export class SolverError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'SolverError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Thrown when the API returns an authentication error.
 */
export class AuthenticationError extends SolverError {
  constructor(message = 'Invalid or missing API key') {
    super(message, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}

/**
 * Thrown when a quote request fails.
 */
export class QuoteError extends SolverError {
  constructor(message, details) {
    super(message, 'QUOTE_ERROR', details);
    this.name = 'QuoteError';
  }
}

/**
 * Thrown when a quote has expired before execution.
 */
export class QuoteExpiredError extends SolverError {
  constructor(quoteId) {
    super(`Quote ${quoteId} has expired. Request a new quote.`, 'QUOTE_EXPIRED');
    this.name = 'QuoteExpiredError';
    this.quoteId = quoteId;
  }
}

/**
 * Thrown when trade execution fails.
 */
export class ExecutionError extends SolverError {
  constructor(message, tradeId, details) {
    super(message, 'EXECUTION_ERROR', details);
    this.name = 'ExecutionError';
    this.tradeId = tradeId;
  }
}

/**
 * Thrown when an unsupported chain is used.
 */
export class UnsupportedChainError extends SolverError {
  constructor(chain) {
    super(`Unsupported chain: ${chain}`, 'UNSUPPORTED_CHAIN');
    this.name = 'UnsupportedChainError';
    this.chain = chain;
  }
}

/**
 * Thrown when a trade status check times out.
 */
export class TimeoutError extends SolverError {
  constructor(tradeId) {
    super(`Trade ${tradeId} timed out. It may still complete - check status manually.`, 'TIMEOUT');
    this.name = 'TimeoutError';
    this.tradeId = tradeId;
  }
}

/**
 * Thrown when there is insufficient liquidity for the requested route.
 */
export class InsufficientLiquidityError extends SolverError {
  constructor(fromChain, toChain, amount) {
    super(`Insufficient liquidity for ${amount} on ${fromChain} -> ${toChain}`, 'INSUFFICIENT_LIQUIDITY');
    this.name = 'InsufficientLiquidityError';
  }
}
