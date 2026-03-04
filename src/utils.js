/**
 * Validate a chain key against supported chains.
 * @param {string} chain - Chain key to validate
 * @param {string[]} supported - List of supported chain keys
 * @returns {boolean}
 */
export function isValidChain(chain) {
  const SUPPORTED = ['ethereum', 'base', 'arbitrum', 'optimism', 'polygon', 'bsc', 'avalanche', 'solana'];
  return SUPPORTED.includes(chain.toLowerCase());
}

/**
 * Format a token amount from raw units to human-readable.
 * @param {string|bigint} amount - Raw amount
 * @param {number} decimals - Token decimals
 * @returns {string}
 */
export function formatAmount(amount, decimals = 6) {
  const raw = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const whole = raw / divisor;
  const fraction = raw % divisor;
  const fractionStr = fraction.toString().padStart(decimals, '0').replace(/0+$/, '');
  return fractionStr ? `${whole}.${fractionStr}` : whole.toString();
}

/**
 * Parse a human-readable amount to raw units.
 * @param {string} amount - Human-readable amount (e.g., "100.5")
 * @param {number} decimals - Token decimals
 * @returns {string}
 */
export function parseAmount(amount, decimals = 6) {
  const [whole, fraction = ''] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole + paddedFraction).toString();
}

/**
 * Sleep for a given duration.
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff.
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum retries
 * @param {number} baseDelay - Base delay in ms
 * @returns {Promise<*>}
 */
export async function retry(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < maxRetries) {
        await sleep(baseDelay * Math.pow(2, i));
      }
    }
  }
  throw lastError;
}

/**
 * Shorten an address for display.
 * @param {string} address - Full address
 * @param {number} chars - Characters to show on each side
 * @returns {string}
 */
export function shortenAddress(address, chars = 4) {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Get the block explorer URL for a transaction.
 * @param {string} chain - Chain key
 * @param {string} txHash - Transaction hash
 * @returns {string}
 */
export function getExplorerUrl(chain, txHash) {
  const explorers = {
    ethereum: 'https://etherscan.io/tx/',
    base: 'https://basescan.org/tx/',
    arbitrum: 'https://arbiscan.io/tx/',
    optimism: 'https://optimistic.etherscan.io/tx/',
    polygon: 'https://polygonscan.com/tx/',
    bsc: 'https://bscscan.com/tx/',
    avalanche: 'https://snowtrace.io/tx/',
    solana: 'https://solscan.io/tx/',
  };
  return (explorers[chain] || '') + txHash;
}
