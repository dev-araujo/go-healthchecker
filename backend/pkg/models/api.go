package models

import "time"

type APIResponse struct {
	Status    string      `json:"status"`
	CheckedAt time.Time   `json:"checkedAt"`
	Duration  float64     `json:"durationSeconds"`
	Summary   Summary     `json:"summary"`
	Results   []HealthURL `json:"results"`
}

type Summary struct {
	Total      int `json:"total"`
	Successful int `json:"successful"`
	Failed     int `json:"failed"`
}
