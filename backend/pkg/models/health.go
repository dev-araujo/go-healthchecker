package models

type HealthURL struct {
	URL        string `json:"url"`
	IsUp       bool   `json:"isUp"`
	StatusCode int    `json:"statusCode"`
	StatusText string `json:"statusText"`
	LatencyMs  int64  `json:"latencyMs"`
	Error      string `json:"error,omitempty"`
}
