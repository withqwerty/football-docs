/**
 * Builds docs/skillcorner/dynamic-events.md from SkillCorner's Dynamic Events
 * CSV Specifications PDF, so the attribute tables stay word for word.
 *
 * The tables come from the PDF: rows are split at the PDF's drawn row borders
 * and cells at its column headers. The intro and the framing line are ours and
 * live here. The changelog is copied from PDF pages 2-3 and lives here too;
 * the script fails if its words differ from those pages.
 *
 * Maintainer-only; needs the network unless --pdf is given, so it is not run
 * in CI. `pnpm check:upstream` reports when the PDF's hash changes.
 *
 * Usage:
 *   pnpm skillcorner:spec                  # download the PDF, write the page
 *   pnpm skillcorner:spec --check          # diff only; exit 1 if the page differs
 *   pnpm skillcorner:spec --pdf spec.pdf   # use a local copy
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractText, getDocumentProxy } from "unpdf";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PAGE_PATH = resolve(__dirname, "..", "docs", "skillcorner", "dynamic-events.md");

export const SPEC_URL =
  "https://26560301.fs1.hubspotusercontent-eu1.net/hubfs/26560301/Guides/Dynamic%20Events/20250216%20-%20Dynamic%20Events%20CSV%20Specifications.pdf";
/** SHA-256 of the PDF the page was built from. check_upstream.py reads this line. */
export const SPEC_SHA256 = "1b737ffc6882eca1501b6fefab69893fddb8703a8411034256d682453739699a";
const SPEC_NAME = "Dynamic Events CSV Specifications 2025/02/16";
const CRAWLED_AT = "2026-11-24";

/** Our intro, between the title and the changelog. */
const INTRO: string[] = [
  "Column definitions for SkillCorner's dynamic-events CSV, as SkillCorner's *Dynamic Events CSV Specifications* (2025/02/16) gives them. The specification is linked from the [SkillCorner open-data README](https://github.com/SkillCorner/opendata) and from SkillCorner's article [SkillCorner Open Data #4: Visualising Off-Ball Runs](https://skillcorner.com/articles/skillcorner-open-data-4-visualising-off-ball-runs). The API serves this file at `GET /match/{match_id}/dynamic_events/`, whose `data_version` parameter takes `2` or `3` and defaults to `2` in SkillCorner's OpenAPI document; see [api-endpoints.md](api-endpoints.md). For the event types see [concepts.md](concepts.md).",
  "",
  "The specification is older than the files in the open data. The columns it does not define, and the values the files spell differently, are in [dynamic-events-delivered-values.md](dynamic-events-delivered-values.md). This specification does not define the columns of the `phases_of_play` CSV; SkillCorner publishes those in a separate *Phases of Play CSV Specifications* document.",
  "",
  "The specification introduces its attribute tables as follows:",
  "",
  "> The goal here is to deliver an exhaustive list of the attributes grouped under key themes. The order of the attributes does not necessarily reflect the order in which the columns are in the csv files.",
  "",
  "The **Events** column lists the event types each attribute applies to: Off-Ball Run (OBR), Passing Option (PO), Player Possession (PP) and On-Ball Engagement (OBE).",
];

