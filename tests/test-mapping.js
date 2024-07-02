export const TestResult = {
  success: 'success',
  failure: 'failure',
  indeterminate: 'indeterminate',
  error: 'error',
};

export const GenericTestMapping = {
  'Requirement 1: The credential must have a valid identifier': [
    {
      'number': 1,
      'input_file': 'valid-credential.json',
      'config': {'check': 'identifier'},
      'description': 'Credential has a valid identifier',
      'expected_result': TestResult.success,
    },
    {
      'number': 2,
      'input_file': 'invalid-identifier-credential.json',
      'config': {'check': 'identifier'},
      'description': 'Credential has an invalid identifier',
      'expected_result': TestResult.failure,
    },
  ],
  'Requirement 2: The credential must have the correct type': [
    {
      'number': 3,
      'input_file': 'valid-credential.json',
      'config': {'check': 'type', 'expected_type': 'VerifiableCredential'},
      'description': 'Credential has the correct type',
      'expected_result': TestResult.success,
    },
    {
      'number': 4,
      'input_file': 'invalid-type-credential.json',
      'config': {'check': 'type', 'expected_type': 'VerifiableCredential'},
      'description': 'Credential has an incorrect type',
      'expected_result': TestResult.failure,
    },
  ],
  'Requirement 3: The credential must have a valid issuance date': [
    {
      'number': 5,
      'input_file': 'valid-credential.json',
      'config': {'check': 'issuance_date'},
      'description': 'Credential has a valid issuance date',
      'expected_result': TestResult.success,
    },
    {
      'number': 6,
      'input_file': 'invalid-issuance-date-credential.json',
      'config': {'check': 'issuance_date'},
      'description': 'Credential has an invalid issuance date',
      'expected_result': TestResult.failure,
    },
  ],
};
