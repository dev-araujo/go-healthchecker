package main

import (
	"log"
	"net/http"

	"github.com/dev-araujo/go-healthchecker/internal/api"
	"github.com/dev-araujo/go-healthchecker/internal/healthcheck"
)

func main() {
	checkerService := healthcheck.NewChecker()
	server := api.NewServer(checkerService)

	log.Println("Server on http://localhost:8080")
	if err := http.ListenAndServe(":8080", server.Router()); err != nil {
		log.Fatalf("Server error: %v", err)
	}

}
