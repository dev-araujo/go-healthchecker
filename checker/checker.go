package checker

import (
	"fmt"
	"net/http"
	"time"
)

type Result struct {
	URL     string
	Status  string
	Latency time.Duration
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
		ch <- Result{URL: url, Status: fmt.Sprintf("Erro: %v", err), Latency: latency}
		return
	}
	defer resp.Body.Close()

	ch <- Result{URL: url, Status: resp.Status, Latency: latency}
}
