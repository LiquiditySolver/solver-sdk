"""
Solver SDK - Python Example
Cross-chain swap via the Solver REST API.
"""

import requests
import time

API_BASE = "https://api.solver.trade"
API_KEY = "your-api-key"

headers = {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY,
}


def get_chains():
    """Get all supported chains."""
    res = requests.get(f"{API_BASE}/v1/chains", headers=headers)
    res.raise_for_status()
    return res.json()


def get_quote(from_chain: str, to_chain: str, from_token: str, to_token: str, amount: str):
    """Get a cross-chain swap quote."""
    res = requests.post(f"{API_BASE}/v1/quote", headers=headers, json={
        "fromChain": from_chain,
        "toChain": to_chain,
        "fromToken": from_token,
        "toToken": to_token,
        "amount": amount,
    })
    res.raise_for_status()
    return res.json()


def execute(quote_id: str):
    """Execute a quoted swap."""
    res = requests.post(f"{API_BASE}/v1/execute", headers=headers, json={
        "quoteId": quote_id,
    })
    res.raise_for_status()
    return res.json()


def get_status(trade_id: str):
    """Check trade status."""
    res = requests.get(f"{API_BASE}/v1/trades/{trade_id}", headers=headers)
    res.raise_for_status()
    return res.json()


def wait_for_completion(trade_id: str, timeout: int = 300):
    """Poll until trade completes or fails."""
    start = time.time()
    while time.time() - start < timeout:
        trade = get_status(trade_id)
        if trade["status"] == "completed":
            return trade
        if trade["status"] == "failed":
            raise Exception(f"Trade failed: {trade.get('error', 'unknown')}")
        time.sleep(3)
    raise TimeoutError(f"Trade {trade_id} timed out")


def main():
    # List chains
    chains = get_chains()
    print(f"Supported chains: {[c['name'] for c in chains]}")

    # Get quote: 100 USDC on Base -> BNB on BSC
    quote = get_quote(
        from_chain="base",
        to_chain="bsc",
        from_token="USDC",
        to_token="BNB",
        amount="100",
    )
    print(f"Quote: {quote['amountOut']} BNB (fee: ${quote['fee']})")

    # Execute
    trade = execute(quote["id"])
    print(f"Trade started: {trade['id']}")

    # Wait
    result = wait_for_completion(trade["id"])
    print(f"Done: {result['amountOut']} BNB")


if __name__ == "__main__":
    main()
