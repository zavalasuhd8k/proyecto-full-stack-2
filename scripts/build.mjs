import * as esbuild from "esbuild";
import { mkdir, writeFile, cp, readFile } from "node:fs/promises";
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
await writeFile("dist/index.html", await readFile("index.html", "utf8"));
for (const [file, route] of Object.entries({
  login: "login",
  registro: "registro",
  carrito: "carrito",
  admin: "admin",
})) {
  await writeFile(
    `dist/${file}.html`,
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=./index.html#/${route}"><title>Culto Chamán</title></head><body><a href="./index.html#/${route}">Continuar</a></body></html>`,
  );
}
const options = {
  entryPoints: { app: "src/main.jsx" },
  bundle: true,
  outdir: "dist",
  sourcemap: true,
  minify: !process.argv.includes("--serve"),
  jsx: "automatic",
  loader: { ".woff2": "file" },
  assetNames: "fonts/[name]-[hash]",
};
if (process.argv.includes("--serve")) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  await ctx.serve({ servedir: "dist", host: "127.0.0.1", port: 5173 });
  console.log("Culto Chamán: http://127.0.0.1:5173");
} else {
  await esbuild.build(options);
  console.log("Build generado en dist/");
}
