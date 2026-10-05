/**
 * Metric cards: one checked definition per football metric, with each
 * published variant under its own ID, its source and a checked quote, and
 * where possible reference code with test values on public open data.
 *
 * Cards are written in metrics/cards/*.toml. scripts/gen_metric_cards.py turns
 * them into metrics/cards.json, which ingest stores in the index's meta table
 * (key metric_cards), and into docs/metric-cards/<id>.md pages for search_docs.
 * get_metric and list_metrics read the meta copy, so a card update reaches
 * installed servers with the next data release.
 */

import { z } from "zod";
import type { Database } from "./sqlite.js";

const sourceSchema = z.object({
  kind: z.enum(["web", "paper"]),
  id: z.string(),
  title: z.string(),
  author: z.string(),
  date: z.string().optional(),
  quote: z.string().max(400),
  check: z.enum(["exact", "normalised", "browser"]),
  checked: z.string(),
  check_note: z.string().optional(),
});

const fixtureSchema = z.object({
  match_id: z.number().int(),
  label: z.string(),
  team: z.string(),
  expected: z.number(),
  tolerance: z.number().optional(),
});

const variantSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9_]*\.[a-z0-9][a-z0-9.-]*$/),
  name: z.string(),
  definition: z.string(),
  formula: z.string(),
  zone: z.string(),
  counts: z.string().optional(),
  notes: z.array(z.string()).optional(),
  source: sourceSchema,
  reference: z
    .object({
      function: z.string(),
      dataset: z.string(),
      exact: z.boolean(),
      mapping: z.string(),
      /** Pinned extra inputs from metrics/fixtures.json, such as a published xT surface. */
      requires: z.array(z.string()).optional(),
    })
    .optional(),
  fixtures: z.array(fixtureSchema).optional(),
});

export const metricCardSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9_]*$/),
  name: z.string(),
  aliases: z.array(z.string()).optional(),
  data: z.enum(["event", "tracking"]),
  unit: z.string(),
  measures: z.string(),
  direction: z.string(),
  version: z.number().int(),
  updated: z.string(),
  summary: z.string(),
  caveats: z.array(z.string()),
  related: z.array(z.string()).optional(),
  origin: z.object({ text: z.string(), source: z.string() }),
  variants: z.array(variantSchema).min(1),
});

export const metricCardsFileSchema = z.object({
  format: z.literal("football-docs/metric-cards/v1"),
  cards: z.array(metricCardSchema),
});

export type MetricCard = z.infer<typeof metricCardSchema>;
export type MetricVariant = z.infer<typeof variantSchema>;

type ToolResponse = { isError?: boolean; content: Array<{ type: "text"; text: string }> };
const textResult = (text: string, isError = false): ToolResponse => ({ isError: isError || undefined, content: [{ type: "text", text }] });

/** The cards stored in the index, or [] for an index built before cards existed. */
export function readMetricCards(db: Database): MetricCard[] {
  const hasMeta = db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'meta'").get();
  if (!hasMeta) return [];
  const row = db.prepare("SELECT value FROM meta WHERE key = 'metric_cards'").get() as { value: string } | undefined;
  if (!row) return [];
  const parsed = metricCardsFileSchema.safeParse(JSON.parse(row.value));
  return parsed.success ? parsed.data.cards : [];
}

const NO_CARDS =
  "This docs index has no metric cards yet. They arrive with a newer docs index; the server checks for one daily.";

