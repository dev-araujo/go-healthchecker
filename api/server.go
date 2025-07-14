package api

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/dev-araujo/go-healthchecker/checker"
)

type APIResponse struct {
	Status    string           `json:"status"`
	CheckedAt time.Time        `json:"checkedAt"`
	Duration  float64          `json:"durationSeconds"`
	Summary   Summary          `json:"summary"`
	Results   []checker.Result `json:"results"`
}

type Summary struct {
	Total      int `json:"total"`
	Successful int `json:"successful"`
	Failed     int `json:"failed"`
}

type Server struct{}

func NewServer() *Server {
	return &Server{}
}

func (s *Server) Start(addr string) {
	http.HandleFunc("/check", s.checkHandler)

	log.Printf("Servidor escutando em %s\n", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}

func (s *Server) checkHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	startTime := time.Now()

	var requestBody struct {
		URLs []string `json:"urls"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		http.Error(w, "Corpo da requisição JSON inválido", http.StatusBadRequest)
		return
	}

	results := checker.RunChecks(requestBody.URLs)

	duration := time.Since(startTime)

	var summary Summary
	summary.Total = len(results)
	for _, res := range results {
		if res.IsUp {
			summary.Successful++
		} else {
			summary.Failed++
		}
	}

	response := APIResponse{
		Status:    "success",
		CheckedAt: startTime.UTC(),
		Duration:  duration.Seconds(),
		Summary:   summary,
		Results:   results,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Erro ao serializar resposta JSON: %v", err)
	}
}
