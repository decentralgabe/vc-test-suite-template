package main

import (
	"strings"

	schemalib "github.com/TBD54566975/ssi-sdk/credential/schema"
	"github.com/sirupsen/logrus"
)

func ValidateCredentialAgainstSchema(format, schema, credential, output string) error {
	cred, err := getCredentialFromFile(credential)
	if err != nil {
		return err
	}
	s, err := getSchemaFromFile(format, schema)
	if err != nil {
		return err
	}

	if err = schemalib.IsCredentialValidForJSONSchema(*cred, *s, schemalib.VCJSONSchemaType(format)); err != nil {
		logrus.WithError(err).Error("credential is not valid for schema")
		if strings.HasPrefix(err.Error(), "schema version") && strings.HasSuffix(err.Error(), "is not supported") {
			return writeValidationResult(Indeterminate, output)
		}
		return writeValidationResult(Failure, output)
	}

	return writeValidationResult(Success, output)
}
