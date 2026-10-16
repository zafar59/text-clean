# Text Cleanup Studio

> **High-Performance, Privacy-First, Client-Side Text Sanitization and Formatting Utility**

Text Cleanup Studio transforms messy, malformed, or AI-polluted text into clean, structured, production-ready formats based on explicit user toggles and presets.

---

## 🛡️ Operational Principles

1. **100% Deterministic & Non-Destructive**: Zero rewriting or semantic alteration unless an explicit preset/rule is activated.
2. **Zero Data Leakage**: Runs 100% client-side in browser memory with zero tracking, telemetry, or server communication.
3. **5-Stage Order of Operations Pipeline**:
   - **Stage 1: Invisible Unicode & Special Character Sanitization**
     - Zero-width spaces (`\u200B-\u200D`, `\uFEFF`, `\u2060`)
     - Byte-order marks (BOM)
     - Non-printable ASCII control characters (`\x00-\x1F` preserving `\t`, `\n`, `\r`)
     - Soft hyphens (`\u00AD`)
   - **Stage 2: Whitespace & Line Structure Normalization**
     - Trim Edge Spaces (`^[ \t]+|[ \t]+$`)
     - Collapse Multiple Spaces (`[^\S\r\n]{2,}` ➔ `' '`)
     - Fix Double Spacing (`\n{3,}` ➔ `\n\n`)
     - Remove Empty Lines (`^\s*[\r\n]`)
     - Deduplicate identical lines while preserving initial order
     - Optional line sorting (Alphabetical, Reverse, Natural)
   - **Stage 3: Formatting & Syntax Stripping**
     - Strip AI Artifacts & boilerplate preambles ("Certainly!", "Sure thing,", "Hope this helps!")
     - Strip Markdown code fences (````(?:[a-zA-Z0-9]+)?\n([\s\S]*?)```` ➔ `$1`)
     - Strip Markdown syntax (`*bold*`, `# headers`, `> blockquotes`, `~~strikethrough~~`, bullets)
     - Strip Markdown links (`[text](url)` ➔ `text`)
     - Strip HTML tags & decode HTML entities (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, `&nbsp;`)
   - **Stage 4: Typographical & Casing Adjustments**
     - Smart quotes normalization (`[“”]` ➔ `"`, `[‘’]` ➔ `'`)
     - Dashes (`[—–]` ➔ `-`) and ellipses (`…` ➔ `...`)
     - Casing conversions (Sentence case, Title Case, UPPERCASE, lowercase, camelCase, kebab-case, snake_case)
     - List ⇄ Delimiter conversions (Lines to CSV, Lines to quoted CSV, CSV to itemized lines or bulleted lists)
   - **Stage 5: Output Generation & Metrics Reporting**
     - Word count, character count (with/without spaces), line count, payload size
     - Live % reduction badge and execution time
     - Real-time visual LCS line-by-line Diff comparison

---

## ⚡ 1-Click Presets Included

- 🤖 **AI Response Sanitizer**: Strips AI preambles, closing pleasantries, markdown code fences, and standardizes spacing.
- 💻 **Dev & Data Prep**: Purges invisible zero-width characters, normalizes curly quotes to straight ASCII, and trims trailing whitespace.
- 📄 **Document De-noise**: Strips markdown markup, decodes HTML entities, enforces single paragraph spacing, and sets clean sentence case.
- 📊 **List ⇄ Delimiter Tool**: Converts itemized lines to clean CSV lists or parses CSVs into lines.
- ␣ **Minimal Space Trimmer**: Trims edge spaces, collapses repeated horizontal spaces, and standardizes line breaks.
- 🧼 **Total Deep Clean**: Full-spectrum hygiene activating all standard sanitizer stages.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Production build
npm run build
```

Available on `http://localhost:5173`.
