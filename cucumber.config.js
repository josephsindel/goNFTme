module.exports = {
  default: {
    require: [
      'e2e/support/hooks.ts',
      'e2e/steps/**/*.ts'
    ],
    format: [
      'progress-bar',
      'json:test-results/cucumber-report.json',
      'html:test-results/cucumber-report.html',
      '@cucumber/pretty-formatter'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
    requireModule: ['ts-node/register'],
    worldParameters: {
      headless: process.env.HEADLESS !== 'false'
    }
  }
}
