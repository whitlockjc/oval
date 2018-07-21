/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Jeremy Whitlock
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const {exec} = require('child_process')
const {expect} = require('chai')
const path = require('path')
const tmp = require('tmp')
const {writeFileSync} = require('fs')

const errsOnlyPath = tmp.tmpNameSync({postfix: '.yaml'})
const errsAndWarnsPath = tmp.tmpNameSync({postfix: '.yaml'})
const oasDocument = {
  swagger: '2.0',
  info: {
    title: 'Sample API',
    version: '1.0',
  },
  paths: {},
}
const validPath = tmp.tmpNameSync({postfix: '.yaml'})
const warnsOnlyPath = tmp.tmpNameSync({postfix: '.yaml'})

const executeOval = (args, done) => {
  // Add Node args
  args.unshift('node', path.resolve(path.join(__dirname, '..', '..', 'bin', 'oval')))

  // eslint-disable-next-line handle-callback-err
  exec(args.join(' '), (err, stdout, stderr) => {
    done(stderr, stdout)
  })
}

// Cleanup all files created during testing
tmp.setGracefulCleanup()

// Populate the files used for testing
writeFileSync(validPath, JSON.stringify(oasDocument, null, 2))

// Create an error and a warning
oasDocument.paths['/pets/{id}'] = {}
oasDocument.paths['/pets/{id2}'] = {}

writeFileSync(errsOnlyPath, JSON.stringify(oasDocument, null, 2))

oasDocument.definitions = {
  Unused: {},
}

writeFileSync(errsAndWarnsPath, JSON.stringify(oasDocument, null, 2))

// Fix the error and create the warning
oasDocument.paths = {}

writeFileSync(warnsOnlyPath, JSON.stringify(oasDocument, null, 2))

