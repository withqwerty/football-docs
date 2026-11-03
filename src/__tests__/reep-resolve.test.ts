import { DuckDBInstance } from "@duckdb/node-api";
import { beforeAll, describe, expect, it } from "vitest";
import { type LocalRegister, REEP_CONTACT, resolveEntity } from "../reep.js";

// A register with the published file's shape and a handful of rows. The tool's
// own SQL runs against it, so a query that breaks on the real schema fails here.
let register: LocalRegister;
const STAMP = "20260915T203651Z";

beforeAll(async () => {
  const instance = await DuckDBInstance.create(":memory:");
  const con = await instance.connect();
  for (const sql of [
    "CREATE TABLE release_metadata (key VARCHAR, value VARCHAR)",
    `INSERT INTO release_metadata VALUES ('source_stamp', '${STAMP}')`,
    "CREATE TABLE entities (reep_id VARCHAR, entity_type VARCHAR, status VARCHAR, label VARCHAR)",
    `INSERT INTO entities VALUES ('rp1b829f1d3468c4', 'player', 'active', 'Declan Rice'), ('rt0000000000000a', 'team', 'active', 'Some Club'),
      ('rp0000000000000b', 'player', 'active', '100% Striker'),
      ('rpmergedsrc00001', 'player', 'redirected', 'Samuel Maslej'), ('rpsurvivor000001', 'player', 'active', 'Samuel Mašlej'),
      ('rpwithdrawn00000', 'player', 'withdrawn', 'Gone Player')`,
    "CREATE TABLE bridges (provider VARCHAR, namespace VARCHAR, external_id VARCHAR, reep_id VARCHAR, rung VARCHAR, upstream_status VARCHAR)",
    `INSERT INTO bridges (provider, namespace, external_id, reep_id, rung) VALUES
      ('wyscout', 'player', '379209', 'rp1b829f1d3468c4', NULL),
      ('skillcorner', 'player', '12174', 'rp1b829f1d3468c4', NULL),
      ('transfermarkt', 'spieler', '11', 'rp1b829f1d3468c4', NULL),
      ('transfermarkt', 'verein', '11', 'rt0000000000000a', NULL),
      ('transfermarkt', 'spieler', '1146905', 'rpmergedsrc00001', NULL),
      ('wyscout', 'player', '555', 'rpsurvivor000001', NULL),
      ('wyscout', 'player', '555', 'rpmergedsrc00001', NULL),
      ('opta', 'player', '777', 'rpwithdrawn00000', NULL)`,
    `INSERT INTO bridges VALUES
      ('transfermarkt', 'spieler', '999', 'rp1b829f1d3468c4', NULL, 'retired'),
      ('skillcorner', 'player', '55555', 'rp1b829f1d3468c4', NULL, 'removed')`,
    "CREATE TABLE redirects (from_id VARCHAR, to_id VARCHAR, reason VARCHAR)",
    `INSERT INTO redirects VALUES
      ('rpdeadbeef000000', 'rp1b829f1d3468c4', 'merged'),
      ('rpwithdrawn00000', '', 'de_corroborated'),
      ('rpwithheld000000', NULL, 'withheld'),
      ('rpmergedgone0000', 'rpwithdrawn00000', 'merged'),
      ('rpmergedsrc00001', 'rpsurvivor000001', 'merged'),
      ('rploopa000000001', 'rploopb000000001', 'merged'),
      ('rploopb000000001', 'rploopa000000001', 'merged'),
      ('rpdangling000001', 'rpnowhere0000001', 'merged')`,
    "CREATE TABLE entity_search (reep_id VARCHAR, entity_type VARCHAR, label VARCHAR, search_text VARCHAR, bridge_count BIGINT)",
    "INSERT INTO entity_search VALUES ('rp1b829f1d3468c4', 'player', 'Declan Rice', 'declan rice rice', 3), ('rt0000000000000a', 'team', 'Some Club', 'some club', 1), ('rp0000000000000b', 'player', '100% Striker', '100% striker', 0)",
  ]) {
    await con.run(sql);
  }
  register = {
    stamp: STAMP,
    query: async (sql, params) => (await con.runAndReadAll(sql, params)).getRowObjectsJson() as Record<string, unknown>[],
  };
});

