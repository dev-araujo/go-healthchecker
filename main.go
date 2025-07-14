package main

import "github.com/dev-araujo/go-healthchecker/api"

func main() {
	server := api.NewServer()
	server.Start(":8080")
}