describe('validate', () => {
  it('print help output (--help flag)', done => {
    executeOval(['validate', '--help'], (stderr, stdout) => {
      expect(stdout).to.equal(`validate an OpenAPI Specification (OAS) document

USAGE
  $ oval validate LOCATION

ARGUMENTS
  LOCATION  The path/URL to the OAS document being validated

OPTIONS
  -N, --no-color            turn off colored output
  -j, --json                output results as JSON
  -p, --print-success       print message for success
  -w, --warnings-as-errors  treat warnings as errors

`)

      done()
    })
  })

  describe('invalid invocations', () => {
    it('exclusive flags (--json and --print-success)', done => {
      executeOval(['validate', '--json', '--print-success', validPath], (stderr, stdout) => {
        expect(stderr).to.equal(' ›   Error: --print-success= cannot also be provided when using --json=\n')
        expect(stdout).to.equal('')

        done()
      })
    })

    it('location argument does not exist', done => {
      executeOval(['validate', 'missing.yaml'], (stderr, stdout) => {
        expect(stderr).to.startWith('Error: ENOENT: no such file or directory, open')
        expect(stdout).to.equal('')

        done()
      })
    })

    it('too few arguments', done => {
      executeOval(['validate'], (stderr, stdout) => {
        expect(stderr).to.equal(` ›   Error: Missing 1 required arg:
 ›   location  The path/URL to the OAS document being validated
 ›   See more help with --help
`)
        expect(stdout).to.equal('')

        done()
      })
    })

    it('too many arguments', done => {
      executeOval(['validate', 'some', 'path'], (stderr, stdout) => {
        expect(stderr).to.equal(` ›   Error: Unexpected argument: path
 ›   See more help with --help
`)
        expect(stdout).to.equal('')

        done()
      })
    })
  })

  describe('valid invocations', () => {
    // Here really just for 100% code coverage as color is already disabled due to using child_process
    it('turn off color (--no-color)', done => {
      executeOval(['validate', '--no-color', validPath], (stderr, stdout) => {
        expect(stderr).to.equal('')
        expect(stdout).to.equal('')

        done()
      })
    })

    describe('document fails validation (errors only)', () => {
      it('default output', done => {
        executeOval(['validate', errsOnlyPath], (stderr, stdout) => {
          expect(stderr).to.equal(`OpenAPI Specification document is not valid!

ERRORS
  #/paths/~1pets~1{id2}: Equivalent path already exists: /pets/{id2}

`)
          expect(stdout).to.equal('')

          done()
        })
      })

      it('JSON output (--json)', done => {
        executeOval(['validate', '--json', errsOnlyPath], (stderr, stdout) => {
          expect(stderr).to.equal(`{
  "message": "OpenAPI Specification document is not valid!",
  "errors": [
    {
      "code": "EQUIVALENT_PATH",
      "message": "Equivalent path already exists: /pets/{id2}",
      "path": [
        "paths",
        "/pets/{id2}"
      ]
    }
  ],
  "warnings": []
}
`)
          expect(stdout).to.equal('')

          done()
        })
      })
    })

    describe('document fails validation (errors and warnings)', () => {
      it('default output', done => {
        executeOval(['validate', errsAndWarnsPath], (stderr, stdout) => {
          expect(stderr).to.equal(`OpenAPI Specification document is not valid!

ERRORS
  #/paths/~1pets~1{id2}: Equivalent path already exists: /pets/{id2}

WARNINGS
  #/definitions/Unused: Definition is not used: #/definitions/Unused

`)
          expect(stdout).to.equal('')

          done()
        })
      })

      it('JSON output (--json)', done => {
        executeOval(['validate', '--json', errsAndWarnsPath], (stderr, stdout) => {
          expect(stderr).to.equal(`{
  "message": "OpenAPI Specification document is not valid!",
  "errors": [
    {
      "code": "EQUIVALENT_PATH",
      "message": "Equivalent path already exists: /pets/{id2}",
      "path": [
        "paths",
        "/pets/{id2}"
      ]
    }
  ],
  "warnings": [
    {
      "code": "UNUSED_DEFINITION",
      "message": "Definition is not used: #/definitions/Unused",
      "path": [
        "definitions",
        "Unused"
      ]
    }
  ]
}
`)
          expect(stdout).to.equal('')

          done()
        })
      })
    })

    describe('document passes validation', () => {
      it('default output', done => {
        executeOval(['validate', validPath], (stderr, stdout) => {
          expect(stderr).to.equal('')
          expect(stdout).to.equal('')

          done()
        })
      })

      it('print success (--print-success)', done => {
        executeOval(['validate', '--print-success', validPath], (stderr, stdout) => {
          expect(stderr).to.equal('')
          expect(stdout).to.equal('OpenAPI Specification document is valid!\n')

          done()
        })
      })

      it('document contains warnings', done => {
        executeOval(['validate', warnsOnlyPath], (stderr, stdout) => {
          expect(stderr).to.equal('')
          expect(stdout).to.equal('')

          done()
        })
      })
    })

    describe('document passes validation but warnings are errors (--warnings-as-errors)', () => {
      it('default output', done => {
        executeOval(['validate', '--warnings-as-errors', warnsOnlyPath], (stderr, stdout) => {
          expect(stderr).to.equal(`OpenAPI Specification document is not valid!

WARNINGS
  #/definitions/Unused: Definition is not used: #/definitions/Unused

`)
          expect(stdout).to.equal('')

          done()
        })
      })

      it('JSON output (--json)', done => {
        executeOval(['validate', '--json', '--warnings-as-errors', warnsOnlyPath], (stderr, stdout) => {
          expect(stderr).to.equal(`{
  "message": "OpenAPI Specification document is not valid!",
  "errors": [],
  "warnings": [
    {
      "code": "UNUSED_DEFINITION",
      "message": "Definition is not used: #/definitions/Unused",
      "path": [
        "definitions",
        "Unused"
      ]
    }
  ]
}
`)
          expect(stdout).to.equal('')

          done()
        })
      })
    })
  })
})
