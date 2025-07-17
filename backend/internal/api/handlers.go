package api

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/dev-araujo/go-healthchecker/pkg/models"
)

type checkRequest struct {
	URLs []string `json:"urls"`
}

func (s *Server) handleCheck() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
			return
		}

		startTime := time.Now()

		var req checkRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Corpo da requisição JSON inválido", http.StatusBadRequest)
			return
		}

		results := s.checker.RunChecks(req.URLs)
		duration := time.Since(startTime)

		summary := buildSummary(results)

		response := models.APIResponse{
			Status:    "success",
			CheckedAt: startTime.UTC(),
			Duration:  duration.Seconds(),
			Summary:   summary,
			Results:   results,
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			log.Printf("Erro ao serializar resposta JSON: %v", err)
			http.Error(w, "Erro ao criar resposta", http.StatusInternalServerError)
		}
	}
}

func buildSummary(results []models.HealthURL) models.Summary {
	var successful, failed int
	for _, res := range results {
		if res.IsUp {
			successful++
		} else {
			failed++
		}
	}
	return models.Summary{
		Total:      len(results),
		Successful: successful,
		Failed:     failed,
	}
}
