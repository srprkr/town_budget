# Process: Adding a New Budget Year

When asked to add a new budget year, follow these steps in order. Supply the year and the borough website URL (format: `https://jenkintownboro.com/<year>-budget/`), or a direct PDF URL if you have it.

---

## Part 1 — Borough Budget

### 1. Get the PDF URL from the borough website

Go to `https://jenkintownboro.com/<year>-budget/` and:

- Copy the PDF link near the bottom of the page — it will be the input to the extraction script
- Note the **millage table** on the page (mills + dollar amounts per fund from real estate tax). These are *partial* revenue figures (property tax only), not full fund totals, but useful for quick sanity checking later.

### 2. Run the extraction script

```bash
node scripts/extract-budget.js <pdf-url> <year>
```

This downloads the PDF, renders pages to PNG via ImageMagick, sends them to Claude Vision in 8-page batches, extracts fund line items, validates sums, and writes `src/data/budget<year>.js`. It backs up any existing file automatically.

### 3. Check validation output

Read the console output for `⚠` warnings. If any fund's sum differs from its page total by more than $1,000, open `src/data/budget<year>.js` and fix those values manually against the PDF.

Cross-check: the millage table from Step 1 shows the real estate tax portion of each fund's revenue — verify these dollar amounts appear as line items within the corresponding fund breakdowns in the generated JS file.

### 4. Wire into `src/data/index.js`

Copy the import block from the most recent year and update all year suffixes. Then:

- Add `<year>: budget<year>` to the `budgets` object
- Add a `drillDown[<year>]` entry — `revenue` and `expenditure` sub-objects, each mapping fund name strings to the aliased `.revenue` / `.expenditure` arrays. Only include funds present in the new data file.

### 5. Update `src/data/trends.js`

- Append `<year>` to the `TREND_YEARS` array
- For each fund in `TREND_FUNDS`, append the new year's total to its array in `trends.revenue` and `trends.expenditure`. Read the totals from the `budget<year>` top-level export (one entry per fund). Use `null` for any fund with no data.

---

## Part 2 — School Budget

The school budget comes from a separate PDF (typically a JSD Board presentation).

### 1. Get the school budget PDF

Save it to `source/<year>/`, e.g. `JSD-BUDGET-PRESENTATION-26.27.pdf`.

### 2. Extract the summary numbers

Find the summary page with expenditure by category and revenue by source. Note the coding system:
- **Object codes** (100–900 series) — used in 2021–2025
- **PDE function codes** (1000/2000/3000/5000) — used in 2026+

These are not directly comparable across years.

### 3. Add to `src/data/schoolBudgets.js`

Add a new entry keyed by the year the fiscal year ends (FY 2026-27 → key `2027`), matching the shape of adjacent years.

### 4. Save a summary markdown

Create `source/<year>/school-budget-summary-<year>.md` with a table of the numbers and a note if the coding system differs from the prior year.

---

## Verification

```bash
npm run dev
```

- New year appears in the year selector
- Clicking each fund shows drilldown line items
- Trend chart shows the new year's bars

---

## Tip: structured PDF scanning (use if ⚠ warnings are frequent)

The extraction script batches all pages sequentially with no document awareness. For messy PDFs, a more accurate approach:

1. Quick low-res pass over all pages → identify table of contents, locate section cover pages
2. Extract the "Summary by Fund" appendix page → use fund totals as validation targets
3. For each fund section, re-send only those pages at higher resolution to get line items
4. Repeat until all funds are covered
