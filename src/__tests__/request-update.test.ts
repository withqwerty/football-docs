import Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { requestUpdate } from "../tools.js";

function createQueueDb(): Database.Database {
  const db = new Database(":memory:");
  db.exec(`
    CREATE TABLE requests (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      provider TEXT NOT NULL,
      reason TEXT NOT NULL,
      suggested_urls TEXT,
      requested_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending'
    )
  `);
  return db;
}

describe("requestUpdate", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createQueueDb();
  });

  afterEach(() => {
    db.close();
  });

  it("queues a deterministic missing-provider request with suggested URLs", () => {
    const result = requestUpdate(
      db,
      {
        type: "new_provider",
        provider: "WhoScored",
        reason: "Agents need WhoScored event/touch data docs for chart adapters.",
        suggested_urls: ["https://example.com/whoscored-docs"],
      },
      { now: new Date("2026-07-09T10:00:00Z"), requestId: "req_test_1" },
    );
    const text = result.content[0].text;
    const row = db.prepare("SELECT * FROM requests WHERE id = ?").get("req_test_1") as {
      type: string;
      provider: string;
      reason: string;
      suggested_urls: string;
      requested_at: string;
      status: string;
    };

    expect(result.isError).toBeUndefined();
    expect(text).toContain('New provider request queued for "WhoScored"');
    expect(text).toContain("https://example.com/whoscored-docs");
    expect(row).toMatchObject({
      type: "new_provider",
      provider: "whoscored",
      reason: "Agents need WhoScored event/touch data docs for chart adapters.",
      requested_at: "2026-07-09T10:00:00.000Z",
      status: "pending",
    });
    expect(JSON.parse(row.suggested_urls)).toEqual(["https://example.com/whoscored-docs"]);
  });

  it("enforces duplicate cooldown against the injected clock", () => {
    db.prepare(
      `INSERT INTO requests (id, type, provider, reason, requested_at, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
    ).run(
      "req_existing",
      "new_provider",
      "sofascore",
      "Need SofaScore docs.",
      "2026-07-04T10:00:00.000Z",
    );

    const result = requestUpdate(
      db,
      {
        type: "new_provider",
        provider: "SofaScore",
        reason: "Need public app/API surface docs.",
      },
      { now: new Date("2026-07-09T10:00:00Z"), requestId: "req_duplicate" },
    );
    const count = db.prepare("SELECT COUNT(*) as count FROM requests").get() as { count: number };

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("already exists");
    expect(result.content[0].text).toContain("req_existing");
    expect(count.count).toBe(1);
  });

  it("treats spacing and case variants as the same pending provider", () => {
    db.prepare(
      `INSERT INTO requests (id, type, provider, reason, requested_at, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
    ).run(
      "req_existing_variant",
      "new_provider",
      "sofascore",
      "Need SofaScore docs.",
      "2026-07-04T10:00:00.000Z",
    );

    const result = requestUpdate(
      db,
      {
        type: "new_provider",
        provider: "Sofa Score",
        reason: "Need public app/API surface docs.",
      },
      { now: new Date("2026-07-09T10:00:00Z"), requestId: "req_duplicate_variant" },
    );

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("req_existing_variant");
    expect((db.prepare("SELECT COUNT(*) as count FROM requests").get() as { count: number }).count).toBe(1);
  });

  it("allows a fresh request after the cooldown window", () => {
    db.prepare(
      `INSERT INTO requests (id, type, provider, reason, requested_at, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
    ).run(
      "req_old",
      "new_provider",
      "sofascore",
      "Need SofaScore docs.",
      "2026-07-01T09:59:59.000Z",
    );

    const result = requestUpdate(
      db,
      {
        type: "new_provider",
        provider: "SofaScore",
        reason: "Need public app/API surface docs.",
      },
      { now: new Date("2026-07-09T10:00:00Z"), requestId: "req_new" },
    );

    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain("req_new");
    expect((db.prepare("SELECT COUNT(*) as count FROM requests").get() as { count: number }).count).toBe(2);
  });

  it("rejects requests when the local queue is full", () => {
    const insert = db.prepare(
      `INSERT INTO requests (id, type, provider, reason, requested_at, status)
       VALUES (?, 'new_provider', ?, 'test', '2026-07-09T10:00:00.000Z', 'pending')`,
    );
    const transaction = db.transaction(() => {
      for (let i = 0; i < 500; i += 1) {
        insert.run(`req_${i}`, `provider-${i}`);
      }
    });
    transaction();

    const result = requestUpdate(
      db,
      {
        type: "new_provider",
        provider: "Provider 501",
        reason: "Queue pressure test.",
      },
      { now: new Date("2026-07-09T10:00:00Z"), requestId: "req_overflow" },
    );

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Request queue is full (500 entries)");
  });
});
