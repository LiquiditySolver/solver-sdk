// Solver SDK - Go Example
// Cross-chain swap via the Solver REST API.
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

const (
	apiBase = "https://api.solver.trade"
	apiKey  = "your-api-key"
)

type Quote struct {
	ID        string `json:"id"`
	AmountIn  string `json:"amountIn"`
	AmountOut string `json:"amountOut"`
	Fee       string `json:"fee"`
}

type Trade struct {
	ID        string `json:"id"`
	Status    string `json:"status"`
	AmountOut string `json:"amountOut"`
	Error     string `json:"error"`
}

func request(method, path string, body interface{}) ([]byte, error) {
	var reader io.Reader
	if body != nil {
		data, _ := json.Marshal(body)
		reader = bytes.NewReader(data)
	}

	req, err := http.NewRequest(method, apiBase+path, reader)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-API-Key", apiKey)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	return io.ReadAll(resp.Body)
}

func getQuote(fromChain, toChain, fromToken, toToken, amount string) (*Quote, error) {
	data, err := request("POST", "/v1/quote", map[string]string{
		"fromChain": fromChain,
		"toChain":   toChain,
		"fromToken": fromToken,
		"toToken":   toToken,
		"amount":    amount,
	})
	if err != nil {
		return nil, err
	}
	var q Quote
	json.Unmarshal(data, &q)
	return &q, nil
}

func execute(quoteID string) (*Trade, error) {
	data, err := request("POST", "/v1/execute", map[string]string{
		"quoteId": quoteID,
	})
	if err != nil {
		return nil, err
	}
	var t Trade
	json.Unmarshal(data, &t)
	return &t, nil
}

func getStatus(tradeID string) (*Trade, error) {
	data, err := request("GET", "/v1/trades/"+tradeID, nil)
	if err != nil {
		return nil, err
	}
	var t Trade
	json.Unmarshal(data, &t)
	return &t, nil
}

func waitForCompletion(tradeID string) (*Trade, error) {
	deadline := time.Now().Add(5 * time.Minute)
	for time.Now().Before(deadline) {
		trade, err := getStatus(tradeID)
		if err != nil {
			return nil, err
		}
		if trade.Status == "completed" {
			return trade, nil
		}
		if trade.Status == "failed" {
			return nil, fmt.Errorf("trade failed: %s", trade.Error)
		}
		time.Sleep(3 * time.Second)
	}
	return nil, fmt.Errorf("trade %s timed out", tradeID)
}

func main() {
	// Get quote: 100 USDC on Base -> BNB on BSC
	quote, err := getQuote("base", "bsc", "USDC", "BNB", "100")
	if err != nil {
		panic(err)
	}
	fmt.Printf("Quote: %s BNB (fee: $%s)\n", quote.AmountOut, quote.Fee)

	// Execute
	trade, err := execute(quote.ID)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Trade started: %s\n", trade.ID)

	// Wait
	result, err := waitForCompletion(trade.ID)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Done: %s BNB\n", result.AmountOut)
}
