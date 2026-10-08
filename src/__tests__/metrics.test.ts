import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { SCHEMA_SQL, writeMeta } from "../data-format.js";
import { getMetric, listMetrics, metricCardsFileSchema, readMetricCards } from "../metrics.js";
import { openDatabase } from "../sqlite.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const cardsJson = readFileSync(resolve(ROOT, "metrics/cards.json"), "utf8");
const text = (result: { content: Array<{ text: string }> }) => result.content[0].text;

function indexWith(metricCardsJson?: string) {
  const db = openDatabase(":memory:");
  db.exec(SCHEMA_SQL);
  writeMeta(db, {
    dataStamp: "2026-10-04T00:00:00Z",
    commit: null,
    providersJson: readFileSync(resolve(ROOT, "providers.json"), "utf8"),
    metricCardsJson,
  });
  return db;
}

describe("metric cards", () => {
  it("match metrics/cards/*.toml", () => {
    const result = spawnSync("python3", ["scripts/gen_metric_cards.py", "--check"], {
      cwd: ROOT,
      encoding: "utf8",
      env: { ...process.env, PYTHONUTF8: "1" },
    });
    if (result.error) throw result.error;
    expect(result.status, `${result.stdout}${result.stderr}`).toBe(0);
  }, 30_000);

  it("follow the card format", () => {
    const parsed = metricCardsFileSchema.safeParse(JSON.parse(cardsJson));
    expect(parsed.success, JSON.stringify(parsed.error?.issues?.slice(0, 3))).toBe(true);
  });

  it("give every variant with reference code at least one test value", () => {
    const { cards } = metricCardsFileSchema.parse(JSON.parse(cardsJson));
    for (const variant of cards.flatMap((card) => card.variants)) {
      if (variant.reference) expect(variant.fixtures?.length ?? 0, variant.id).toBeGreaterThan(0);
    }
  });

  it("have a docs page for each card, for search_docs", () => {
    const { cards } = metricCardsFileSchema.parse(JSON.parse(cardsJson));
    for (const card of cards) {
      expect(readFileSync(resolve(ROOT, "docs/metric-cards", `${card.id}.md`), "utf8")).toContain(`get_metric("${card.id}")`);
    }
  });
});

describe("get_metric and list_metrics", () => {
  it("reads the cards stored in the index", () => {
    expect(readMetricCards(indexWith(cardsJson)).map((card) => card.id)).toContain("ppda");
  });

  it("returns a whole card with every variant", () => {
    const out = text(getMetric(indexWith(cardsJson), { id: "ppda" }));
    expect(out).toContain("# PPDA (passes allowed per defensive action)");
    expect(out).toContain("## ppda.statsbomb-hudl: Hudl StatsBomb");
    expect(out).toContain("## ppda.trainor-2014");
    expect(out).toMatch(/Cite a value with the exact variant ID/);
  });

  it("returns one variant by its ID, with the card's caveats", () => {
    const out = text(getMetric(indexWith(cardsJson), { id: "PPDA.statsbomb-hudl" }));
    expect(out).toContain("## ppda.statsbomb-hudl");
    expect(out).not.toContain("## ppda.wyscout");
    expect(out).toMatch(/Test value:\*\* Argentina, .* 7\.4222/);
    expect(out).toContain("## Caveats");
  });

  it("finds a card by an alias", () => {
    expect(text(getMetric(indexWith(cardsJson), { id: "passes per defensive action" }))).toContain("Card `ppda`");
  });

  it("names the cards when an ID is unknown", () => {
    const result = getMetric(indexWith(cardsJson), { id: "ppda.made-up" });
    expect(result.isError).toBe(true);
    expect(text(result)).toMatch(/Cards: .*ppda/);
  });

  it("says so when the index predates metric cards", () => {
    const result = listMetrics(indexWith());
    expect(result.isError).toBe(true);
    expect(text(result)).toMatch(/no metric cards yet/);
  });

  it("lists cards with their variants", () => {
    const out = text(listMetrics(indexWith(cardsJson)));
    expect(out).toMatch(/`ppda\.statsbomb-hudl`: Hudl StatsBomb \(reference code: exact/);
    expect(out).toMatch(/`ppda\.wyscout`: Wyscout \(reference code: none yet\)/);
  });
});