function clean(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function referenceLine(variant: MetricVariant): string {
  const ref = variant.reference;
  if (!ref) return "none yet";
  return `${ref.exact ? "exact" : "approximation"} (${ref.function} on ${ref.dataset})`;
}

function formatVariant(variant: MetricVariant): string {
  const source = variant.source;
  const lines = [`## ${variant.id}: ${variant.name}`, "", clean(variant.definition), ""];
  lines.push(`- **Formula:** ${clean(variant.formula)}`);
  lines.push(`- **Zone:** ${clean(variant.zone)}`);
  if (variant.counts) lines.push(`- **Passes counted:** ${clean(variant.counts)}`);
  lines.push(`- **Source:** ${source.title} (${[source.author, source.date].filter(Boolean).join(", ")}): ${source.id}`);
  lines.push(`- **Quote** (${source.check}, checked ${source.checked}): "${source.quote}"`);
  if (source.check_note) lines.push(`- **Quote check note:** ${clean(source.check_note)}`);
  lines.push(`- **Reference code:** ${referenceLine(variant)}`);
  if (variant.reference) lines.push(`- **Mapping:** ${clean(variant.reference.mapping)}`);
  for (const fixture of variant.fixtures ?? []) {
    lines.push(`- **Test value:** ${fixture.team}, ${fixture.label} (match ${fixture.match_id}): ${fixture.expected}`);
  }
  for (const note of variant.notes ?? []) lines.push(`- ${clean(note)}`);
  return lines.join("\n");
}

function formatCardHead(card: MetricCard): string[] {
  return [
    `# ${card.name}`,
    "",
    `Card \`${card.id}\`, version ${card.version}, updated ${card.updated}.`,
    "",
    clean(card.summary),
    "",
    `- **Measures:** ${clean(card.measures)}`,
    `- **Direction:** ${clean(card.direction)}`,
    `- **Unit:** ${card.unit}`,
    `- **Origin:** ${clean(card.origin.text)} (${card.origin.source})`,
    "",
  ];
}

export function findMetric(cards: MetricCard[], rawId: string): { card: MetricCard; variant?: MetricVariant } | null {
  const id = rawId.trim().toLowerCase();
  for (const card of cards) {
    if (card.id === id) return { card };
    const variant = card.variants.find((entry) => entry.id === id);
    if (variant) return { card, variant };
  }
  // Names and aliases ("passes per defensive action", "PPDA").
  for (const card of cards) {
    if (card.name.toLowerCase() === id || (card.aliases ?? []).some((alias) => alias.toLowerCase() === id)) return { card };
  }
  return null;
}

export function getMetric(db: Database, args: { id: string }): ToolResponse {
  const cards = readMetricCards(db);
  if (!cards.length) return textResult(NO_CARDS, true);
  const found = findMetric(cards, args.id);
  if (!found) {
    return textResult(
      `No metric card or variant "${args.id}". Cards: ${cards.map((card) => card.id).join(", ")}. Use list_metrics for variants.`,
      true,
    );
  }
  const { card, variant } = found;
  const lines = formatCardHead(card);
  if (variant) {
    lines.push(formatVariant(variant), "", `Other variants: ${card.variants.filter((v) => v !== variant).map((v) => v.id).join(", ")}.`);
  } else {
    lines.push("## Variants", "");
    for (const entry of card.variants) lines.push(`- \`${entry.id}\`: ${entry.name}. ${clean(entry.zone)} Reference code: ${referenceLine(entry)}.`);
    lines.push("");
    for (const entry of card.variants) lines.push(formatVariant(entry), "");
  }
  lines.push("", "## Caveats", "", ...card.caveats.map((caveat) => `- ${clean(caveat)}`));
  if (card.related?.length) {
    const known = new Set(cards.map((entry) => entry.id));
    lines.push("", `Related: ${card.related.map((id) => (known.has(id) ? id : `${id} (no card yet)`)).join(", ")}.`);
  }
  lines.push("", "Cite a value with the exact variant ID: values from different variants are not comparable.");
  return textResult(lines.join("\n").trimEnd());
}

export function listMetrics(db: Database): ToolResponse {
  const cards = readMetricCards(db);
  if (!cards.length) return textResult(NO_CARDS, true);
  const lines = [`# Metric cards (${cards.length})`, ""];
  for (const card of cards) {
    lines.push(`## ${card.id}: ${card.name}`, "", clean(card.measures), "");
    for (const variant of card.variants) lines.push(`- \`${variant.id}\`: ${variant.name} (reference code: ${referenceLine(variant)})`);
    lines.push("");
  }
  lines.push("Read a card or one variant with get_metric(id).");
  return textResult(lines.join("\n").trimEnd());
}
