# W3C Verifiable Credentials Test Suite

Test suite for the [Verifiable Credentials](https://github.com/w3c/vc-data-model/) specification in the W3C.

The suite makes use Digital Bazaar's [mocha-w3c-interop-reporter](https://github.com/digitalbazaar/mocha-w3c-interop-reporter).

## Building & Testing

To build and test the suite, run the following commands:

```bash
npm install
npm test
```

You can remove all generated test cases by running:

```bash
npm clean
```

A report will be generated to the [reports](reports) directory after a successful run.

## Implementations

### How Implementations Work
Implementations are run using [docker compose](https://docs.docker.com/compose/). Each container is called once
per test case. The container is expected take the following inputs:

* `format` - either `JsonSchema` or `JsonSchemaCredential`
* `schema` - a path to the input schema file
* `credential` - a path to the input credential file
* `output` - a path to where the container will write an output

An example command for a container that takes the above inputs would be:

```bash
docker-compose -f ./implementations/docker-compose.yml \
 run -d example-sdk validate \
 --color red \
 --schema /tests/input/jsonschemacredential/Draft-7/11-schema.json \
 --credential /tests/input/jsonschemacredential/Draft-7/1-credential.json \
 --output /tests/output/jsonschemacredential/Draft-7/18-example-sdk.json
```

### Adding an Implementation

To add an implementation to the test suite, add a new entry to the `implementations` array in `implementations.json`.
The entry should have the following properties: `name` and `config`, where `config` is an object with the supported
config types as keys (in our example key values are color) and an array of supported values for that config type.

```json
{
  "name": "sample",
  "config": {
    "red": [
      "ruby",
      "scarlet"
    ],
    "blue": [
      "sapphire",
      "navy"
    ]
  }
}
```

Next, you'll need to add a new entry for the implementation in the [`docker-compose.yml`](implementations/docker-compose.yml)
file. You may optionally add a directory to the [`implementations`](implementations) directory with the same name as the
implementation which houses the implementation's code.
