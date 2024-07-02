package main

import (
	"encoding/json"
	"fmt"
	"net/url"
	"os"
	"time"
)

type Credential struct {
	ID                string                 `json:"id"`
	Type              []string               `json:"type"`
	IssuanceDate      time.Time              `json:"issuanceDate"`
	CredentialSubject map[string]interface{} `json:"credentialSubject"`
}

type Config struct {
	Check        string `json:"check"`
	ExpectedType string `json:"expected_type,omitempty"`
}

type ValidationResult string

const (
	Success       ValidationResult = "success"
	Failure       ValidationResult = "failure"
	Indeterminate ValidationResult = "indeterminate"
)

func ValidateCredential(inputFile, configStr, outputFile string) error {
	// Read and parse the input credential
	credBytes, err := os.ReadFile(inputFile)
	if err != nil {
		return fmt.Errorf("error reading input file: %v", err)
	}

	var cred Credential
	if err = json.Unmarshal(credBytes, &cred); err != nil {
		return fmt.Errorf("error parsing credential: %v", err)
	}

	// Parse the config
	var config Config
	if err = json.Unmarshal([]byte(configStr), &config); err != nil {
		return fmt.Errorf("error parsing config: %v", err)
	}

	// Perform the validation based on the config
	var result ValidationResult
	switch config.Check {
	case "identifier":
		result = validateIdentifier(cred.ID)
	case "type":
		result = validateType(cred.Type, config.ExpectedType)
	case "issuance_date":
		result = validateIssuanceDate(cred.IssuanceDate)
	default:
		return fmt.Errorf("unknown check type: %s", config.Check)
	}

	// Write the result to the output file
	output := struct {
		Result ValidationResult `json:"result"`
	}{Result: result}

	outputBytes, err := json.Marshal(output)
	if err != nil {
		return fmt.Errorf("error marshaling output: %v", err)
	}

	if err = os.WriteFile(outputFile, outputBytes, 0644); err != nil {
		return fmt.Errorf("error writing output file: %v", err)
	}

	return nil
}

func validateIdentifier(id string) ValidationResult {
	if _, err := url.Parse(id); err != nil {
		return Failure
	}
	return Success
}

func validateType(types []string, expectedType string) ValidationResult {
	for _, t := range types {
		if t == expectedType {
			return Success
		}
	}
	return Failure
}

func validateIssuanceDate(date time.Time) ValidationResult {
	if date.IsZero() {
		return Failure
	}
	return Success
}
