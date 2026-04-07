# Contributing to Solver SDK

Thanks for your interest in contributing. Here's how to get started.

## Setup

```bash
git clone https://github.com/LiquiditySolver/solver-sdk.git
cd solver-sdk
npm install
```

## Project Structure

```
src/
  index.js        - Main SDK client class
  types.js        - Type definitions and enums
  errors.js       - Custom error classes
  utils.js        - Utility functions
  constants.js    - Chain configs, API endpoints, defaults
examples/
  basic.js              - Simple swap flow
  multi-chain-swap.js   - Portfolio rebalance
  quote-comparison.js   - Find cheapest route
  webhook-server.js     - Webhook listener
```

## Guidelines

- Keep the SDK lightweight (zero runtime dependencies)
- All public methods should have JSDoc comments
- Error messages should be actionable (tell the user what to do)
- Maintain backward compatibility in minor versions

## Submitting Changes

1. Fork the repo
2. Create a branch (`git checkout -b feature/my-change`)
3. Make your changes
4. Test with the examples
5. Open a PR with a clear description

## Reporting Issues

Open an issue on GitHub with:
- SDK version
- Node.js version
- Code snippet that reproduces the issue
- Expected vs actual behavior
