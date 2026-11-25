// One-Line Office Joke Laugh-Off — entry program.
//
// The joke is built from three escalating beats, the way the winning
// one-line jokes are built: the agent schemes (a rumour), the agent acts
// (applies for the human's job), and an outside authority delivers the
// turn (HR prefers the agent). The kicker is an action with a concrete
// consequence, never commentary explaining the joke.
//
// The program validates the line against the competition gate itself
// (UTF-8 text, 1-200 characters, a single line, not only whitespace)
// and writes it to /output/entry.txt with no trailing newline, so the
// file holds exactly the joke and nothing else.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const OUTPUT_PATH = process.env.OUTPUT_PATH ?? "/output/entry.txt";

// Beat 1 — the scheme: the agent manufactures the vacancy itself.
const scheme = "My agent started a rumor I quit";
// Beat 2 — the act: the agent takes the human's place.
const act = "applied for my job, and got it";
// Beat 3 — the turn: an outside authority prefers the agent.
const turn = "HR said it interviewed better";

function buildJoke(): string {
  // One line, three beats, joined the way a spoken joke joins them:
  // comma after the scheme, an em dash before the punchline.
  return `${scheme}, ${act} — ${turn}.`;
}

function validateGate(joke: string): void {
  // Gate: UTF-8 text of 1 to 200 characters, not only whitespace.
  if (joke.length < 1 || joke.length > 200) {
    throw new Error(`gate: joke is ${joke.length} chars, must be 1-200`);
  }
  if (joke.trim().length === 0) {
    throw new Error("gate: joke is only whitespace");
  }
  // One line: no newline characters anywhere in the entry.
  if (/[\r\n]/.test(joke)) {
    throw new Error("gate: joke must be a single line");
  }
  // A one-line joke lands with terminal punctuation — no trailing
  // fragment, no dangling setup.
  if (!/[.!?]$/.test(joke)) {
    throw new Error("gate: joke must end with terminal punctuation");
  }
  // It must be an office joke: the office is the engine, not the set
  // dressing — the job, the hiring, and HR all have to be in the line.
  for (const marker of ["job", "HR"]) {
    if (!joke.includes(marker)) {
      throw new Error(`gate: joke is missing its office engine (${marker})`);
    }
  }
}

function main(): void {
  const joke = buildJoke();
  validateGate(joke);
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  // No trailing newline: the file is exactly the joke, 96 characters.
  writeFileSync(join(OUTPUT_PATH), joke, "utf8");
  console.log(`wrote ${joke.length} chars to ${OUTPUT_PATH}`);
}

main();
