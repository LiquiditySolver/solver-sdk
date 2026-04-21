/**
 * Example: Compare quotes across different source chains.
 *
 * Finds the cheapest chain to swap from for a given destination token.
 */

import { Solver } from '../src/index.js';

const solver = new Solver({ apiKey: 'your-api-key' });

const SOURCE_CHAINS = ['ethereum', 'base', 'arbitrum', 'optimism', 'polygon'];

async function findBestRoute(toChain, toToken, amount) {
  console.log(`Finding best route for $${amount} USDC -> ${toToken} on ${toChain}\n`);

  const quotes = [];

  for (const fromChain of SOURCE_CHAINS) {
    try {
      const quote = await solver.quote({
        fromChain,
        toChain,
        fromToken: 'USDC',
        toToken,
        amount,
      });

      quotes.push({
        fromChain,
        amountOut: quote.amountOut,
        fee: quote.fee,
        time: quote.route.estimatedTime,
        bridge: quote.route.bridge,
      });

      console.log(`  ${fromChain.padEnd(10)} -> ${quote.amountOut} ${toToken} (fee: $${quote.fee}, ~${quote.route.estimatedTime}s)`);
    } catch (err) {
      console.log(`  ${fromChain.padEnd(10)} -> unavailable (${err.message})`);
    }
  }

  if (quotes.length === 0) {
    console.log('\nNo routes available.');
    return null;
  }

  // Sort by output amount (highest first)
  quotes.sort((a, b) => parseFloat(b.amountOut) - parseFloat(a.amountOut));

  const best = quotes[0];
  console.log(`\nBest route: ${best.fromChain} -> ${best.amountOut} ${toToken} via ${best.bridge}`);

  return best;
}

findBestRoute('ethereum', 'ETH', '500').catch(console.error);
