import * as fs from 'fs';
import shell from 'shelljs';
import {GenericTestMapping, TestResult} from './test-mapping.js';

/**
 * generateTestResults is a function that runs the tests for a given implementation
 * @param {string} impl - The name of the implementation
 * @param {string} testName - The name of the test
 * @return {Promise<void>} - A promise that resolves after the tests are run
 */
export async function generateTestResults(impl, testName) {
  const tests = GenericTestMapping[testName];

  for (const testData of tests) {
    const testNumber = testData.number;
    const inputFile = testData.input_file;
    const outputFile = `${testNumber}-${impl}.json`;
    const configString = JSON.stringify(testData.config);

    const command = `
docker-compose -f ./implementations/docker-compose.yml \
run --rm ${impl} \
validate \
--input /tests/input/${inputFile} \
--config '${configString}' \
--output /tests/output/${outputFile}
`;

    console.log(`${command}`);
    const {code, stdout} = await shell.exec(command, {silent: false});
    if (code !== 0) {
      console.warn(stdout);
    }
  }
  await sleep(150);
}

/**
 * sleep is a function that waits for a given amount of time
 * @param {number} ms - The amount of time to wait in milliseconds
 * @return {Promise<unknown>} - A promise that resolves after the given amount of time
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * checkTestResults is a function that reads the output of the tests
 * @param {string} impl - The name of the implementation
 * @param {Object} testData - Data associated with the test
 * @return {string} - The result of the test
 */
export async function checkTestResults(impl, testData) {
  const outputFile = `./tests/output/${testData.number}-${impl}.json`;
  try {
    const jsonData = await fs.promises.readFile(outputFile, 'utf8');
    const data = JSON.parse(jsonData);
    // Map the result to match TestResult enum
    switch (data.result) {
      case 'success':
        return TestResult.success;
      case 'failure':
        return TestResult.failure;
      case 'indeterminate':
        return TestResult.indeterminate;
      default:
        return TestResult.error;
    }
  } catch (err) {
    console.log(`\nError reading or parsing test result: ${err}\n`);
    return TestResult.error;
  }
}