const LOCAL = { REEP_DUCKDB_PATH: "/data/reep-register-v1.duckdb" };
const openLocal = async () => register;
const latest = (stamp: string) => async () => new Response(JSON.stringify({ stamp }));
const noNetwork = async (): Promise<Response> => {
  throw new Error("no network call expected");
};
const text = (r: { content: Array<{ text: string }> }) => r.content[0].text;

describe("resolve_entity inputs", () => {
  it("asks for an input when none is given", async () => {
    const r = await resolveEntity({}, { env: {}, fetchImpl: noNetwork });
    expect(r.isError).toBe(true);
    expect(text(r)).toContain("provider + id, reep_id, or name");
  });

  it("refuses a name shorter than 3 characters, as the API does", async () => {
    const r = await resolveEntity({ name: "ri" }, { env: {}, fetchImpl: noNetwork });
    expect(r.isError).toBe(true);
  });
});

describe("resolve_entity with nothing configured", () => {
  it("makes no network call and explains both ways in, with a query to run", async () => {
    const r = await resolveEntity({ provider: "Wyscout", namespace: "player", id: "379209" }, { env: {}, fetchImpl: noNetwork });
    const t = text(r);
    expect(r.isError).toBeUndefined();
    expect(t).toContain("REEP_DUCKDB_PATH");
    expect(t).toContain("REEP_API_KEY");
    expect(t).toContain("no self-service");
    expect(t).toContain(REEP_CONTACT);
    expect(t).toContain("b.provider = 'wyscout' AND b.namespace = 'player'");
    expect(t).toContain("b.external_id = '379209'");
  });

  it("quotes user input safely in the suggested SQL", async () => {
    const r = await resolveEntity({ name: "O'Shea" }, { env: {}, fetchImpl: noNetwork });
    expect(text(r)).toContain("ILIKE '%O''Shea%'");
  });
});

