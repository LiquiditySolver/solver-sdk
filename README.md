<div align="center">
  <img src="https://raw.githubusercontent.com/LiquiditySolver/solver-sdk/main/assets/logo.png" width="80" />
  <h1>@solver/sdk</h1>
  <p><strong>Cross-chain liquidity solver.</strong> Deposit USDC on any chain, buy any coin.</p>
  <p>Never bridge again.</p>

  <br />

  [![MIT License](https://img.shields.io/badge/license-MIT-white.svg?style=flat-square)](LICENSE)
  [![npm](https://img.shields.io/badge/npm-@solver/sdk-white.svg?style=flat-square)](https://www.npmjs.com/package/@solver/sdk)
  [![Chains](https://img.shields.io/badge/chains-8-white.svg?style=flat-square)](#supported-chains)

</div>

---

## What is Solver?

Solver is an open-source cross-chain liquidity protocol. Any trading platform, DEX, or app can integrate the SDK to offer seamless multi-chain swaps. Users deposit USDC on one chain and trade any token on any other chain. The protocol handles bridging, routing, and execution.

**Not another frontend.** Solver is infrastructure. Import it, ship cross-chain trading in an afternoon.

## Install

```bash
npm install @solver/sdk
```

```bash
yarn add @solver/sdk
```

```bash
pnpm add @solver/sdk
```

## Quick Start

```javascript
import { Solver } from '@solver/sdk';

const solver = new Solver({ apiKey: 'your-api-key' });

// 1. Get a quote
const quote = await solver.quote({
  fromChain: 'base',
  toChain: 'bsc',
  fromToken: 'USDC',
  toToken: 'BNB',
  amount: '100',
});

// 2. Execute the swap
const trade = await solver.execute(quote.id);

// 3. Wait for completion
const result = await solver.waitForCompletion(trade.id);
console.log(result.status);    // 'completed'
console.log(result.amountOut); // tokens received
```

## How It Works

```
Your Platform  -->  Solver SDK  -->  Solver API
                                        |
                                   +---------+
                                   |         |
                                 LI.FI    Socket    (Bridge Aggregators)
                                   |         |
                                   +---------+
                                        |
                                  DEX Aggregators
                                  (1inch, Jupiter)
                                        |
                                  Destination Chain
```

1. **Quote** - SDK finds the optimal route across bridges and DEXs
2. **Execute** - One call handles approval, bridging, and swapping
3. **Settle** - Tokens delivered to destination. Webhooks notify on completion.

## API Reference

### `new Solver({ apiKey, baseUrl? })`

Initialize the client.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `apiKey` | `string` | Yes | Your API key |
| `baseUrl` | `string` | No | Custom API URL (default: `https://api.solver.trade`) |

---

### `solver.quote(params)`

Get a cross-chain swap quote.

```javascript
const quote = await solver.quote({
  fromChain: 'base',       // Source chain
  toChain: 'bsc',          // Destination chain
  fromToken: 'USDC',       // Input token
  toToken: 'BNB',          // Output token
  amount: '100',           // Amount (human-readable)
});
```

Returns: `{ id, amountIn, amountOut, fee, route, expiresAt }`

---

### `solver.execute(quoteId)`

Execute a quoted swap.

```javascript
const trade = await solver.execute(quote.id);
```

Returns: `{ id, status, createdAt }`

---

### `solver.status(tradeId)`

Check trade status.

```javascript
const trade = await solver.status(trade.id);
// trade.status: 'pending' | 'bridging' | 'swapping' | 'completed' | 'failed'
```

---

### `solver.waitForCompletion(tradeId, timeout?)`

Poll until a trade settles. Default timeout: 5 minutes.

```javascript
const result = await solver.waitForCompletion(trade.id);
```

---

### `solver.chains()`

List supported chains.

```javascript
const chains = await solver.chains();
// [{ key: 'base', name: 'Base', chainId: 8453, type: 'evm' }, ...]
```

---

### `solver.tokens(query, chain?)`

Search tokens by symbol or address.

```javascript
const tokens = await solver.tokens('BNB');
const usdc = await solver.tokens('USDC', 'base');
```

---

### `solver.registerWebhook(url, events?)`

Subscribe to trade lifecycle events.

```javascript
await solver.registerWebhook('https://your-app.com/hook', [
  'trade.completed',
  'trade.failed',
  'deposit.confirmed',
]);
```

## Supported Chains

| Chain | Type | Chain ID |
|-------|------|----------|
| Ethereum | EVM | 1 |
| Base | EVM | 8453 |
| Arbitrum | EVM | 42161 |
| Optimism | EVM | 10 |
| Polygon | EVM | 137 |
| BSC | EVM | 56 |
| Avalanche | EVM | 43114 |
| Solana | SVM | - |

## Fees

Flat **0.3%** per swap. Shown upfront in every quote. No hidden costs. The `amountOut` in the quote is the final amount after all fees (Solver fee + bridge fees + gas).

## Examples

The SDK is JavaScript/TypeScript, but the REST API works with any language. See [`/examples`](./examples):

### JavaScript / TypeScript

- **[basic.js](./examples/basic.js)** - Simple swap flow
- **[multi-chain-swap.js](./examples/multi-chain-swap.js)** - Portfolio rebalance across chains
- **[quote-comparison.js](./examples/quote-comparison.js)** - Find the cheapest route
- **[webhook-server.js](./examples/webhook-server.js)** - Webhook listener for trade events

### Python

- **[solver.py](./examples/python/solver.py)** - Full swap flow using `requests`

```bash
cd examples/python && pip install -r requirements.txt && python solver.py
```

### Go

- **[main.go](./examples/go/main.go)** - Full swap flow using `net/http`

```bash
cd examples/go && go run main.go
```

### Rust

- **[main.rs](./examples/rust/main.rs)** - Full swap flow using `reqwest`

```bash
cd examples/rust && cargo run
```

## TypeScript Support

Full type definitions included out of the box. No additional `@types` package needed.

```typescript
import { Solver, type Quote, type Trade, TradeStatus } from '@solver/sdk';

const solver = new Solver({ apiKey: 'key' });
const quote: Quote = await solver.quote({ ... });
const trade: Trade = await solver.execute(quote.id);

if (trade.status === TradeStatus.COMPLETED) {
  console.log(trade.amountOut);
}
```

## Project Structure

```
src/
  index.js        SDK client
  index.d.ts      TypeScript type definitions
  types.js        Enums and constants
  errors.js       Custom error classes
  utils.js        Helpers (formatting, retry, explorer URLs)
  constants.js    Chain configs, endpoints, defaults
examples/
  basic.js              JS - Simple swap
  multi-chain-swap.js   JS - Portfolio rebalance
  quote-comparison.js   JS - Find cheapest route
  webhook-server.js     JS - Webhook listener
  python/solver.py      Python - Full swap flow
  go/main.go            Go - Full swap flow
  rust/main.rs          Rust - Full swap flow
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting and webhook verification.

## License

[MIT](LICENSE)

---

<div align="center">
  <sub>Built by <a href="https://github.com/LiquiditySolver">LiquiditySolver</a></sub>
</div>