/** PDF pages 2-3 as markdown. Its words must equal those pages' words. */
const CHANGELOG: string[] = [
  "## Changelog",
  "",
  "The changes in SkillCorner's *Dynamic Events CSV Specifications* (2025/02/16) since its earlier versions.",
  "",
  "**Changelog Since 2024/07/12**",
  "",
  "1/ Addition of one New Out of Possession Dynamic Event: On-Ball Engagement<br>",
  "2/ Addition of Phase of Play information.<br>",
  "3/ Reordering of the columns and bug correction.",
  "",
  "- To include phases of play properly we reorder the columns in the csv file that is delivered.",
  "- We noticed that previously the values for the game_interruption_before, game_interruption_before_id were inverted with game_interruption_after, game_interruption_after_id. We have corrected this issue in the new version.",
  "",
  "**Changelog Since 2024/02/15**",
  "",
  "1/ Addition of two New Dynamic Events: Passing Options and Player Possessions<br>",
  "2/ Changes to Off-Ball runs Dynamic Event",
  "",
  "New data points including",
  "",
  "- Positions (LWB, LB, CD, ...) of the player in possession and the player performing the off-ball runs.",
  "- Game states (winning, losing, drawing) and team scores at the moment of the event.",
  "- last_defensive_line_height (distance of the last defender from their own goal).",
  "",
  "Renaming of attributes",
  "",
  "| Former name | New name |",
  "|---|---|",
  "| player_possession_frame_start | associated_player_possession_frame_start |",
  "| passing_option | predicted_passing_option |",
  "| passing_option_start | passing_option_at_start |",
  "| simultaneous_runs | n_simultaneous_runs |",
  "| opponents_ahead_start | n_opponents_ahead_start |",
  "| opponents_ahead_end | n_opponents_ahead_end |",
  "| opponents_overtaken | n_opponents_overtaken |",
  "",
  "Give and Go",
  "",
  "Previously, we classified as give_and_go any off-ball runs that started within 2 seconds after a pass from the same player.<br>Based on feedback we have received we have decided to restrict it to off-ball runs of subtype behind, cross_receiver, overlap, pulling_half_space, pulling_wide, run_ahead_of_the_ball, underlap, support (for support run we also impose that it starts in the attacking third and in a half_space/the central channel).<br>As a consequence, coming_short, dropping_off and some support off-ball runs are not taken into account to determine whether there is a give and go or not.",
  "",
  "Event filtering",
  "",
  "Previously, we only considered off-ball runs where we were able to match the tracking data with the end of the associated player possession.<br>Now, we include cases where tracking data could not be matched. We provide the field is_player_possession_end_matched to indicate whether the end of the possession was successfully matched.",
];

const FRAMING =
  "From SkillCorner's *Dynamic Events CSV Specifications* (2025/02/16). Events: Off-Ball Run (OBR), Passing Option (PO), Player Possession (PP), On-Ball Engagement (OBE). The delivered CSV spells some values differently; see [dynamic-events-delivered-values.md](dynamic-events-delivered-values.md).";

const TICKS = ["OBR", "PO", "PP", "OBE"] as const;
const FIRST_TABLE_PAGE = 27;

type Item = { str: string; x: number; y: number; w: number; size: number };
type Line = { y: number; size: number; text: string };
type Row = { attr: string; type: string; desc: string[]; vals: string[]; ticks: string[] };
type Section = { title: string; intro: ({ heading: string } | { text: string })[]; rows: Row[] };

/** Join items on one visual line; no space where glyph runs touch (ligatures). */
function joinLine(items: Item[]): string {
  items.sort((a, b) => a.x - b.x);
  let out = "";
  let end: number | null = null;
  for (const it of items) {
    if (end !== null && it.x - end > 1.5 && !out.endsWith(" ") && !it.str.startsWith(" ")) out += " ";
    out += it.str;
    end = it.x + it.w;
  }
  return out.replace(/\s+/g, " ").trim();
}

/** Group items into visual lines, top to bottom. */
function lines(items: Item[]): Line[] {
  const groups: { y: number; items: Item[] }[] = [];
  for (const it of [...items].sort((a, b) => b.y - a.y)) {
    const g = groups.find((g) => Math.abs(g.y - it.y) < 3);
    if (g) g.items.push(it);
    else groups.push({ y: it.y, items: [it] });
  }
  return groups
    .map((g) => ({ y: g.y, size: Math.max(...g.items.map((i) => i.size)), text: joinLine(g.items) }))
    .filter((l) => l.text);
}

type Matrix = [number, number, number, number, number, number];
const mul = (m: Matrix, n: Matrix): Matrix => [
  m[0] * n[0] + m[2] * n[1],
  m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4],
  m[1] * n[4] + m[3] * n[5] + m[5],
];

// pdf.js operator codes (OPS.save, OPS.restore, OPS.transform, OPS.constructPath).
const OP_SAVE = 10;
const OP_RESTORE = 11;
const OP_TRANSFORM = 12;
const OP_PATH = 91;

