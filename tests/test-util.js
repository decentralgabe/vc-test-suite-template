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

  for (const test of tests) {
    const testNumber = test.number;
    const inputFile = test.input_file;
    const outputFile = `${testNumber}-${impl}.json`;
    const configString = JSON.stringify(test.config);

    const command = `
docker-compose -f ./implementations/docker-compose.yml \
run -d ${impl} \
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
 * @param {string} testName - The name of the test
 * @return {string} - The result of the test
 */
export async function checkTestResults(impl, testName) {
  const tests = GenericTestMapping[testName];

  for (const test of tests) {
    const outputFile = `./tests/output/${test.number}-${impl}.json`;
    let jsonData;
    try {
      jsonData = await fs.readFileSync(outputFile);
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log(`\nOutput file not found: ${outputFile}\n`);
        return TestResult.skipped;
      }
      console.log(`\nError reading test result: ${err}\n`);
      return TestResult.error;
    }
    const data = await JSON.parse(jsonData);
    if (TestResult[data.result] !== TestResult[test.expected_result]) {
      return TestResult.error;
    }
  }
  return TestResult.success;
}
