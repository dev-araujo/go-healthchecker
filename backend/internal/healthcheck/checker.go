package healthcheck

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/dev-araujo/go-healthchecker/pkg/models"
)

type Checker interface {
	RunChecks(urls []string) []models.HealthURL
}

type checker struct{}

func NewChecker() Checker {
	return &checker{}
}

func (c *checker) RunChecks(urls []string) []models.HealthURL {
	resultsChannel := make(chan models.HealthURL, len(urls))
	for _, url := range urls {
		go checkURL(url, resultsChannel)
	}

	results := make([]models.HealthURL, 0, len(urls))
	for i := 0; i < len(urls); i++ {
		results = append(results, <-resultsChannel)
	}

	return results
}

func checkURL(url string, ch chan<- models.HealthURL) {
	startTime := time.Now()

	resp, err := http.Get(url)
	latency := time.Since(startTime).Round(time.Millisecond)

	if err != nil {
		ch <- models.HealthURL{
			URL:        url,
			IsUp:       false,
			StatusCode: 0,
			StatusText: "Network Error",
			LatencyMs:  latency.Milliseconds(),
			Error:      err.Error(),
		}
		return
	}
	defer resp.Body.Close()

	isUp := resp.StatusCode >= 200 && resp.StatusCode <= 299
	statusText := strings.TrimPrefix(resp.Status, strconv.Itoa(resp.StatusCode)+" ")

	result := models.HealthURL{
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