describe("resolve_entity against a local register", () => {
  it("maps a provider ID to every other provider ID, and confirms the file is current", async () => {
    const r = await resolveEntity(
      { provider: "wyscout", namespace: "player", id: "379209" },
      { env: LOCAL, openLocal, fetchImpl: latest(STAMP) },
    );
    const t = text(r);
    expect(t).toContain("### Declan Rice (player)");
    expect(t).toContain("Matched: wyscout / player: 379209");
    expect(t).toContain("skillcorner / player: 12174");
    expect(t).toContain(`Local register release: ${STAMP} (current).`);
    expect(t).not.toContain("No namespace was given");
  });

  it("says when an ID without a namespace matched in only one namespace", async () => {
    const r = await resolveEntity({ provider: "wyscout", id: "379209" }, { env: LOCAL, openLocal, fetchImpl: latest(STAMP) });
    const t = text(r);
    expect(t).toContain("Declan Rice");
    expect(t).toContain('**No namespace was given.** It matched only in namespace "player".');
  });

  it("does not add the single-namespace note when the type pins the entity", async () => {
    const r = await resolveEntity(
      { provider: "wyscout", id: "379209", type: "player" },
      { env: LOCAL, openLocal, fetchImpl: latest(STAMP) },
    );
    expect(text(r)).toContain("Declan Rice");
    expect(text(r)).not.toContain("No namespace was given");
  });

  it("warns when an ID without a namespace matches in several namespaces", async () => {
    const r = await resolveEntity({ provider: "transfermarkt", id: "11" }, { env: LOCAL, openLocal, fetchImpl: latest(STAMP) });
    const t = text(r);
    expect(t).toContain("Declan Rice");
    expect(t).toContain("Some Club");
    expect(t).toContain("matches in 2 namespaces");
  });

  it("narrows by namespace", async () => {
    const r = await resolveEntity(
      { provider: "transfermarkt", namespace: "verein", id: "11" },
      { env: LOCAL, openLocal, fetchImpl: latest(STAMP) },
    );
    expect(text(r)).toContain("Some Club");
    expect(text(r)).not.toContain("Declan Rice");
  });

  it("follows a merge redirect to the survivor", async () => {
    const r = await resolveEntity({ reep_id: "rpdeadbeef000000" }, { env: LOCAL, openLocal, fetchImpl: latest(STAMP) });
    expect(text(r)).toContain("Redirected: rpdeadbeef000000 was merged into rp1b829f1d3468c4");
  });

  it("follows a bridge that names a merged Reep ID to the survivor", async () => {
    const r = await resolveEntity(
      { provider: "transfermarkt", namespace: "spieler", id: "1146905" },
      { env: LOCAL, openLocal, fetchImpl: latest(STAMP) },
    );
    const t = text(r);
    expect(t).toContain("### Samuel Mašlej (player)");
    expect(t).toContain("Reep ID: rpsurvivor000001");
    expect(t).toContain("Redirected: rpmergedsrc00001 was merged into rpsurvivor000001");
    expect(t).toContain("wyscout / player: 555");
    expect(t).not.toContain("Samuel Maslej (player)");
  });

  it("marks provider IDs the provider no longer uses, and lists live ones first", async () => {
    const r = await resolveEntity(
      { provider: "wyscout", namespace: "player", id: "379209" },
      { env: LOCAL, openLocal, fetchImpl: latest(STAMP) },
    );
    const t = text(r);
    expect(t).toContain("transfermarkt / spieler: 999 (retired by the provider)");
    expect(t).toContain("skillcorner / player: 55555 (removed from the provider's list)");
    expect(t).toContain("map to the unmarked ones");
    expect(t.indexOf("skillcorner / player: 12174")).toBeLessThan(t.indexOf("transfermarkt / spieler: 999"));
    expect(t.indexOf("wyscout / player: 379209")).toBeLessThan(t.indexOf("skillcorner / player: 55555"));
  });

  it("still resolves a retired provider ID, and says it is retired", async () => {
    const r = await resolveEntity(
      { provider: "transfermarkt", namespace: "spieler", id: "999" },
      { env: LOCAL, openLocal, fetchImpl: latest(STAMP) },
    );
    expect(text(r)).toContain("### Declan Rice (player)");
    expect(text(r)).toContain("Matched: transfermarkt / spieler: 999 (retired by the provider)");
  });

  it("reads a register file from before upstream_status existed", async () => {
    const instance = await DuckDBInstance.create(":memory:");
    const con = await instance.connect();
    for (const sql of [
      "CREATE TABLE entities (reep_id VARCHAR, entity_type VARCHAR, status VARCHAR, label VARCHAR)",
      "INSERT INTO entities VALUES ('rp1b829f1d3468c4', 'player', 'active', 'Declan Rice')",
      "CREATE TABLE bridges (provider VARCHAR, namespace VARCHAR, external_id VARCHAR, reep_id VARCHAR, rung VARCHAR)",
      "INSERT INTO bridges VALUES ('wyscout', 'player', '379209', 'rp1b829f1d3468c4', NULL), ('skillcorner', 'player', '12174', 'rp1b829f1d3468c4', NULL)",
      "CREATE TABLE redirects (from_id VARCHAR, to_id VARCHAR, reason VARCHAR)",
    ]) {
      await con.run(sql);
    }
    const old: LocalRegister = {
      stamp: STAMP,
      query: async (sql, params) => (await con.runAndReadAll(sql, params)).getRowObjectsJson() as Record<string, unknown>[],
    };
    const r = await resolveEntity(
      { provider: "wyscout", namespace: "player", id: "379209" },
      { env: LOCAL, openLocal: async () => old, fetchImpl: latest(STAMP) },
    );
    expect(text(r)).toContain("skillcorner / player: 12174");
    expect(text(r)).not.toContain("retired");
  });

  it("lists a provider ID still attached to a merged ID under the survivor, once", async () => {
    const r = await resolveEntity({ reep_id: "rpsurvivor000001" }, { env: LOCAL, openLocal, fetchImpl: latest(STAMP) });
    const t = text(r);
    expect(t).toContain("transfermarkt / spieler: 1146905 (via merged rpmergedsrc00001)");
    expect(t).toContain("wyscout / player: 555\n");
    expect(t.match(/wyscout \/ player: 555/g)).toHaveLength(1);
  });

  it("reports a bridge that names a withdrawn Reep ID", async () => {
    const r = await resolveEntity(
      { provider: "opta", namespace: "player", id: "777" },
      { env: LOCAL, openLocal, fetchImpl: latest(STAMP) },
    );
    const t = text(r);
    expect(t).toContain("opta / player: 777 points at rpwithdrawn00000.");
    expect(t).toContain("Reep ID rpwithdrawn00000 is withdrawn (reason: de_corroborated)");
    expect(t).not.toContain("Gone Player");
  });

  it("suggests provider SQL that follows a bridge's redirect", async () => {
    const t = text(await resolveEntity({ provider: "transfermarkt", namespace: "spieler", id: "1146905" }, { env: {}, fetchImpl: noNetwork }));
    const sql = t.split("```sql\n")[1].split("\n```")[0];
    const rows = await register.query(sql, {});
    expect(rows.length).toBeGreaterThan(0);
    expect(new Set(rows.map((row) => row.reep_id))).toEqual(new Set(["rpsurvivor000001"]));
    expect(rows[0].bridged_id).toBe("rpmergedsrc00001");
    expect(rows.some((row) => row.provider === "transfermarkt" && row.external_id === "1146905")).toBe(true);
  });

  it("reports a redirect loop as withdrawn, as the reep package does", async () => {
    const r = await resolveEntity({ reep_id: "rploopa000000001" }, { env: LOCAL, openLocal, fetchImpl: latest(STAMP) });
    expect(text(r)).toContain("Reep ID rploopa000000001 is withdrawn (reason: redirect_loop)");
  });

  it("reports a redirect to an ID with no entity as withdrawn, not as unknown", async () => {
    const r = await resolveEntity({ reep_id: "rpdangling000001" }, { env: LOCAL, openLocal, fetchImpl: latest(STAMP) });
    expect(text(r)).toContain("Reep ID rpdangling000001 is withdrawn: it redirects to rpnowhere0000001, which has no entity in this release.");
    expect(text(r)).not.toContain("No Reep entity matches");
  });

  it("reports a withdrawn ID as withdrawn, not as unknown", async () => {
    const r = await resolveEntity({ reep_id: "rpwithdrawn00000" }, { env: LOCAL, openLocal, fetchImpl: latest(STAMP) });
    const t = text(r);
    expect(r.isError).toBeUndefined();
    expect(t).toContain("Reep ID rpwithdrawn00000 is withdrawn (reason: de_corroborated)");
    expect(t).toContain("no survivor ID");
    expect(t).not.toContain("No Reep entity matches");
  });

  it("reports a withheld ID, whose to_id is NULL", async () => {
    const r = await resolveEntity({ reep_id: "rpwithheld000000" }, { env: LOCAL, openLocal, fetchImpl: latest(STAMP) });
    expect(text(r)).toContain("Reep ID rpwithheld000000 is withheld (reason: withheld)");
  });

  it("reports a merge whose survivor was later withdrawn", async () => {
    const r = await resolveEntity({ reep_id: "rpmergedgone0000" }, { env: LOCAL, openLocal, fetchImpl: latest(STAMP) });
    expect(text(r)).toContain("rpmergedgone0000 was merged into rpwithdrawn00000, and Reep ID rpwithdrawn00000 is withdrawn");
  });

  it("suggests SQL that reports tombstones and runs against the register's schema", async () => {
    const t = text(await resolveEntity({ reep_id: "rpwithdrawn00000" }, { env: {}, fetchImpl: noNetwork }));
    const sql = t.split("```sql\n")[1].split("\n```")[0];
    const statements = sql.split(";").map((s) => s.replace(/^\s*--.*$/gm, "").trim()).filter(Boolean);
    expect(statements).toHaveLength(2);
    const tombstone = await register.query(statements[0], {});
    expect(tombstone).toEqual([{ from_id: "rpwithdrawn00000", to_id: "", reason: "de_corroborated" }]);
    expect(await register.query(statements[1], {})).toEqual([]);
    const merged = text(await resolveEntity({ reep_id: "rpdeadbeef000000" }, { env: {}, fetchImpl: noNetwork }));
    const survivorSql = merged.split("```sql\n")[1].split("\n```")[0].split(";")[1];
    const survivorRows = await register.query(survivorSql, {});
    expect(survivorRows.length).toBe(5);
    expect(survivorRows.map((row) => row.upstream_status)).toEqual(["", "", "", "removed", "retired"]);
  });

  it("treats % in a name as a literal character", async () => {
    const r = await resolveEntity({ name: "100%" }, { env: LOCAL, openLocal, fetchImpl: latest(STAMP) });
    expect(text(r)).toContain("100% Striker");
    expect(text(r)).not.toContain("Declan Rice");
  });

  it("tells the agent how to update an out-of-date file", async () => {
    const r = await resolveEntity({ reep_id: "rp1b829f1d3468c4" }, { env: LOCAL, openLocal, fetchImpl: latest("20990101T000000Z") });
    const t = text(r);
    expect(t).toContain("The local register is out of date.");
    expect(t).toContain("current release: 20990101T000000Z");
    expect(t).toContain('curl -L -o "/data/reep-register-v1.duckdb" https://reep.football/downloads/duckdb');
    expect(t).toContain("no restart is needed");
  });

  it("still answers when the release check fails, and says so", async () => {
    const r = await resolveEntity({ reep_id: "rp1b829f1d3468c4" }, { env: LOCAL, openLocal, fetchImpl: noNetwork });
    expect(text(r)).toContain("Declan Rice");
    expect(text(r)).toContain("Could not check for a newer release");
  });

  it("prefers the local file over the API when both are set", async () => {
    const calls: string[] = [];
    const fetchImpl = async (url: string | URL | Request) => {
      calls.push(String(url));
      return new Response(JSON.stringify({ stamp: STAMP }));
    };
    await resolveEntity({ reep_id: "rp1b829f1d3468c4" }, { env: { ...LOCAL, REEP_API_KEY: "k" }, openLocal, fetchImpl });
    expect(calls).toEqual(["https://data.reep.football/releases/latest.json"]);
  });

  it("says when the optional DuckDB client is missing", async () => {
    const missing = async () => Promise.reject(new Error("Cannot find package '@duckdb/node-api' imported from x"));
    const r = await resolveEntity({ reep_id: "rp1b829f1d3468c4" }, { env: LOCAL, openLocal: missing, fetchImpl: noNetwork });
    expect(text(r)).toContain("DuckDB client that reads it is not installed");
  });

  it("reports an unreadable file and falls back to setup guidance", async () => {
    const r = await resolveEntity(
      { reep_id: "rp1b829f1d3468c4" },
      { env: LOCAL, openLocal: async () => Promise.reject(new Error("no such file")), fetchImpl: noNetwork },
    );
    expect(r.isError).toBe(true);
    expect(text(r)).toContain("could not be read (no such file)");
    expect(text(r)).toContain("REEP_API_KEY");
  });
});