type PdfPage = Awaited<ReturnType<Awaited<ReturnType<typeof getDocumentProxy>>["getPage"]>>;

/** The y of each full-width horizontal rule on a page: the table's row borders. */
async function rules(page: PdfPage): Promise<number[]> {
  const ops = await page.getOperatorList();
  let ctm: Matrix = [1, 0, 0, 1, 0, 0];
  const stack: Matrix[] = [];
  const ys: number[] = [];
  ops.fnArray.forEach((f, i) => {
    const a = ops.argsArray[i];
    if (f === OP_SAVE) stack.push(ctm);
    else if (f === OP_RESTORE) ctm = stack.pop() ?? [1, 0, 0, 1, 0, 0];
    else if (f === OP_TRANSFORM) ctm = mul(ctm, a as Matrix);
    else if (f === OP_PATH && a[2]) {
      const [x0, y0, x1, y1] = a[2] as number[];
      const p0 = [ctm[0] * x0 + ctm[2] * y0 + ctm[4], ctm[1] * x0 + ctm[3] * y0 + ctm[5]];
      const p1 = [ctm[0] * x1 + ctm[2] * y1 + ctm[4], ctm[1] * x1 + ctm[3] * y1 + ctm[5]];
      if (Math.abs(p1[1] - p0[1]) < 1 && Math.abs(p1[0] - p0[0]) > 600) ys.push(p0[1]);
    }
  });
  return [...new Set(ys.map((y) => Math.round(y)))].sort((a, b) => b - a);
}

/**
 * On a few pages one text run holds the type and the start of the description
 * ("timest Time the event starts ..."). Split it at the first space, at the
 * Description column's x.
 */
function splitTypeRuns(items: Item[]): void {
  const h = items.find((i) => i.str === "Description");
  const t = items.find((i) => i.str === "Type");
  if (!h || !t) return;
  for (const it of [...items]) {
    const sp = it.str.indexOf(" ");
    if (it.x >= t.x - 8 && it.x < h.x - 4 && sp > 0 && it.x + it.w > h.x) {
      items.push({ ...it, str: it.str.slice(sp + 1), x: h.x });
      it.str = it.str.slice(0, sp);
      it.w = h.x - it.x - 6;
    }
  }
}

function startSection(ls: Line[]): Section {
  const big = Math.max(...ls.map((l) => l.size));
  let title: string | null = null;
  const intro: Section["intro"] = [];
  for (const l of ls) {
    if (l.size >= 19 && title === null) title = l.text;
    else if (l.size > 11.5) intro.push({ heading: l.text });
    else intro.push({ text: l.text });
  }
  return { title: title ?? (big > 11.5 ? ls[0].text : "(continued)"), intro, rows: [] };
}

