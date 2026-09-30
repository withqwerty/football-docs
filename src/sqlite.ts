/**
 * SQLite access for the docs index and the request queue.
 *
 * This uses Node's built-in `node:sqlite`, not a native addon. An addon is built
 * for one Node ABI, and `npx` shares its cache between Node versions: a copy
 * installed under Node 22 failed to load under Node 24. The built-in module
 * always matches the Node running it.
 */

import { DatabaseSync } from "node:sqlite";

export type Database = DatabaseSync;

/** Open a database file, or ":memory:". A read-only open fails when the file does not exist. */
export function openDatabase(path: string, options: { readonly?: boolean } = {}): Database {
  return new DatabaseSync(path, { readOnly: options.readonly ?? false });
}

/** Run `work` inside one transaction, rolling back if it throws. */
export function transaction<T>(db: Database, work: () => T): T {
  db.exec("BEGIN");
  try {
    const result = work();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

/** The first column of a pragma's first row, such as "ok" from quick_check. */
export function pragmaValue(db: Database, pragma: string): unknown {
  const row = db.prepare(`PRAGMA ${pragma}`).get();
  return row ? Object.values(row)[0] : undefined;
}
