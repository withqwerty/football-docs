#!/usr/bin/env node
// Extract the Hawkin Dynamics OpenAPI document from its public API reference page.
//
// Hawkin publishes no spec file. The page at https://connect.hawkindynamics.com/api
// carries the OpenAPI object inline, as a `const spec = {...};` literal, and its
// "Download JSON" button saves JSON.stringify(spec, null, 2). This script produces
// that same file without a browser.
//
// Only the object literal is evaluated, in an empty vm context: no page script,
// no DOM, no network.
//
// Usage:
//   node scripts/extract_hawkin_openapi.mjs                   # fetch the live page, print JSON
//   node scripts/extract_hawkin_openapi.mjs page.html         # read a saved copy of the page
//   node scripts/extract_hawkin_openapi.mjs --out specs/hawkin-dynamics/openapi.json

import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const PAGE_URL = "https://connect.hawkindynamics.com/api";

export function extractSpec(html) {
  const start = html.indexOf("const spec = {");
  if (start === -1) throw new Error("no `const spec = {` literal on the page");
  // The literal ends at the first line that is exactly the closing brace at the
  // indentation it opened with.
  const lineStart = html.lastIndexOf("\n", start) + 1;
  const indent = html.slice(lineStart, start);
  const close = html.indexOf(`\n${indent}};`, start);
  if (close === -1) throw new Error("could not find the end of the spec literal");
  const literal = html.slice(start + "const spec = ".length, close + indent.length + 2);
  const spec = vm.runInNewContext(`(${literal})`, Object.create(null), { timeout: 1000 });
  if (!spec || typeof spec.openapi !== "string" || typeof spec.paths !== "object") {
    throw new Error("the extracted object is not an OpenAPI document");
  }
  return spec;
}

async function main() {
  const args = process.argv.slice(2);
  let out = null;
  const outIndex = args.indexOf("--out");
  if (outIndex !== -1) {
    out = args[outIndex + 1];
    args.splice(outIndex, 2);
  }
  const input = args[0];

  const html = input
    ? readFileSync(input, "utf-8")
    : await (await fetch(PAGE_URL, { headers: { "User-Agent": "football-docs-spec-extract/1.0" } })).text();
  const json = JSON.stringify(extractSpec(html), null, 2);
  if (out) writeFileSync(out, `${json}\n`);
  else process.stdout.write(`${json}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