/** The attribute tables of the PDF, one section per theme. */
export async function extractSections(data: Uint8Array): Promise<{ sections: Section[]; pages: string[] }> {
  const pdf = await getDocumentProxy(new Uint8Array(data));
  try {
    const sections: Section[] = [];
    for (let n = FIRST_TABLE_PAGE; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      const content = await page.getTextContent();
      const items: Item[] = content.items
        .filter((i) => "str" in i && i.str.trim())
        .map((i) => {
          const t = i as { str: string; transform: number[]; width: number };
          return { str: t.str, x: t.transform[4], y: t.transform[5], w: t.width, size: t.transform[0] };
        })
        .filter((i) => i.y > 70); // drop the "Page N" footer
      splitTypeRuns(items);
      const header = items.find((i) => i.str === "Attribute");
      if (!header) {
        if (items.length) sections.push(startSection(lines(items)));
        continue;
      }
      const hy = header.y;
      const col = (name: string) => {
        const it = items.find((i) => i.str === name && Math.abs(i.y - hy) < 2);
        if (!it) throw new Error(`page ${n}: no "${name}" column header`);
        return it.x;
      };
      const typeX = col("Type");
      const descX = col("Description");
      const valX = col("Values");
      const tickX = TICKS.map(col);

      const above = items.filter((i) => i.y > hy + 2);
      if (above.length) sections.push(startSection(lines(above)));
      const current = sections.at(-1);
      if (!current) throw new Error(`page ${n}: table before any section title`);
      const colOf = (i: Item) =>
        i.x < typeX - 8 ? "attr" : i.x < descX - 4 ? "type" : i.x < valX - 4 ? "desc" : i.x < tickX[0] - 10 ? "vals" : "tick";
      const rs = (await rules(page)).filter((y) => y < hy);
      for (let r = 0; r + 1 < rs.length; r++) {
        const inRow = items.filter((i) => i.y < rs[r] && i.y > rs[r + 1]);
        if (!inRow.length) continue;
        const part = (c: string) => lines(inRow.filter((i) => i.str !== "✓" && colOf(i) === c)).map((l) => l.text);
        const ticks = new Set<string>();
        for (const it of inRow.filter((i) => i.str === "✓")) {
          let k = 0;
          tickX.forEach((tx, j) => {
            if (Math.abs(tx - it.x) < Math.abs(tickX[k] - it.x)) k = j;
          });
          ticks.add(TICKS[k]);
        }
        const row = { attr: part("attr").join(""), type: part("type").join(" "), desc: part("desc"), vals: part("vals") };
        // A row split by a page break continues the row above it.
        const prev = current.rows.at(-1);
        if (!row.attr && prev) {
          prev.type += row.type;
          prev.desc.push(...row.desc);
          prev.vals.push(...row.vals);
          prev.ticks = TICKS.filter((t) => ticks.has(t) || prev.ticks.includes(t));
        } else {
          current.rows.push({ ...row, ticks: TICKS.filter((t) => ticks.has(t)) });
        }
      }
    }
    const { text } = await extractText(pdf, { mergePages: false });
    return { sections, pages: text };
  } finally {
    await pdf.loadingTask.destroy();
  }
}

function isLabel(line: string): boolean {
  return line.split(" ").length <= 4 && /^[A-Z]/.test(line) && !/[.,:;)]$/.test(line);
}

/** Description lines as one cell: a new paragraph after a sentence, a label or a bullet. */
function joinDesc(ls: string[]): string {
  return ls.reduce((out, line, i) => {
    if (i === 0) return line;
    const prev = ls[i - 1];
    const newPar =
      /[.:]$/.test(prev) || /^[-●•]/.test(line) || isLabel(prev) || (isLabel(line) && /[.:]$/.test(prev));
    return out + (newPar ? "<br>" : " ") + line;
  }, "");
}

/** Values lines as one cell; a comma list wrapped mid-token ("RB,L" + "DM,DM") joins with no space. */
function joinVals(ls: string[]): string {
  return ls.reduce((out, line, i) => {
    if (i === 0) return line;
    return out + (ls[i - 1].trim().includes(" ") || line.trim().includes(" ") ? " " : "") + line;
  }, "");
}

const cell = (text: string) => text.replace(/\|/g, "\\|").trim();

export function renderPage(sections: Section[]): string {
  const [first, ...rest] = sections;
  const intro = first.intro.flatMap((i) => ("text" in i ? [i.text] : []));
  // The first section's title is the document's title; its third intro line is the first theme.
  const firstTheme = first.intro[2];
  if (!firstTheme || !("heading" in firstTheme)) throw new Error("first section: no theme heading");
  const themes: Section[] = [{ ...first, title: firstTheme.heading, intro: first.intro.slice(3) }, ...rest];
  if (intro.slice(0, 2).join(" ") !== INTRO_QUOTE) {
    throw new Error(`the PDF's opening text changed:\n${intro.slice(0, 2).join(" ")}`);
  }
  const out = [
    "---",
    `source_url: ${SPEC_URL}`,
    "source_type: crawled",
    `upstream_version: ${SPEC_NAME}`,
    `crawled_at: ${CRAWLED_AT}`,
    "---",
    "",
    "# SkillCorner Dynamic Events",
    "",
    ...INTRO,
    "",
    ...CHANGELOG,
    "",
  ];
  for (const s of themes) {
    out.push(`## ${s.title}`, "");
    const text = s.intro.flatMap((i) => ("text" in i ? [i.text] : []));
    if (text.length) out.push(text.join(" "), "");
    out.push(FRAMING, "", "| Field | Type | Description | Values | Events |", "|---|---|---|---|---|");
    for (const r of s.rows) {
      out.push(
        `| \`${r.attr}\` | ${r.type.replace(/ /g, "")} | ${cell(joinDesc(r.desc))} | ${cell(joinVals(r.vals))} | ${r.ticks.join(", ")} |`,
      );
    }
    out.push("");
  }
  return `${out.join("\n").trimEnd()}\n`;
}

