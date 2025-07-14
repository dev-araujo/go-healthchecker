package checker

import (
	"net/http"
	"strings"
	"time"
)

type Result struct {
	URL        string `json:"url"`
	IsUp       bool   `json:"isUp"`
	StatusCode int    `json:"statusCode"`
	StatusText string `json:"statusText"`
	LatencyMs  int64  `json:"latencyMs"`
	Error      string `json:"error,omitempty"`
}

func RunChecks(urls []string) []Result {
	resultsChannel := make(chan Result)
	var results []Result

	for _, url := range urls {
		go checkURL(url, resultsChannel)
	}

	for i := 0; i < len(urls); i++ {
		result := <-resultsChannel
		results = append(results, result)
	}

	return results
}

func checkURL(url string, ch chan<- Result) {
	startTime := time.Now()

	resp, err := http.Get(url)
	latency := time.Since(startTime).Round(time.Millisecond)

	if err != nil {
		ch <- Result{URL: url,
			IsUp:       false,
			StatusCode: 0,
			StatusText: "Network Error",
			LatencyMs:  latency.Milliseconds(),
			Error:      err.Error()}
		return
	}
	defer resp.Body.Close()
	isUp := resp.StatusCode >= 200 && resp.StatusCode <= 299
	statusText := strings.TrimPrefix(resp.Status, string(resp.StatusCode)+" ")

	result := Result{
		URL:        url,
		IsUp:       isUp,
		StatusCode: resp.StatusCode,
		StatusText: statusText,
		LatencyMs:  latency.Milliseconds(),
	}

	if !isUp {
		result.Error = resp.Status
	}

	ch <- result
}
