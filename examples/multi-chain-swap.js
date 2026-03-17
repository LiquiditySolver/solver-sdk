/**
 * Example: Multi-chain portfolio rebalance.
 *
 * Takes USDC on Base and distributes it across multiple chains/tokens.
 */

import { Solver } from '../src/index.js';

const solver = new Solver({ apiKey: 'your-api-key' });

const PORTFOLIO = [
  { toChain: 'bsc', toToken: 'BNB', amount: '200' },
  { toChain: 'ethereum', toToken: 'ETH', amount: '150' },
  { toChain: 'arbitrum', toToken: 'ARB', amount: '100' },
  { toChain: 'base', toToken: 'AERO', amount: '50' },
];

async function rebalance() {
  console.log('Starting portfolio rebalance...\n');

  const results = [];

  for (const position of PORTFOLIO) {
    console.log(`Swapping $${position.amount} USDC -> ${position.toToken} on ${position.toChain}...`);

    try {
      // Get quote
      const quote = await solver.quote({
        fromChain: 'base',
        fromToken: 'USDC',
        ...position,
      });

      console.log(`  Quote: ${quote.amountOut} ${position.toToken} (fee: $${quote.fee})`);
      console.log(`  Route: ${quote.route.bridge} -> ${quote.route.dex}`);

      // Execute
      const trade = await solver.execute(quote.id);
      console.log(`  Trade ID: ${trade.id}`);

      // Wait
      const result = await solver.waitForCompletion(trade.id);
      console.log(`  Done: ${result.amountOut} ${position.toToken}\n`);

      results.push({ ...position, amountOut: result.amountOut, status: 'completed' });

    } catch (err) {
      console.error(`  Failed: ${err.message}\n`);
      results.push({ ...position, status: 'failed', error: err.message });
    }
  }

  // Summary
  console.log('=== Rebalance Summary ===\n');
  console.log('Token   | Chain     | Amount In | Amount Out | Status');
  console.log('--------|-----------|-----------|------------|-------');
  for (const r of results) {
    const status = r.status === 'completed' ? 'OK' : 'FAIL';
    console.log(`${r.toToken.padEnd(7)} | ${r.toChain.padEnd(9)} | $${r.amount.padEnd(8)} | ${(r.amountOut || '-').toString().padEnd(10)} | ${status}`);
  }
}

rebalance().catch(console.error);
