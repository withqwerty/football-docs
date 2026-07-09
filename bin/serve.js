#!/usr/bin/env node
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const { main } = await import(pathToFileURL(resolve(__dirname, "..", "dist", "index.js")).href);

main().catch((error) => {
  console.error("Failed to start football-docs MCP server:", error);
  process.exit(1);
});