describe("resolve_entity against the API", () => {
  const KEYED = { REEP_API_KEY: "secret-key", REEP_API_URL: "https://reep.example.test/api/v1" };
  const reply = (status: number, body: unknown, headers: Record<string, string> = {}) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });

  it("resolves with the key, the namespace and bridges, and reports stamp and credits", async () => {
    let seen: Request | undefined;
    const fetchImpl = async (url: string | URL | Request, init?: RequestInit) => {
      seen = new Request(url, init);
      return reply(
        200,
        {
          results: [
            {
              reep_id: "rp1b829f1d3468c4",
              entity_type: "player",
              name_en: "Declan Rice",
              bridges: [
                { provider: "skillcorner", namespace: "player", external_id: "12174", entity_type: "player", role: "bridge_only" },
                { provider: "wyscout", namespace: "player", external_id: "379209", entity_type: "player", role: "canonical_bridge" },
              ],
            },
          ],
          count: 1,
        },
        { "X-Reep-Release-Stamp": STAMP, "X-Reep-Credits-Remaining": "999" },
      );
    };
    const r = await resolveEntity({ provider: "wyscout", namespace: "player", id: "379209" }, { env: KEYED, fetchImpl });
    expect(seen?.url).toBe("https://reep.example.test/api/v1/resolve/wyscout/379209?include=bridges&namespace=player");
    expect(seen?.headers.get("Authorization")).toBe("Bearer secret-key");
    expect(seen?.headers.get("User-Agent")).toContain("football-docs");
    const t = text(r);
    expect(t).toContain("skillcorner / player: 12174 (bridge_only)");
    expect(t).toContain("wyscout / player: 379209\n");
    expect(t).toContain(`Release: ${STAMP} · Lookups remaining this month: 999`);
    expect(t).not.toContain("secret-key");
  });

  it("names the namespace a provider ID matched in when none was given", async () => {
    const fetchImpl = async () =>
      reply(200, {
        results: [
          {
            reep_id: "rp1b829f1d3468c4",
            entity_type: "player",
            name_en: "Declan Rice",
            bridges: [{ provider: "wyscout", namespace: "player", external_id: "379209" }],
          },
        ],
      });
    const r = await resolveEntity({ provider: "wyscout", id: "379209" }, { env: KEYED, fetchImpl });
    expect(text(r)).toContain('**No namespace was given.** It matched only in namespace "player".');
  });

  it("keeps the API's reason when an entity is not found", async () => {
    const fetchImpl = async () => reply(404, { error: "entity_removed", message: "withdrawn in release 20261005T180536Z" });
    const r = await resolveEntity({ reep_id: "rpwithdrawn00000" }, { env: KEYED, fetchImpl });
    expect(text(r)).toContain("No Reep entity matches that query (entity_removed: withdrawn in release 20261005T180536Z).");
  });

  it("lists candidates for an ambiguous provider ID (409)", async () => {
    const fetchImpl = async () =>
      reply(409, {
        error: "ambiguous",
        results: [
          { reep_id: "rp1", entity_type: "player", name_en: "A" },
          { reep_id: "rp2", entity_type: "player", name_en: "B" },
        ],
        count: 2,
      });
    const r = await resolveEntity({ provider: "opta", id: "1" }, { env: KEYED, fetchImpl });
    expect(text(r)).toContain("maps to 2 Reep entities");
    expect(text(r)).toContain("### A (player)");
  });

  it("explains a refused key and how to get one", async () => {
    const r = await resolveEntity({ reep_id: "rp1" }, { env: KEYED, fetchImpl: async () => reply(401, { error: "unauthorized" }) });
    expect(r.isError).toBe(true);
    expect(text(r)).toContain("refused the key");
    expect(text(r)).toContain(REEP_CONTACT);
  });

  it("points to the download when the allowance is used up", async () => {
    const r = await resolveEntity({ reep_id: "rp1" }, { env: KEYED, fetchImpl: async () => reply(429, { error: "rate_limited" }) });
    expect(r.isError).toBe(true);
    expect(text(r)).toContain("REEP_DUCKDB_PATH");
  });

  it("shows a redirect when an entity was merged", async () => {
    const fetchImpl = async () =>
      reply(200, {
        reep_id: "rp1b829f1d3468c4",
        entity_type: "player",
        name_en: "Declan Rice",
        requested_id: "rpdeadbeef000000",
        redirected_to: "rp1b829f1d3468c4",
        bridges: [],
      });
    const r = await resolveEntity({ reep_id: "rpdeadbeef000000" }, { env: KEYED, fetchImpl });
    expect(text(r)).toContain("Redirected: rpdeadbeef000000 was merged into rp1b829f1d3468c4");
  });

  it("says a name search carries no provider IDs, and how to get them", async () => {
    const fetchImpl = async () =>
      reply(200, { results: [{ reep_id: "rp1b829f1d3468c4", entity_type: "player", label: "Declan Rice", bridge_count: 30, relevance: 1 }] });
    const r = await resolveEntity({ name: "Declan Rice" }, { env: KEYED, fetchImpl });
    expect(text(r)).toContain("Providers bridged: 30");
    expect(text(r)).toContain("Call again with reep_id");
  });
});