/** The PDF's opening two lines, which INTRO quotes. */
const INTRO_QUOTE =
  "The goal here is to deliver an exhaustive list of the attributes grouped under key themes. The order of the attributes does not necessarily reflect the order in which the columns are in the csv files.";

const words = (s: string) => s.split(/\s+/).filter(Boolean);

/** Words of the changelog as the PDF prints them, from pages 2-3. */
export function changelogWordsDiffer(pages: string[]): string | null {
  const pdf = words(
    pages
      .slice(1, 3)
      .join("\n")
      .replace(/^Page \d+$/gm, "")
      .replace(/●/g, ""),
  );
  const ours = words(
    CHANGELOG.slice(1) // the "## Changelog" heading
      .filter((l) => !l.startsWith("The changes in SkillCorner's") && !/^\|-/.test(l))
      .join("\n")
      .replace(/<br>/g, " ")
      .replace(/\*\*/g, "")
      .replace(/^- /gm, "")
      .replace(/\|/g, " "),
  );
  const i = pdf.findIndex((w, k) => w !== ours[k]);
  if (i === -1 && pdf.length === ours.length) return null;
  const at = i === -1 ? Math.min(pdf.length, ours.length) : i;
  return `word ${at}: PDF "${pdf.slice(at, at + 8).join(" ")}" / page "${ours.slice(at, at + 8).join(" ")}"`;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const pdfArg = args.indexOf("--pdf");
  let data: Uint8Array;
  if (pdfArg >= 0) data = new Uint8Array(readFileSync(args[pdfArg + 1]));
  else {
    const res = await fetch(SPEC_URL);
    if (!res.ok) throw new Error(`${SPEC_URL}: HTTP ${res.status}`);
    data = new Uint8Array(await res.arrayBuffer());
  }
  const sha = createHash("sha256").update(data).digest("hex");
  if (sha !== SPEC_SHA256) {
    console.error(`The PDF changed: sha256 ${sha}, pinned ${SPEC_SHA256}.`);
    console.error("Read the new PDF, update SPEC_NAME, CHANGELOG and SPEC_SHA256 here, then run again.");
    process.exit(1);
  }
  const { sections, pages } = await extractSections(data);
  const changelog = changelogWordsDiffer(pages);
  if (changelog) {
    console.error(`CHANGELOG differs from PDF pages 2-3 at ${changelog}`);
    process.exit(1);
  }
  const page = renderPage(sections);
  const current = readFileSync(PAGE_PATH, "utf8");
  if (check) {
    if (page === current) {
      console.log("dynamic-events.md is up to date");
      return;
    }
    const a = current.split("\n");
    const b = page.split("\n");
    const at = a.findIndex((l, i) => l !== b[i]);
    console.error(`dynamic-events.md differs from the PDF at line ${at + 1}:\n- ${a[at]}\n+ ${b[at]}`);
    process.exit(1);
  }
  writeFileSync(PAGE_PATH, page);
  console.log(`wrote ${PAGE_PATH} (${sections.reduce((n, s) => n + s.rows.length, 0)} fields)`);
}

const isDirectRun =
  process.argv[1]?.endsWith("skillcorner-spec.ts") || process.argv[1]?.endsWith("skillcorner-spec.js");
if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
