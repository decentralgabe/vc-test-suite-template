import chai from 'chai';
import {getImplementationFeatures, implementationsWithFeatures} from '../implementations/index.js';
import {checkTestResults, generateTestResults} from './test-util.js';
import {GenericTestMapping} from './test-mapping.js';

const should = chai.should();

describe('Generic Test Suite', function() {
  const impls = implementationsWithFeatures();
  console.log('Implementations with features:', JSON.stringify(impls, null, 2));

  const implNames = impls.map((i) => i.name);
  console.log('Implementation names:', implNames);

  this.matrix = true;
  this.report = true;
  this.implemented = [...implNames];
  this.rowLabel = 'Test Name';
  this.columnLabel = 'Implementation';

  for (const i of impls) {
    describe(i.name, function() {
      const features = getImplementationFeatures(i.name);
      console.log(`Features for ${i.name}:`, JSON.stringify(features, null, 2));

      for (const [testName, tests] of Object.entries(GenericTestMapping)) {
        describe(testName, function() {
          for (const test of tests) {
            const requiredFeature = test.config.check;

            it(test.description, async function() {
              if (!features[requiredFeature]) {
                console.log(`Skipping test "${test.description}" for ${i.name} due to missing feature: ${requiredFeature}`);
                this.skip();
                return;
              }

              console.log(`Running test: ${test.description} for implementation: ${i.name}`);
              await generateTestResults(i.name, testName);
              this.test.cell = {columnId: i.name, rowId: `${testName} - ${test.description}`};
              const result = await checkTestResults(i.name, test);
              console.log(`Test result for ${i.name} - ${testName} - ${test.description}: ${result}`);
              should.equal(result, test.expected_result);

              // Log the test result in a format that matches the report generator's expectations
              console.log(`Reporter data: ${this.test.cell.columnId},${this.test.cell.rowId},${result}`);
            });
          }
        });
      }
    });
  }
});
