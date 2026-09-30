#!/usr/bin/env node
/**
 * Run the published server against a new data build before it is published.
 *
 *   node scripts/check-data-compat.mjs <path-to-serve.js> <path-to-docs.db>
 *
 * Installed servers run whichever release their users have, so a data build
 * must work with the published code, not only with the code on main. This
 * starts the given server with FOOTBALL_DOCS_DB_PATH pointing at the new file
 * and calls list_providers, then search_docs and get_provider_docs for every
 * provider. Any tool error, a server that rejects the file, or anything but
 * JSON-RPC on stdout fails the check.
 */

import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const [serve, dbPath] = process.argv.slice(2).map((path) => resolve(path));
if (!serve || !dbPath) {
  console.error("usage: check-data-compat.mjs <serve.js> <docs.db>");
  process.exit(2);
}

const db = new DatabaseSync(dbPath, { readOnly: true });
const providers = db.prepare("SELECT DISTINCT provider FROM docs ORDER BY provider").all().map((row) => row.provider);
db.close();

const child = spawn(process.execPath, [serve], {
  stdio: ["pipe", "pipe", "pipe"],
  env: {
    ...process.env,
    FOOTBALL_DOCS_DB_PATH: dbPath,
    XDG_DATA_HOME: mkdtempSync(join(tmpdir(), "football-docs-compat-")),
  },
});

let stderr = "";
child.stderr.on("data", (chunk) => {
  stderr += chunk;
});

const pending = new Map();
let buffer = "";
child.stdout.on("data", (chunk) => {
  buffer += chunk;
  let newline = buffer.indexOf("\n");
  while (newline >= 0) {
    const line = buffer.slice(0, newline).trim();
    buffer = buffer.slice(newline + 1);
    newline = buffer.indexOf("\n");
    if (!line) continue;
    let message;
    try {
      message = JSON.parse(line);
    } catch {
      fail(`non-JSON output on stdout: ${line.slice(0, 200)}`);
    }
    pending.get(message.id)?.(message);
    pending.delete(message.id);
  }
});
child.on("exit", (code) => {
  if (pending.size > 0) fail(`server exited (${code}) with requests outstanding`);
});

function fail(reason) {
  console.error(`compatibility check failed: ${reason}`);
  if (stderr.trim()) console.error(`server stderr:\n${stderr.trim()}`);
  child.kill();
  process.exit(1);
}

let nextId = 1;
function request(method, params) {
  const id = nextId++;
  return new Promise((resolveResponse) => {
    const timer = setTimeout(() => fail(`${method} timed out`), 30_000);
    pending.set(id, (message) => {
      clearTimeout(timer);
      if (message.error) fail(`${method}: ${JSON.stringify(message.error)}`);
      resolveResponse(message.result);
    });
    child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
  });
}

async function callTool(name, args) {
  const result = await request("tools/call", { name, arguments: args });
  const text = result?.content?.[0]?.text ?? "";
  if (result?.isError) fail(`${name}(${JSON.stringify(args)}) returned an error: ${text.slice(0, 300)}`);
  return text;
}

await request("initialize", {
  protocolVersion: "2025-03-26",
  capabilities: {},
  clientInfo: { name: "data-compat-check", version: "1.0.0" },
});
child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" })}\n`);

const list = await callTool("list_providers", {});
for (const provider of providers) {
  if (!list.includes(`**${provider}**`)) fail(`list_providers does not show ${provider}`);
  await callTool("search_docs", { query: provider, provider, max_results: 1 });
  await callTool("get_provider_docs", { provider, max_results: 1 });
}

console.log(`compatible: ${providers.length} providers answered by ${serve}`);
child.kill();
process.exit(0);