describe("resolve_entity with a register file in the later layout", () => {
  // Later releases ship the DuckDB file without release_metadata, name entities in
  // canonical_name instead of label, and have no bridges.upstream_status.
  let path: string;

  beforeAll(async () => {
    const { mkdtempSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");
    path = join(mkdtempSync(join(tmpdir(), "reep-later-")), "register.duckdb");
    const instance = await DuckDBInstance.create(path);
    const con = await instance.connect();
    for (const sql of [
      "CREATE TABLE entities (reep_id VARCHAR, entity_type VARCHAR, canonical_name VARCHAR, birth_date_iso VARCHAR)",
      "INSERT INTO entities VALUES ('rp56bd0fc61d9da5', 'player', 'Bukayo Saka', NULL)",
      "CREATE TABLE bridges (reep_id VARCHAR, provider VARCHAR, namespace VARCHAR, external_id VARCHAR, entity_type VARCHAR, rule_id VARCHAR, confidence DOUBLE)",
      `INSERT INTO bridges VALUES
        ('rp56bd0fc61d9da5', 'transfermarkt', 'spieler', '433177', 'player', 'r', 1.0),
        ('rp56bd0fc61d9da5', 'sofascore', 'player', '934235', 'player', 'r', 1.0),
        ('rpmergedsaka0001', 'understat', 'player', '7322', 'player', 'r', 1.0)`,
      "CREATE TABLE redirects (from_id VARCHAR, to_id VARCHAR, reason VARCHAR, created_at VARCHAR)",
      "INSERT INTO redirects VALUES ('rpmergedsaka0001', 'rp56bd0fc61d9da5', 'merged', NULL)",
      "CREATE TABLE entity_search (reep_id VARCHAR, entity_type VARCHAR, label VARCHAR, canonical_name VARCHAR, search_text VARCHAR, bridge_count BIGINT, alias_count BIGINT)",
      "INSERT INTO entity_search VALUES ('rp56bd0fc61d9da5', 'player', 'Bukayo Saka', 'Bukayo Saka', 'bukayo saka', 3, 0)",
    ]) {
      await con.run(sql);
    }
    con.closeSync();
  });

  it("opens the file without release_metadata and resolves a provider ID", async () => {
    const r = await resolveEntity(
      { provider: "transfermarkt", namespace: "spieler", id: "433177" },
      { env: { REEP_DUCKDB_PATH: path }, fetchImpl: latest("2026-10-31.1") },
    );
    const t = text(r);
    expect(r.isError).toBeUndefined();
    expect(t).toContain("Bukayo Saka");
    expect(t).toContain("sofascore");
    expect(t).toContain("934235");
    // A bridge still on a merged ID is listed under the survivor.
    expect(t).toContain("7322");
    expect(t).toContain("does not record its release");
  });
});
