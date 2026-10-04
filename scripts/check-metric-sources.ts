/**
 * Re-check every metric card quote against its live source with match_quote.
 * Run before a release (pnpm metrics:sources). Quotes marked "browser" are
 * listed but not checked: their pages build their text with JavaScript, which
 * match_quote cannot read. Exits 1 when a quote no longer matches.
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { metricCardsFileSchema } from "../src/metrics.js";
import { matchQuote } from "../src/papers/tools.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { cards } = metricCardsFileSchema.parse(JSON.parse(readFileSync(resolve(ROOT, "metrics/cards.json"), "utf8")));

let failures = 0;
for (const card of cards) {
  for (const variant of card.variants) {
    const { source } = variant;
    if (source.check === "browser") {
      console.log(`  ---  ${variant.id}: checked in a browser on ${source.checked}; re-check by hand (${source.id})`);
      continue;
    }
    const reply = (await matchQuote({ source: source.id, quote: source.quote })).content[0].text;
    const result = reply.match(/\*\*Result: (exact|normalised|close|none)/)?.[1] ?? "error";
    const ok = result === "exact" || result === "normalised";
    if (!ok) failures++;
    console.log(`  ${ok ? "ok " : "NEW"}  ${variant.id}: ${result}${ok ? "" : ` (card says ${source.check}; ${source.id})`}`);
  }
}
if (failures) {
  console.log(`\n${failures} quote(s) no longer match their source. Re-read the source and update the card.`);
  process.exit(1);
}
