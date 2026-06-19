import { readdir, writeFile, readFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

export const LANGS = ['en', 'zh', 'cn'];

const localeDir = join(process.cwd(), 'locale');
const distDir = join(process.cwd(), 'dist');

async function buildLang(lang) {
  const langDir = join(localeDir, lang);
  const entries = await readdir(langDir, { withFileTypes: true });

  let allContent = {};

  for (const dirent of entries) {
    if (dirent.isFile() && dirent.name.endsWith('.json')) {
      const filePath = join(langDir, dirent.name);
      const fileContent = await readFile(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);

      allContent = {
        ...allContent,
        ...jsonData,
      };
    }
  }

  await mkdir(distDir, { recursive: true });
  await writeFile(
    join(distDir, `${lang}.json`),
    JSON.stringify(allContent, null, 4)
  );

  return Object.keys(allContent).length;
}

// Merge every locale/<lang>/*.json into a single dist/<lang>.json
export async function build() {
  for (const lang of LANGS) {
    const keys = await buildLang(lang);
    console.log(`✓ dist/${lang}.json (${keys} keys)`);
  }
}

// Run directly: `node builder.mjs`
if (import.meta.url === `file://${process.argv[1]}`) {
  build().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
