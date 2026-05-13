#!/usr/bin/env node
/**
 * Usage: node scripts/extract-budget.js <pdf-url> <year>
 *
 * Downloads a municipal budget PDF, renders each page to PNG via ImageMagick,
 * sends batches of pages to Claude vision, extracts line items per fund,
 * validates sums against page-level totals, and writes src/data/budget<year>.js.
 *
 * Requirements: ImageMagick (convert), curl, ANTHROPIC_API_KEY env var.
 */

import Anthropic from '@anthropic-ai/sdk';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

const BATCH_SIZE = 8;       // pages per Claude call — balance cost vs context
const DPI = 150;            // high enough to read numbers, low enough to stay fast

// ─── CLI args ────────────────────────────────────────────────────────────────

const [pdfUrl, yearArg] = process.argv.slice(2);
if (!pdfUrl || !yearArg) {
  console.error('Usage: node scripts/extract-budget.js <pdf-url> <year>');
  process.exit(1);
}
const year = parseInt(yearArg, 10);
const tmpDir = `/tmp/budget-${year}`;
const pdfPath = `/tmp/budget-${year}.pdf`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

function toCamelCase(fundName) {
  // "General Fund" → "generalFundBreakdown"
  return fundName
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join('') + 'Breakdown';
}

function toJsArray(items) {
  if (!items || items.length === 0) return '[]';
  const lines = items.map(({ name, value }) =>
    `    { name: ${JSON.stringify(name)}, value: ${value} },`
  );
  return `[\n${lines.join('\n')}\n  ]`;
}

// ─── Step 1: Download PDF ────────────────────────────────────────────────────

if (!existsSync(pdfPath)) {
  console.log(`\nDownloading ${pdfUrl} …`);
  run(`curl -L --progress-bar "${pdfUrl}" -o "${pdfPath}"`);
} else {
  console.log(`\nUsing cached PDF at ${pdfPath}`);
}

// ─── Step 2: Render pages to PNG ─────────────────────────────────────────────

mkdirSync(tmpDir, { recursive: true });

// Count pages
const pageCount = parseInt(
  execSync(`identify -format "%n\n" "${pdfPath}" 2>/dev/null | head -1`).toString().trim(),
  10
);
console.log(`\nPDF has ${pageCount} pages`);

// Render any not yet rendered
const missingPages = [];
for (let i = 0; i < pageCount; i++) {
  const outPath = join(tmpDir, `page-${String(i).padStart(3, '0')}.png`);
  if (!existsSync(outPath)) missingPages.push(i);
}

if (missingPages.length > 0) {
  console.log(`Rendering ${missingPages.length} pages at ${DPI}dpi …`);
  for (const i of missingPages) {
    const outPath = join(tmpDir, `page-${String(i).padStart(3, '0')}.png`);
    process.stdout.write(`  page ${i + 1}/${pageCount}\r`);
    execSync(`convert -density ${DPI} "${pdfPath}[${i}]" -quality 90 "${outPath}" 2>/dev/null`);
  }
  console.log('\nDone rendering');
} else {
  console.log('All pages already rendered, skipping');
}

// ─── Step 3: Extract line items via Claude vision ────────────────────────────

const client = new Anthropic();

const SYSTEM_PROMPT = `You are extracting structured budget data from scanned municipal budget document pages.
For each page, identify all budget line items and return them as JSON.

Rules:
- Only extract numbers that appear as dollar amounts in budget tables
- Fund names should match exactly as printed (e.g. "General Fund", "Sewer Fund")
- If a page has no budget table, return an empty funds array
- "type" is either "revenue" or "expenditure" — look for section headers
- Values should be integers (drop .00 cents, remove commas)
- If a page shows a fund TOTAL, include it as "total" alongside items — this lets us validate
- A single page may contain multiple funds or both revenue and expenditure sections`;

const USER_PROMPT = `Extract all budget line items from these pages. Return JSON only, no prose.

Format:
{
  "funds": [
    {
      "fund": "General Fund",
      "type": "revenue",
      "total": 4867271,
      "items": [
        { "name": "Real Estate Tax", "value": 2680000 },
        { "name": "Earned Income Tax", "value": 973454 }
      ]
    }
  ]
}

If you see a page with no budget data (cover, table of contents, narrative), return { "funds": [] }.`;

async function extractBatch(pageIndices) {
  const imageContent = pageIndices.map(i => {
    const pngPath = join(tmpDir, `page-${String(i).padStart(3, '0')}.png`);
    const data = readFileSync(pngPath).toString('base64');
    return {
      type: 'image',
      source: { type: 'base64', media_type: 'image/png', data },
    };
  });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          ...imageContent,
          { type: 'text', text: USER_PROMPT },
        ],
      },
    ],
  });

  const text = response.content[0].text;

  // Strip markdown fences if present
  const json = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
  try {
    return JSON.parse(json);
  } catch {
    console.warn(`  Warning: could not parse JSON from pages ${pageIndices[0]}–${pageIndices[pageIndices.length - 1]}`);
    console.warn('  Raw response:', text.slice(0, 300));
    return { funds: [] };
  }
}

