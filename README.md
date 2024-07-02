# Generic Test Suite Runner

This is a generic test suite runner that can be used as a template for various specifications. It provides a flexible framework for running tests against multiple implementations and generating reports.

## Building & Testing

To build and test the suite, run the following commands:

```bash
npm install
npm test
```

You can remove all generated test cases by running:

```bash
npm run clean
```

A report will be generated in the [reports](reports) directory after a successful run.

## Implementations

Implementations are tested based on the features they support, as defined in their configuration.

### How Implementations Work

Implementations are run using [docker compose](https://docs.docker.com/compose/). Each container is called once per test case. The container is expected to take the following inputs:

* `input` - a path to the input file
* `config` - a JSON string containing test-specific configuration
* `output` - a path to where the container will write its output

An example command for a container that takes the above inputs would be:

```bash
docker-compose -f ./implementations/docker-compose.yml \
 run -d sample-impl validate \
 --input /tests/input/valid-credential.json \
 --config '{"check":"identifier"}' \
 --output /tests/output/1-sample-impl.json
```

### Adding an Implementation

To add an implementation to the test suite, add a new entry to the `implementations` array in `implementations/implementations.json`. The entry should have the following properties: `name` and `features`, where `features` is an object with the supported features as keys and boolean values.

```json
{
  "name": "sample-impl",
  "features": {
    "identifier": true,
    "type": true,
    "issuance_date": true
  }
}
```

Next, add a new entry for the implementation in the [`docker-compose.yml`](implementations/docker-compose.yml) file. You may optionally add a directory to the [`implementations`](implementations) directory with the same name as the implementation to house the implementation's code.

## Customizing the Test Suite

To customize the test suite for a specific specification:

1. Update the `GenericTestMapping` in `testmapping.js` to include the relevant test cases for your specification.
2. Modify the `implementations/implementations.json` file to reflect the features relevant to your specification.
3. Update the test input files in the `tests/input` directory to match your specification's requirements.
4. If necessary, modify the `testutil.js` and `generic-test-runner.js` files to accommodate any specific needs of your test suite.
