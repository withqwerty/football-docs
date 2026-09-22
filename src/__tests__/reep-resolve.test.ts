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
    "INSERT INTO entities VALUES ('rp1b829f1d3468c4', 'player', 'active', 'Declan Rice'), ('rt0000000000000a', 'team', 'active', 'Some Club'), ('rp0000000000000b', 'player', 'active', '100% Striker')",
    "CREATE TABLE bridges (provider VARCHAR, namespace VARCHAR, external_id VARCHAR, reep_id VARCHAR, rung VARCHAR)",
    `INSERT INTO bridges VALUES
      ('wyscout', 'player', '379209', 'rp1b829f1d3468c4', NULL),
      ('skillcorner', 'player', '12174', 'rp1b829f1d3468c4', NULL),
      ('transfermarkt', 'spieler', '11', 'rp1b829f1d3468c4', NULL),
      ('transfermarkt', 'verein', '11', 'rt0000000000000a', NULL)`,
    "CREATE TABLE redirects (from_id VARCHAR, to_id VARCHAR, reason VARCHAR)",
    "INSERT INTO redirects VALUES ('rpdeadbeef000000', 'rp1b829f1d3468c4', 'merge')",
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
