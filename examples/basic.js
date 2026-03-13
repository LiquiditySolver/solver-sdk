import { Solver } from '../src/index.js';

const solver = new Solver({ apiKey: 'your-api-key' });

async function main() {
  // Get supported chains
  const chains = await solver.chains();
  console.log('Supported chains:', chains);

  // Get a quote: swap 100 USDC from Base to BNB on BSC
  const quote = await solver.quote({
    fromChain: 'base',
    toChain: 'bsc',
    fromToken: 'USDC',
    toToken: 'BNB',
    amount: '100',
  });

  console.log('Quote:', {
    amountOut: quote.amountOut,
    fee: quote.fee,
    route: quote.route,
    estimatedTime: quote.estimatedTime,
  });

  // Execute the swap
  const trade = await solver.execute(quote.id);
  console.log('Trade started:', trade.id);

  // Wait for completion
  const result = await solver.waitForCompletion(trade.id);
  console.log('Trade complete:', result);
}

main().catch(console.error);
