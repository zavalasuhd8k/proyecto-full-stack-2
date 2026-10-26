module.exports = (config) =>
  config.set({
    frameworks: ["jasmine"],
    files: [".test-build/spec.js"],
    browsers: ["ChromeHeadless"],
    reporters: ["progress", "coverage"],
    singleRun: true,
    coverageReporter: {
      dir: "coverage",
      reporters: [
        { type: "html" },
        { type: "json-summary" },
        { type: "text-summary" },
      ],
      check: {
        global: { statements: 90, branches: 90, functions: 90, lines: 90 },
      },
    },
    client: { jasmine: { random: false } },
    browserNoActivityTimeout: 30000,
  });
