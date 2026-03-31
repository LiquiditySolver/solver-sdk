// Solver SDK - Rust Example
// Cross-chain swap via the Solver REST API.
//
// Add to Cargo.toml:
//   [dependencies]
//   reqwest = { version = "0.11", features = ["json"] }
//   serde = { version = "1", features = ["derive"] }
//   serde_json = "1"
//   tokio = { version = "1", features = ["full"] }

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

const API_BASE: &str = "https://api.solver.trade";
const API_KEY: &str = "your-api-key";

#[derive(Debug, Deserialize)]
struct Quote {
    id: String,
    #[serde(rename = "amountOut")]
    amount_out: String,
    fee: String,
}

#[derive(Debug, Deserialize)]
struct Trade {
    id: String,
    status: String,
    #[serde(rename = "amountOut")]
    amount_out: Option<String>,
    error: Option<String>,
}

#[derive(Serialize)]
struct QuoteRequest {
    #[serde(rename = "fromChain")]
    from_chain: String,
    #[serde(rename = "toChain")]
    to_chain: String,
    #[serde(rename = "fromToken")]
    from_token: String,
    #[serde(rename = "toToken")]
    to_token: String,
    amount: String,
}

#[derive(Serialize)]
struct ExecuteRequest {
    #[serde(rename = "quoteId")]
    quote_id: String,
}

async fn get_quote(client: &reqwest::Client) -> Result<Quote, Box<dyn std::error::Error>> {
    let quote: Quote = client
        .post(format!("{}/v1/quote", API_BASE))
        .header("X-API-Key", API_KEY)
        .json(&QuoteRequest {
            from_chain: "base".into(),
            to_chain: "bsc".into(),
            from_token: "USDC".into(),
            to_token: "BNB".into(),
            amount: "100".into(),
        })
        .send()
        .await?
        .json()
        .await?;
    Ok(quote)
}

async fn execute(client: &reqwest::Client, quote_id: &str) -> Result<Trade, Box<dyn std::error::Error>> {
    let trade: Trade = client
        .post(format!("{}/v1/execute", API_BASE))
        .header("X-API-Key", API_KEY)
        .json(&ExecuteRequest {
            quote_id: quote_id.into(),
        })
        .send()
        .await?
        .json()
        .await?;
    Ok(trade)
}

async fn wait_for_completion(client: &reqwest::Client, trade_id: &str) -> Result<Trade, Box<dyn std::error::Error>> {
    for _ in 0..100 {
        let trade: Trade = client
            .get(format!("{}/v1/trades/{}", API_BASE, trade_id))
            .header("X-API-Key", API_KEY)
            .send()
            .await?
            .json()
            .await?;

        match trade.status.as_str() {
            "completed" => return Ok(trade),
            "failed" => return Err(format!("Trade failed: {}", trade.error.unwrap_or_default()).into()),
            _ => tokio::time::sleep(std::time::Duration::from_secs(3)).await,
        }
    }
    Err("Trade timed out".into())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();

    // Get quote: 100 USDC on Base -> BNB on BSC
    let quote = get_quote(&client).await?;
    println!("Quote: {} BNB (fee: ${})", quote.amount_out, quote.fee);

    // Execute
    let trade = execute(&client, &quote.id).await?;
    println!("Trade started: {}", trade.id);

    // Wait
    let result = wait_for_completion(&client, &trade.id).await?;
    println!("Done: {} BNB", result.amount_out.unwrap_or_default());

    Ok(())
}
