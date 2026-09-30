#!/usr/bin/env node
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// node:sqlite prints an ExperimentalWarning on Node 22 and 24. It is expected
// here, and MCP clients show a server's stderr to users, so drop that one warning.
const emitWarning = process.emitWarning;
process.emitWarning = (warning, ...args) => {
  const type = typeof args[0] === "string" ? args[0] : args[0]?.type;
  const message = typeof warning === "string" ? warning : warning?.message;
  if (type === "ExperimentalWarning" && message?.includes("SQLite")) return;
  return emitWarning.call(process, warning, ...args);
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const { main } = await import(pathToFileURL(resolve(__dirname, "..", "dist", "index.js")).href);

main().catch((error) => {
  console.error("Failed to start football-docs MCP server:", error);
  process.exit(1);
});
