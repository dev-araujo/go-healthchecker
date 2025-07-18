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
	return corsMiddleware(s.router)
}

func (s *Server) registerRoutes() {
	s.router.HandleFunc("/check", s.handleCheck())
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
