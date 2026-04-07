# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability in the Solver SDK, please report it responsibly.

**Do not open a public issue.**

Email: security@liquiditysolver.com

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

We will acknowledge receipt within 48 hours and provide a timeline for a fix.

## Webhook Verification

All webhook payloads include an `X-Solver-Signature` header. Verify this header against your API key to ensure the payload is authentic.

```javascript
import crypto from 'crypto';

function verifyWebhook(payload, signature, apiKey) {
  const expected = crypto
    .createHmac('sha256', apiKey)
    .update(JSON.stringify(payload))
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

## Best Practices

- Never expose your API key in client-side code
- Use environment variables for API key storage
- Verify webhook signatures before processing events
- Set reasonable timeouts on trade execution
- Monitor failed trades and implement alerting