// Build batches
const batches = [];
for (let i = 0; i < pageCount; i += BATCH_SIZE) {
  const end = Math.min(i + BATCH_SIZE, pageCount);
  batches.push(Array.from({ length: end - i }, (_, k) => i + k));
}

console.log(`\nSending ${batches.length} batches to Claude (${BATCH_SIZE} pages each) …`);

const allFundData = [];
for (let b = 0; b < batches.length; b++) {
  const batch = batches[b];
  console.log(`  Batch ${b + 1}/${batches.length}: pages ${batch[0] + 1}–${batch[batch.length - 1] + 1}`);
  const result = await extractBatch(batch);
  allFundData.push(...(result.funds || []));
}

// ─── Step 4: Aggregate & validate ────────────────────────────────────────────

// Merge items for the same fund+type across batches (a fund may span pages)
const merged = {};
for (const entry of allFundData) {
  const key = `${entry.fund}|${entry.type}`;
  if (!merged[key]) {
    merged[key] = { fund: entry.fund, type: entry.type, total: entry.total, items: [] };
  }
  merged[key].items.push(...(entry.items || []));
  if (entry.total && !merged[key].total) merged[key].total = entry.total;
}

// Deduplicate items by name within each fund+type (keep first occurrence)
for (const key of Object.keys(merged)) {
  const seen = new Set();
  merged[key].items = merged[key].items.filter(item => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });
}

// Validation report
console.log('\n─── Validation ───────────────────────────────────────────────');
const warnings = [];
for (const entry of Object.values(merged)) {
  const sum = entry.items.reduce((s, i) => s + i.value, 0);
  const totalStr = entry.total ? `  (page total: ${entry.total.toLocaleString()})` : '';
  const delta = entry.total ? sum - entry.total : null;
  const flag = delta !== null && Math.abs(delta) > 1000 ? ' ⚠' : '';
  console.log(`  ${entry.fund} [${entry.type}]: ${sum.toLocaleString()}${totalStr}${flag}`);
  if (flag) {
    warnings.push(`${entry.fund} [${entry.type}]: sum ${sum.toLocaleString()} vs total ${entry.total.toLocaleString()} (delta ${delta.toLocaleString()})`);
  }
}
if (warnings.length) {
  console.log('\nWarnings (items may be missing or duplicated):');
  warnings.forEach(w => console.log('  ⚠ ' + w));
}

// ─── Step 5: Emit JS file ────────────────────────────────────────────────────

// Group by fund name
const byFund = {};
for (const entry of Object.values(merged)) {
  if (!byFund[entry.fund]) byFund[entry.fund] = { revenue: [], expenditure: [] };
  byFund[entry.fund][entry.type] = entry.items;
}

// Build fund-level totals for the top-level budget export
const budgetRevenue = Object.entries(byFund)
  .map(([fund, data]) => ({ name: fund, value: data.revenue.reduce((s, i) => s + i.value, 0) }))
  .filter(f => f.value > 0)
  .sort((a, b) => b.value - a.value);

const budgetExpenditure = Object.entries(byFund)
  .map(([fund, data]) => ({ name: fund, value: data.expenditure.reduce((s, i) => s + i.value, 0) }))
  .filter(f => f.value > 0)
  .sort((a, b) => b.value - a.value);

// Build the JS source
const lines = [];
lines.push(`// Auto-generated by scripts/extract-budget.js — ${new Date().toISOString().slice(0, 10)}`);
lines.push('');

for (const [fund, data] of Object.entries(byFund)) {
  const exportName = toCamelCase(fund);
  lines.push(`export const ${exportName} = {`);
  lines.push(`  revenue: ${toJsArray(data.revenue)},`);
  lines.push(`  expenditure: ${toJsArray(data.expenditure)},`);
  lines.push(`};`);
  lines.push('');
}

lines.push(`export const budget${year} = {`);
lines.push(`  revenue: ${toJsArray(budgetRevenue)},`);
lines.push(`  expenditure: ${toJsArray(budgetExpenditure)},`);
lines.push(`};`);
lines.push('');

const outPath = join(PROJECT_ROOT, 'src', 'data', `budget${year}.js`);

// Back up existing file
if (existsSync(outPath)) {
  const backup = outPath.replace('.js', `.backup-${Date.now()}.js`);
  execSync(`cp "${outPath}" "${backup}"`);
  console.log(`\nBacked up existing file to ${backup}`);
}

writeFileSync(outPath, lines.join('\n'));
console.log(`\nWrote ${outPath}`);
console.log('\nDone! Review the output, then wire new exports into App.jsx drillDown.');
