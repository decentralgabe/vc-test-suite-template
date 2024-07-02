import chai from 'chai';
import {implementationsWithFeatures} from '../implementations/index.js';
import {generateTestResults, checkTestResults} from './test-util.js';
import {TestResult, GenericTestMapping} from './test-mapping.js';

const should = chai.should();

describe('Generic Test Suite', function() {
  const impls = implementationsWithFeatures();
  const implNames = impls.map((i) => i.name);
  this.matrix = true;
  this.report = true;
  this.implemented = [...implNames];
  this.rowLabel = 'Test Name';
  this.columnLabel = 'Implementation';

  for (const i of impls) {
    describe(i.name, function() {
      for (const [testName, _] of Object.entries(GenericTestMapping)) {
        it(testName, async function() {
          await generateTestResults(i.name, testName);
          this.test.cell = {columnId: i.name, rowId: testName};
          const result = checkTestResults(i.name, testName);
          should.equal(result, TestResult.success);
        });
      }
    });
  }
});
