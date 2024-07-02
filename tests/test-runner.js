import chai from 'chai';
import {getImplementationFeatures, implementationsWithFeatures} from '../implementations/index.js';
import {checkTestResults, generateTestResults} from './test-util.js';
import {GenericTestMapping, TestResult} from './test-mapping.js';

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

      for (const [testName] of Object.entries(GenericTestMapping)) {
        it(testName, async function() {
          console.log(`Running test: ${testName} for implementation: ${i.name}`);
          await generateTestResults(i.name, testName);
          this.test.cell = {columnId: i.name, rowId: testName};
          const [result] = await Promise.all([checkTestResults(i.name, testName)]);
          should.equal(result, TestResult.success);
        });
      }
    });
  }
});
