/**
 * Example: Webhook server for Solver trade notifications.
 *
 * Run: node webhook-server.js
 * Then register the webhook URL with solver.registerWebhook()
 */

import http from 'http';

const PORT = 3456;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);

        console.log(`[${new Date().toISOString()}] Event: ${payload.event}`);

        switch (payload.event) {
          case 'trade.completed':
            console.log(`  Trade ${payload.data.tradeId} completed`);
            console.log(`  ${payload.data.fromToken} -> ${payload.data.toToken}`);
            console.log(`  Amount out: ${payload.data.amountOut}`);
            break;

          case 'trade.failed':
            console.log(`  Trade ${payload.data.tradeId} failed`);
            console.log(`  Error: ${payload.data.error}`);
            break;

          case 'deposit.confirmed':
            console.log(`  Deposit confirmed on ${payload.data.chain}`);
            console.log(`  Amount: ${payload.data.amount} ${payload.data.token}`);
            console.log(`  TX: ${payload.data.txHash}`);
            break;

          default:
            console.log(`  Unknown event:`, payload);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ received: true }));
      } catch (err) {
        console.error('Failed to parse webhook:', err.message);
        res.writeHead(400);
        res.end('Bad Request');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Webhook server listening on http://localhost:${PORT}/webhook`);
  console.log('Register this URL with: solver.registerWebhook("http://your-server:3456/webhook")');
});
