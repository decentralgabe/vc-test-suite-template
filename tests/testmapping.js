export const TestResult = {
  success: 'success',
  failure: 'failure',
  indeterminate: 'indeterminate',
  error: 'error',
};

export const SampleTestMapping = {
  'red': [
    {
      'number': 1,
      'cred_number': 1,
      'schema_number': 1,
      'description': 'URL identifies associated schema',
      'expected_result': TestResult.success,
    },
    {
      'number': 2,
      'cred_number': 1,
      'schema_number': 2,
      'description': 'URL does not identify associated schema',
      'expected_result': TestResult.failure,
    },
    {
      'number': 3,
      'cred_number': 1,
      'schema_number': 2,
      'description': 'URL does not identify associated schema',
      'expected_result': TestResult.failure,
    },
  ],
  'blue': [
    {
      'number': 3,
      'cred_number': 1,
      'schema_number': 1,
      'description': 'type property is JsonSchema',
      'expected_result': TestResult.success,
    },
    {
      'number': 4,
      'cred_number': 2,
      'schema_number': 1,
      'description': 'type property is not JsonSchema',
      'expected_result': TestResult.failure,
    },
  ]
};
