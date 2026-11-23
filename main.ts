// Entry program for make.fun's "promote make-your-own-bounty on X" bounty.
//
// The contest is decided on X, not here: the post, its photo and the play
// code do the talking. This script has one dull job — hand the grader the
// address of that post. It reads POST.json from the bot directory and places
// an exact copy in the output directory, where the gate picks it up and
// looks the post up to count its replies, reposts and quotes.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const POST_FILE = 'POST.json';

function dirFromEnv(name: string, fallback: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    return fallback;
  }
  return value;
}

function main(): void {
  const sourceDir = dirFromEnv('MAKEFUN_BOT_DIR', '/bot');
  const targetDir = dirFromEnv('MAKEFUN_OUTPUT_DIR', '/output');

  const sourcePath = join(sourceDir, POST_FILE);
  const targetPath = join(targetDir, POST_FILE);

  let payload: Buffer;
  try {
    payload = readFileSync(sourcePath);
  } catch (err) {
    console.error(`could not read ${sourcePath}: ${(err as Error).message}`);
    process.exit(1);
  }

  mkdirSync(targetDir, { recursive: true });

  try {
    writeFileSync(targetPath, payload);
  } catch (err) {
    console.error(`could not write ${targetPath}: ${(err as Error).message}`);
    process.exit(1);
  }

  console.log(`wrote ${targetPath} (${payload.length} bytes)`);
}

main();
