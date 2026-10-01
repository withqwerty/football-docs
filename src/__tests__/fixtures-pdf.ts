/**
 * Builds a small PDF in memory for tests, so the repository holds no PDF file
 * (the public-safety test refuses any committed PDF). Text is Helvetica, one
 * line per entry, ASCII only.
 */
export function makePdf(pages: string[][], info: { title?: string; author?: string } = {}): Uint8Array {
  const pdfString = (text: string) => text.replace(/[()\\]/g, (ch) => `\\${ch}`);
  const objects: string[] = [];
  const pageIds = pages.map((_, i) => 4 + i * 2);
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`;
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  pages.forEach((lines, i) => {
    const content = `BT /F1 10 Tf 12 TL 40 760 Td ${lines.map((line) => `(${pdfString(line)}) Tj T*`).join(" ")} ET`;
    objects[4 + i * 2] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${5 + i * 2} 0 R >>`;
    objects[5 + i * 2] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  });
  const infoId = objects.length;
  objects[infoId] = `<< ${info.title ? `/Title (${pdfString(info.title)}) ` : ""}${info.author ? `/Author (${pdfString(info.author)})` : ""} >>`;

  let out = "%PDF-1.4\n";
  const offsets: number[] = [];
  for (let id = 1; id < objects.length; id++) {
    offsets[id] = out.length;
    out += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }
  const xref = out.length;
  out += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id++) out += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  out += `trailer\n<< /Size ${objects.length} /Root 1 0 R /Info ${infoId} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new TextEncoder().encode(out);
}

/** A three-section paper, long enough to count as a paper's text. */
export function samplePaper(): Uint8Array {
  const filler = (topic: string) =>
    Array.from({ length: 30 }, (_, i) => `Sentence ${i} on ${topic} in football matches and event data for analysis.`);
  return makePdf(
    [
      ["Valuing Actions in Football", "Ada Lovelace", "Abstract", ...filler("action values").slice(0, 10), "1 Introduction", ...filler("possession")],
      ["2 Method", "We value each action by the change in the probability of scoring a goal within the next ten actions.", ...filler("probabilities")],
      ["3 Results", "Passes into the box add the most value per action.", ...filler("results"), "References", "Decroos et al. 2019."],
    ],
    { title: "Valuing Actions in Football", author: "Ada Lovelace" },
  );
}
