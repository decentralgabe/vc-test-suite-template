package main

import (
	"fmt"
	"io/ioutil"
	"os"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"github.com/TBD54566975/ssi-sdk/credential"
)

func main() {
	if len(os.Args) < 5 {
		logrus.Fatal("Not enough arguments.")
	}

	format := os.Args[2]
	schemaPath := os.Args[4]
	credentialPath := os.Args[6]
	outputPath := os.Args[7]

	schema, err := loadFile(schemaPath)
	if err != nil {
		logrus.Fatal(errors.Wrap(err, "loading schema"))
	}

	credential, err := loadFile(credentialPath)
	if err != nil {
		logrus.Fatal(errors.Wrap(err, "loading credential"))
	}

	// Perform validation (dummy validation in this example)
	if format == "JsonSchema" {
		if validateJSONSchema(schema, credential) {
			writeResult(outputPath, "success")
		} else {
			writeResult(outputPath, "error")
		}
	} else {
		logrus.Fatal("Unsupported format.")
	}
}

func loadFile(path string) ([]byte, error) {
	return ioutil.ReadFile(path)
}

func validateJSONSchema(schema, credential []byte) bool {
	// Dummy validation logic
	return true
}

func writeResult(path, result string) {
	f, err := os.Create(path)
	if err != nil {
		logrus.Fatal(errors.Wrap(err, "creating result file"))
	}
	defer f.Close()
	_, err = f.WriteString(result)
	if err != nil {
		logrus.Fatal(errors.Wrap(err, "writing result"))
	}
	fmt.Println("Result written to", path)
}
