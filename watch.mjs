import { watch } from 'node:fs';
import { join } from 'node:path';
import { build } from './builder.mjs';

const localeDir = join(process.cwd(), 'locale');

let timer = null;
let building = false;
let pending = false;

// Debounce: editors fire many events per save
async function rebuild(reason) {
  if (building) {
    pending = true;
    return;
  }
  building = true;
  try {
    console.log(`\n↻ rebuild (${reason})`);
    await build();
  } catch (err) {
    console.error('✗ build failed:', err.message);
  } finally {
    building = false;
    if (pending) {
      pending = false;
      scheduleRebuild('queued');
    }
  }
}

function scheduleRebuild(reason) {
  clearTimeout(timer);
  timer = setTimeout(() => rebuild(reason), 150);
}

console.log(`Watching ${localeDir} ... (Ctrl+C to stop)`);
await rebuild('initial');

watch(localeDir, { recursive: true }, (_event, filename) => {
  if (filename && filename.endsWith('.json')) {
    scheduleRebuild(filename);
  }
});
