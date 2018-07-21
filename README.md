oval
====

oval: CLI for (O)penAPI Specification document (val)idation

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oval.svg)](https://npmjs.org/package/oval)

[![TravisCI](https://travis-ci.org/whitlockjc/oval.svg?branch=master)](https://travis-ci.org/whitlockjc/oval)
[![Codecov](https://codecov.io/gh/whitlockjc/oval/branch/master/graph/badge.svg)](https://codecov.io/gh/whitlockjc/oval)
[![Downloads/week](https://img.shields.io/npm/dw/oval.svg)](https://npmjs.org/package/oval)
[![License](https://img.shields.io/npm/l/oval.svg)](https://github.com/whitlockjc/oval/blob/master/package.json)

# Overview

`oval` is an OpenAPI Specification _(OAS)_ document validator that was built to replace the CLI provided by
[swagger-tools](https://github.com/apigee-127/swagger-tools).  `oval` is built on top of
[sway](https://github.com/apigee-127/sway), the successor to the API portion of `swagger-tools`, which provides
extremely thorough OAS validation.  Plans for `oval` are to provide an [eslint](https://eslint.org/)-like experience for
OAS validation in the future.

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g oval
$ oval COMMAND
running command...
$ oval (-v|--version|version)
oval/1.0.0 darwin-x64 node-v8.3.0
$ oval --help [COMMAND]
USAGE
  $ oval COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`oval help [COMMAND]`](#oval-help-command)
* [`oval validate LOCATION`](#oval-validate-location)

## `oval help [COMMAND]`

display help for oval

```
USAGE
  $ oval help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.0.5/src/commands/help.ts)_

## `oval validate LOCATION`

validate an OpenAPI Specification (OAS) document

```
USAGE
  $ oval validate LOCATION

ARGUMENTS
  LOCATION  The path/URL to the OAS document being validated

OPTIONS
  -N, --no-color            turn off colored output
  -j, --json                output results as JSON
  -p, --print-success       print message for success
  -w, --warnings-as-errors  treat warnings as errors
```

_See code: [lib/commands/validate.js](https://github.com/whitlockjc/oval/blob/v1.0.0/lib/commands/validate.js)_
<!-- commandsstop -->
