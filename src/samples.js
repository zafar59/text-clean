/**
 * Realistic Sample Texts for Text Cleanup Studio
 */

export const SAMPLES = {
  aiResponse: {
    id: 'aiResponse',
    title: 'Messy AI Output with Chatter & Fences',
    text: `Certainly! Here is the result you requested:

Here is the clean database connection config for PostgreSQL:

\`\`\`javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "secret_password",
  port: 5432,
  database: "analytics_db"
});

module.exports = pool;
\`\`\`


Notice the key highlights:
- Host is bound to localhost
- Pool manages connection re-use
- Standard port 5432 is configured


Hope this helps! Let me know if you need anything else or if you want me to write migration scripts!
Have a great day!
`
  },

  devBugs: {
    id: 'devBugs',
    title: 'Hidden Zero-Width Chars & Smart Quotes',
    // Contains \u200B (zero-width space), \uFEFF (BOM), \u200C (ZWNJ), curly smart quotes
    text: `\uFEFF// Copied from a blog post with invisible unicode bugs:
const API_ENDPOINT\u200B = “https://api.company.com/v1/auth”;\u200C

function authenticateUser(apiKey) {
    if (!apiKey) {
        throw new Error(‘API Key is required’);
    }
    
    // Notice trailing spaces on these lines:   
    const headers = {   
        “Authorization”: \`Bearer \${apiKey}\`,   
        “Content-Type”: “application/json”   
    };
    
    // Duplicate lines below:
    return fetch(API_ENDPOINT, { headers });
    return fetch(API_ENDPOINT, { headers });
}`
  },

  messyMarkdown: {
    id: 'messyMarkdown',
    title: 'Messy Markdown & HTML Entities',
    text: `# Product Requirements Specification &amp; Architecture

> **Note:** This document has been synthesized from legacy drafts &amp; web archives.

### Section 1: Overview
The platform **must** support *real-time* telemetry &lt;v2.0&gt; streaming. All client nodes ~~must not~~ shall communicate through mutual TLS.

<div class="callout warning">
  Please ensure all tokens are encrypted using &quot;AES-GCM-256&quot;.
</div>

Key Requirements:
* High throughput: &gt; 100,000 requests / sec.
* Zero data leakage: 100% ephemeral client processing.
* Maximum latency: &lt; 50 milliseconds.

Learn more at [Documentation Portal](https://developer.company.org/spec).`
  },

  csvList: {
    id: 'csvList',
    title: 'List for CSV / Delimiter Conversion',
    text: `Apple Inc.
Microsoft Corporation
Alphabet Inc.
Amazon.com Inc.
NVIDIA Corporation
Tesla Inc.
Meta Platforms Inc.
Apple Inc.

Alphabet Inc.
Broadcom Inc.
Berkshire Hathaway`
  },

  massiveStressTest: {
    id: 'massiveStressTest',
    title: 'Large Payload (> 100,000 Chars Stress Test)',
    generator: () => {
      const baseParagraph = `Text Cleanup Studio is a deterministic, privacy-first, client-side utility engineered for developer efficiency. ` +
        `It strips invisible zero-width bugs, collapses multiple spaces, normalizes smart quotes into straight ASCII quotes, ` +
        `and removes annoying AI preamble phrases like "Certainly!" or "Hope this helps!". ` +
        `With instant live diff and zero telemetry, your text never leaves your local browser memory.\n\n`;
      return baseParagraph.repeat(350); // ~105,000 chars
    }
  }
};
