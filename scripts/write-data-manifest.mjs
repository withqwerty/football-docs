#!/usr/bin/env node
/**
 * Prepare a data build for the data-latest release: copy data/docs.db to
 * <out>/docs-<stamp>.db and write <out>/manifest-v<schema>.json beside it.
 *
 *   node scripts/write-data-manifest.mjs <out-dir>
 *
 * The manifest fields are read from the file's own meta table, so the manifest
 * cannot describe a different build from the one it points at.
 */

import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const outDir = resolve(process.argv[2] ?? "data-release");
const source = resolve("data", "docs.db");

const db = new DatabaseSync(source, { readOnly: true });
const meta = Object.fromEntries(
  db.prepare("SELECT key, value FROM meta WHERE key != 'providers_json'").all().map((row) => [row.key, row.value]),
);
db.close();

const stampMs = Date.parse(meta.data_stamp);
if (!Number.isFinite(stampMs)) throw new Error(`data/docs.db has no usable data_stamp (${meta.data_stamp})`);

const file = `docs-${stampMs}.db`;
mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, file));
const bytes = readFileSync(join(outDir, file));

const manifest = {
  schema_version: Number(meta.schema_version),
  min_server_version: meta.min_server_version,
  data_stamp: meta.data_stamp,
  commit: meta.commit ?? null,
  file,
  sha256: createHash("sha256").update(bytes).digest("hex"),
  size: bytes.length,
};
const manifestName = `manifest-v${manifest.schema_version}.json`;
writeFileSync(join(outDir, manifestName), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(JSON.stringify({ file, manifest: manifestName, ...manifest }));
