package api

import (
	"net/http"

	"github.com/dev-araujo/go-healthchecker/internal/healthcheck"
)

type Server struct {
	router  *http.ServeMux
	checker healthcheck.Checker
}

func NewServer(checker healthcheck.Checker) *Server {
	server := &Server{
		router:  http.NewServeMux(),
		checker: checker,
	}
	server.registerRoutes()
	return server
}

func (s *Server) Router() http.Handler {
	return CorsMiddleware(s.router)
}

func (s *Server) registerRoutes() {
	s.router.HandleFunc("/check", s.handleCheck())
}
