package config

import (
	"encoding/json"
	"os"
)

type Config struct {
	URLs []string `json:"urls"`
}

func Load(path string) (*Config, error) {
	configFile, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var config Config
	err = json.Unmarshal(configFile, &config)
	if err != nil {
		return nil, err
	}

	return &config, nil
}
