The purpose of this guide is to familiarize yourself with the oval development process.  My hopes are that this guide
will make contributing to the oval much simpler.

# Development Process

All of the information below assumes you've installed [Gulp][gulp] globally via `npm install -g gulp-cli`.  If you do
not want to install Gulp globally, just replace `gulp` with `node node_modules/gulp/bin/gulp.js` in the examples below.

Before contributing to oval, it makes sense to understand the development process.  Git of course is a given so no time
will be spent talking about it.  oval uses Gulp as its task runner, which is used to build, lint, test, etc.  Below are
the gulp tasks:

* `lint`: Lint checks the necessary sources using [ESLint][eslint]
* `test`: Runs the tests

If you just run `gulp`, all of these tasks mentioned above will be ran in the proper order.  When working on oval
myself, I typically just run `gulp test` while working on the bug fix or feature.  Once I get the code ready to commit,
I will then run `gulp` to lint check my code, run tests, ...

# Reporting Bugs

To submit new a new bug report, please follow these steps:

1. Search that the bug hasn't already been reported
2. File the bug *(if the bug report is new)*

Your bug report should meet the following criteria:

1. Include a reproduction recipe *(Document the steps required to reproduce the bug including any example code, etc.)*
2. Include what happens when the bug occurs
3. Include what you expect to happen when the bug is fixed

In the end, please provide as much pertinent information as possible when describing the problem.  A good bug report is
clear, concise and requires no guess work on our part.  Help us help you! *(I couldn't resist...)*

# Submitting PRs

To submit a new PR, please follow these steps:

1. Write a test to reproduce your bug or to test your enhancement/feature
2. Write your code *(I typically only run `gulp test` while working on the code until I get it done)*
3. Run `gulp`
4. Commit

Your PR should meet the following criteria:

1. Should include all generated sources
2. Should pass lint checking and have all tests passing *(We do have [Travis CI][travis-ci] setup to catch failing lint
checks and failing tests but this is a safety net only)*
3. Should *ideally* be squashed into one commit *(Regardless of how many commits, just make sure the commit messages are
clear)*
4. Should include tests *(Bug fixes and features should have tests included with them at all times)*

[eslint]: http://eslint.org/
[gulp]: http://gulpjs.com/
[npm]: https://www.npmjs.com/
[travis-ci]: https://travis-ci.org/whitlockjc/oval
