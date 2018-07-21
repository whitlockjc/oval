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

const chalk = require('chalk')
const {Command, flags} = require('@oclif/command')
const {pathToPtr} = require('json-refs')
const Sway = require('sway')

const printDetails = (label, items) => {
  var color = label === 'ERRORS' ? chalk.red : chalk.yellow

  console.error()
  console.error(chalk.bold(label))

  items.forEach(item => {
    console.error('  ' + chalk.bold(chalk.underline.gray(pathToPtr(item.path))) + ': ' + color(item.message))
  })
}

class ValidateCommand extends Command {
  async run () {
    const {args, flags} = this.parse(ValidateCommand)

    // Turn off color output if requested
    if (flags['no-color']) {
      chalk.enabled = false
    }

    Sway.create({
      definition: args.location,
    })
      .then(api => {
        const {errors, warnings} = api.validate()
        const success = errors.length + (flags['warnings-as-errors'] ? warnings.length : 0) === 0

        if (success) {
          if (flags['print-success']) {
            console.log('OpenAPI Specification document is valid!')
          }
        } else {
          const err = new Error('OpenAPI Specification document is not valid!')

          err.isValidationError = true
          err.errors = errors
          err.warnings = warnings

          throw err
        }
      })
      .catch(err => {
        if (err.isValidationError) {
          if (flags.json) {
            console.error(JSON.stringify({
              message: err.message,
              errors: err.errors,
              warnings: err.warnings,
            }, null, 2))
          } else {
            console.error(err.message)

            if (err.errors.length > 0) {
              printDetails('ERRORS', err.errors)
            }

            if (err.warnings.length > 0) {
              printDetails('WARNINGS', err.warnings)
            }

            console.error()
          }
        } else {
          console.error(err.stack)
        }

        process.exit(1)
      })
  }
}

ValidateCommand.description = 'validate an OpenAPI Specification (OAS) document'

ValidateCommand.args = [
  {
    description: 'The path/URL to the OAS document being validated',
    name: 'location',
    required: true,
  },
]

ValidateCommand.flags = {
  json: flags.boolean({
    char: 'j',
    description: 'output results as JSON',
    exclusive: ['print-success'],
  }),
  'no-color': flags.boolean({
    char: 'N',
    description: 'turn off colored output',
  }),
  'print-success': flags.boolean({
    char: 'p',
    description: 'print message for success',
    exclusive: ['json'],
  }),
  'warnings-as-errors': flags.boolean({
    allowNo: false,
    char: 'w',
    description: 'treat warnings as errors',
  }),
}

module.exports = ValidateCommand
