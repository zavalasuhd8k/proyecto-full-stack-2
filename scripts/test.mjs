import * as esbuild from "esbuild";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
const require = createRequire(import.meta.url);
const { createInstrumenter } = require("istanbul-lib-instrument");
const { Server, config } = require("karma");
await esbuild.build({
  entryPoints: ["tests/store.spec.jsx"],
  bundle: true,
  outfile: ".test-build/spec.js",
  jsx: "automatic",
  sourcemap: "inline",
  plugins: [
    {
      name: "coverage",
      setup(build) {
        build.onLoad({ filter: /src[\\/].*\.(js|jsx)$/ }, async ({ path }) => {
          const source = await readFile(path, "utf8");
          const transformed = await esbuild.transform(source, {
            loader: path.endsWith("jsx") ? "jsx" : "js",
            jsx: "automatic",
          });
          return {
            contents: createInstrumenter({ esModules: true }).instrumentSync(
              transformed.code,
              path,
            ),
            loader: "js",
          };
        });
      },
    },
  ],
});
if (!process.env.CHROME_BIN) {
  for (const path of [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  ]) {
    if (existsSync(path)) {
      process.env.CHROME_BIN = path;
      break;
    }
  }
}
const karmaConfig = await config.parseConfig(
  require.resolve("../karma.conf.cjs"),
  {},
  { promiseConfig: true, throwErrors: true },
);
new Server(karmaConfig, (code) => process.exit(code)).start();
