/**
 * CSV/JSON → validated acquisitions.json.
 *
 * Stub — column mapping finalized when the librarian's sample export is shared.
 * Wire it to real parsing (e.g. papaparse / csv-parse) once columns are known.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { AcquisitionsFileSchema } from './schema.ts';

const [, , inputPath] = process.argv;
if (!inputPath) {
  console.error('usage: tsx src/ingest.ts <path-to-export.csv|.json>');
  process.exit(2);
}

console.error('ingest: not yet implemented — waiting on librarian sample export.');
console.error(`would ingest: ${inputPath}`);

// Placeholder: re-validate the current acquisitions.json so the stub still exercises the schema.
const out = join(import.meta.dirname, '..', 'data', 'acquisitions.json');
const current = JSON.parse(readFileSync(out, 'utf8'));
const parsed = AcquisitionsFileSchema.parse(current);
writeFileSync(out, `${JSON.stringify(parsed, null, 2)}\n`);
console.error(`roundtripped ${parsed.records.length} records through the schema.`);
