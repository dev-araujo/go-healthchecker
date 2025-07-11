package main

import (
	"fmt"
	"log"
	"strings"

	"github.com/dev-araujo/go-healthchecker/checker"
	"github.com/dev-araujo/go-healthchecker/config"
)

func main() {
	separator := "="
	cfg, err := config.Load("config.json")
	if err != nil {
		log.Fatalf("Erro fatal ao carregar configuração: %v", err)
	}

	fmt.Println("Iniciando verificação de saúde dos serviços...")
	fmt.Println(strings.Repeat(separator, 45))

	results := checker.RunChecks(cfg.URLs)

	handleResults(results)

	fmt.Println("Verificação concluída.")
}

func handleResults(results []checker.Result) {
	for _, result := range results {
		fmt.Printf("URL: %s\n", result.URL)
		fmt.Printf("Status: %s\n", result.Status)
		fmt.Printf("Latência: %v\n", result.Latency)
		fmt.Println(strings.Repeat("=", 45))
	}
}
