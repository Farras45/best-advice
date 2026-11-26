// best-advice: writes the winning one-sentence entry to /output/entry.txt.
//
// The entry is a single sentence (<= 200 chars) about the best advice the
// writer ever received: a failed maths paper in 2009, a teacher's line
// ("A mark is a photograph, not a mirror"), and the paper kept in a drawer
// to this day. Three beats: scene -> advice spoken -> what it changed.
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// The winning line, chosen by blind pairwise judging over five variants.
const ENTRY_TEXT =
  "After I failed maths in 2009, Mrs Hartono slid the paper back and said, " +
  "'A mark is a photograph, not a mirror,' and I keep that failed paper in " +
  "my desk drawer to this day.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// not only white space, and the brief requires exactly one sentence.
function validateEntry(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`entry is ${chars} chars, must be 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only white space");
  }
  const sentenceEnds = (text.match(/[.!?]/g) || []).length;
  if (sentenceEnds !== 1 || !text.endsWith(".")) {
    throw new Error(`entry must be exactly one sentence, found ${sentenceEnds} terminators`);
  }
  if (text !== text.trim()) {
    throw new Error("entry has leading or trailing white space");
  }
}

function outputPath(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  return join(resolve(dir), "entry.txt");
}

function main(): void {
  validateEntry(ENTRY_TEXT);
  const target = outputPath();
  mkdirSync(join(target, ".."), { recursive: true });
  // No trailing newline: the file is exactly the sentence, 171 bytes.
  writeFileSync(target, ENTRY_TEXT, "utf8");
  console.log(`wrote ${[...ENTRY_TEXT].length} chars to ${target}`);
}

main();
