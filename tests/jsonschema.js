import chai from 'chai';

import {
  implementationsWhichSupportVersionAndType, JsonSchemaVersions, VcJsonSchemaTypes,
} from '../implementations/index.js';
import {generateTestResults, checkTestResults} from './testutil.js';
import {TestResult} from './testmapping.js';

const schemaVersions = Object.keys(JsonSchemaVersions);
const should = chai.should();

schemaVersions.forEach((schemaVersion) => {
  const schemaVersionName = JsonSchemaVersions[schemaVersion];
  describe(`JsonSchema – JSON Schema ${schemaVersionName}`, function() {
    const impls = implementationsWhichSupportVersionAndType(
        {version: schemaVersionName, type: jsonSchemaType});
    const implNames = impls.map((i) => i.name);
    this.matrix = true;
    this.report = true;
    this.implemented = [...implNames];
    this.rowLabel = 'Test Name';
    this.columnLabel = 'Implementation';

    // run tests for each impl
    for (const i of impls) {
      describe(i.name, async function() {
        it('2.1 ID - The value MUST be a URL that identifies the schema associated with the verifiable credential.', async function() {
          await generateTestResults(i.name, schemaVersionName, jsonSchemaType, this.test.title);
          this.test.cell = {columnId: i.name, rowId: this.test.title};
          const result = await checkTestResults(i.name, schemaVersionName, jsonSchemaType, this.test.title);
          should.equal(result, TestResult.success);
        });
      });
    }
  });
});
