package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

type ValidationRequest struct {
	Credential json.RawMessage `json:"credential"`
	Config     json.RawMessage `json:"config"`
}

type ValidationResponse struct {
	Result ValidationResult `json:"result"`
}

func main() {
	http.HandleFunc("/validate", handleValidate)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting server on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func handleValidate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}

	var req ValidationRequest
	if err = json.Unmarshal(body, &req); err != nil {
		http.Error(w, "Failed to parse request JSON", http.StatusBadRequest)
		return
	}

	result, err := validateCredential(req.Credential, req.Config)
	if err != nil {
		http.Error(w, fmt.Sprintf("Validation error: %v", err), http.StatusBadRequest)
		return
	}

	response := ValidationResponse{Result: result}
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Failed to generate response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}

func validateCredential(credentialJSON, configJSON json.RawMessage) (ValidationResult, error) {
	var cred Credential
	if err := json.Unmarshal(credentialJSON, &cred); err != nil {
		return "", fmt.Errorf("error parsing credential: %v", err)
	}

	var config Config
	if err := json.Unmarshal(configJSON, &config); err != nil {
		return "", fmt.Errorf("error parsing config: %v", err)
	}

	switch config.Check {
	case "identifier":
		return validateIdentifier(cred.ID), nil
	case "type":
		return validateType(cred.Type, config.ExpectedType), nil
	case "issuance_date":
		return validateIssuanceDate(cred.IssuanceDate), nil
	default:
		return "", fmt.Errorf("unknown check type: %s", config.Check)
	}
}
