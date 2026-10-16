/**
 * Text Cleanup Studio — Rule Engine & Deterministic Transformation Pipeline
 * 
 * Order of Operations Pipeline:
 * Stage 1: Invisible Unicode & Special Character Sanitization
 * Stage 2: Whitespace & Line Structure Normalization
 * Stage 3: Formatting & Syntax Stripping
 * Stage 4: Typographical & Casing Adjustments
 * Stage 5: Output Generation & Metrics Reporting
 */

export const DEFAULT_CONFIG = {
  // Stage 1: Invisible Unicode & Special Characters
  stripZeroWidth: true,
  stripByteOrderMark: true,
  stripControlChars: true,
  stripSoftHyphens: true,

  // Stage 2: Whitespace & Line Structure
  trimEdgeSpaces: true,
  collapseSpaces: true,
  removeEmptyLines: false,
  fixDoubleSpacing: true,
  removeDuplicateLines: false,
  sortLines: 'none', // 'none' | 'asc' | 'desc' | 'natural'

  // Stage 3: Formatting & Syntax Stripping
  stripMarkdownFences: true,
  stripMarkdownSyntax: false,
  stripMarkdownLinks: false,
  stripAIArtifacts: true,
  stripHtmlTags: false,
  decodeHtmlEntities: true,

  // Stage 4: Typographical & Casing
  normalizeQuotes: true,
  normalizeDashes: false,
  normalizeEllipses: false,
  casingMode: 'none', // 'none' | 'sentence' | 'title' | 'upper' | 'lower' | 'camel' | 'kebab' | 'snake'
  delimiterConversion: 'none', // 'none' | 'to-csv' | 'to-csv-quoted' | 'to-list' | 'to-bullets'
  customDelimiter: ',',

  // Extra Utilities
  findReplaceEnabled: false,
  findText: '',
  replaceText: '',
  findRegex: false,
  findMatchCase: false,
};

export const PRESETS = {
  aiSanitizer: {
    id: 'aiSanitizer',
    name: 'AI Response Sanitizer',
    description: 'Strips AI pleasantries, preamble/closing chatters, markdown code blocks & cleans whitespace.',
    config: {
      stripZeroWidth: true,
      stripByteOrderMark: true,
      stripControlChars: true,
      stripSoftHyphens: true,
      trimEdgeSpaces: true,
      collapseSpaces: true,
      removeEmptyLines: false,
      fixDoubleSpacing: true,
      removeDuplicateLines: false,
      sortLines: 'none',
      stripMarkdownFences: true,
      stripMarkdownSyntax: false,
      stripMarkdownLinks: false,
      stripAIArtifacts: true,
      stripHtmlTags: false,
      decodeHtmlEntities: true,
      normalizeQuotes: true,
      normalizeDashes: false,
      normalizeEllipses: false,
      casingMode: 'none',
      delimiterConversion: 'none',
    }
  },
  devDataPrep: {
    id: 'devDataPrep',
    name: 'Developer & Data Sanitizer',
    description: 'Removes invisible zero-width bugs, normalizes smart quotes, strips control chars and collapses spaces.',
    config: {
      stripZeroWidth: true,
      stripByteOrderMark: true,
      stripControlChars: true,
      stripSoftHyphens: true,
      trimEdgeSpaces: true,
      collapseSpaces: true,
      removeEmptyLines: false,
      fixDoubleSpacing: false,
      removeDuplicateLines: false,
      sortLines: 'none',
      stripMarkdownFences: false,
      stripMarkdownSyntax: false,
      stripMarkdownLinks: false,
      stripAIArtifacts: false,
      stripHtmlTags: false,
      decodeHtmlEntities: false,
      normalizeQuotes: true,
      normalizeDashes: false,
      normalizeEllipses: false,
      casingMode: 'none',
      delimiterConversion: 'none',
    }
  },
  documentDenoise: {
    id: 'documentDenoise',
    name: 'Document & Markdown Stripper',
    description: 'Strips markdown markup, decodes HTML entities, fixes double-spacing and sets clean sentence case.',
    config: {
      stripZeroWidth: true,
      stripByteOrderMark: true,
      stripControlChars: true,
      stripSoftHyphens: true,
      trimEdgeSpaces: true,
      collapseSpaces: true,
      removeEmptyLines: true,
      fixDoubleSpacing: true,
      removeDuplicateLines: false,
      sortLines: 'none',
      stripMarkdownFences: true,
      stripMarkdownSyntax: true,
      stripMarkdownLinks: true,
      stripAIArtifacts: false,
      stripHtmlTags: true,
      decodeHtmlEntities: true,
      normalizeQuotes: true,
      normalizeDashes: true,
      normalizeEllipses: true,
      casingMode: 'sentence',
      delimiterConversion: 'none',
    }
  },
  csvConverter: {
    id: 'csvConverter',
    name: 'List ⇄ Delimiter Prep',
    description: 'Converts itemized lines into a clean comma-separated list or vice versa.',
    config: {
      stripZeroWidth: true,
      stripByteOrderMark: true,
      stripControlChars: true,
      stripSoftHyphens: true,
      trimEdgeSpaces: true,
      collapseSpaces: true,
      removeEmptyLines: true,
      fixDoubleSpacing: false,
      removeDuplicateLines: true,
      sortLines: 'natural',
      stripMarkdownFences: false,
      stripMarkdownSyntax: false,
      stripMarkdownLinks: false,
      stripAIArtifacts: false,
      stripHtmlTags: false,
      decodeHtmlEntities: false,
      normalizeQuotes: true,
      normalizeDashes: false,
      normalizeEllipses: false,
      casingMode: 'none',
      delimiterConversion: 'to-csv',
    }
  },
  minimalCleaner: {
    id: 'minimalCleaner',
    name: 'Minimal Space Trimmer',
    description: 'Only trims edge whitespace, collapses repeated spaces and standardizes line breaks.',
    config: {
      stripZeroWidth: true,
      stripByteOrderMark: true,
      stripControlChars: false,
      stripSoftHyphens: false,
      trimEdgeSpaces: true,
      collapseSpaces: true,
      removeEmptyLines: false,
      fixDoubleSpacing: true,
      removeDuplicateLines: false,
      sortLines: 'none',
      stripMarkdownFences: false,
      stripMarkdownSyntax: false,
      stripMarkdownLinks: false,
      stripAIArtifacts: false,
      stripHtmlTags: false,
      decodeHtmlEntities: false,
      normalizeQuotes: false,
      normalizeDashes: false,
      normalizeEllipses: false,
      casingMode: 'none',
      delimiterConversion: 'none',
    }
  },
  deepClean: {
    id: 'deepClean',
    name: 'Total Deep Clean',
    description: 'Applies all hygiene rules: removes invisible chars, AI cruft, markdown syntax, duplicate lines.',
    config: {
      stripZeroWidth: true,
      stripByteOrderMark: true,
      stripControlChars: true,
      stripSoftHyphens: true,
      trimEdgeSpaces: true,
      collapseSpaces: true,
      removeEmptyLines: true,
      fixDoubleSpacing: true,
      removeDuplicateLines: true,
      sortLines: 'none',
      stripMarkdownFences: true,
      stripMarkdownSyntax: true,
      stripMarkdownLinks: true,
      stripAIArtifacts: true,
      stripHtmlTags: true,
      decodeHtmlEntities: true,
      normalizeQuotes: true,
      normalizeDashes: true,
      normalizeEllipses: true,
      casingMode: 'none',
      delimiterConversion: 'none',
    }
  }
};

/**
 * Counts invisible/zero-width characters in input
 */
export function countInvisibleChars(text) {
  if (!text) return 0;
  const match = text.match(/[\u200B-\u200D\uFEFF\u00AD\u200E\u200F\u202A-\u202E\u2060\uFFFC]/g);
  return match ? match.length : 0;
}

/**
 * Execute the 5-stage deterministic transformation pipeline
 */
export function runCleanupPipeline(rawInput, config = DEFAULT_CONFIG) {
  const startTime = performance.now();
  if (typeof rawInput !== 'string') {
    rawInput = '';
  }

  // Pre-metric: invisible characters count
  const detectedInvisibleCount = countInvisibleChars(rawInput);

  let text = rawInput;

  // Custom Find & Replace (if enabled and run before or after)
  if (config.findReplaceEnabled && config.findText) {
    text = applyFindReplace(text, config);
  }

  // ==========================================
  // STAGE 1: Invisible Unicode & Special Chars
  // ==========================================
  if (config.stripByteOrderMark) {
    // Strip BOM (\uFEFF) at start or anywhere
    text = text.replace(/^\uFEFF/, '').replace(/\uFEFF/g, '');
  }

  if (config.stripZeroWidth) {
    // Zero-width space (\u200B), zero-width non-joiner (\u200C),
    // zero-width joiner (\u200D), zero-width no-break space (\uFEFF),
    // word joiner (\u2060), left-to-right/right-to-left marks (\u200E, \u200F)
    text = text.replace(/[\u200B-\u200D\u200E\u200F\u202A-\u202E\u2060\uFFFC]/g, '');
  }

  if (config.stripSoftHyphens) {
    text = text.replace(/\u00AD/g, '');
  }

  if (config.stripControlChars) {
    // Keep standard whitespace: \t (0x09), \n (0x0A), \r (0x0D)
    text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  }

  // ==========================================
  // STAGE 2: Whitespace & Line Structure Normalization
  // ==========================================
  // Standardize CRLF to LF for consistent processing
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  if (config.collapseSpaces) {
    // Replace 2+ consecutive horizontal spaces with a single space
    // Spec: [^\S\r\n]{2,} -> ' '
    text = text.replace(/[^\S\r\n]{2,}/g, ' ');
  }

  if (config.trimEdgeSpaces) {
    // Strip leading and trailing whitespace per line
    // Spec: ^[ \t]+|[ \t]+$
    text = text.replace(/^[ \t]+|[ \t]+$/gm, '');
  }

  if (config.removeEmptyLines) {
    // Strip empty or whitespace-only lines
    // Spec: ^\s*[\r\n] -> ''
    text = text.replace(/^\s*\n/gm, '');
    // Also remove any trailing empty lines at the very end
    text = text.replace(/^\s+$/gm, '');
  }

  if (config.fixDoubleSpacing) {
    // Ensure single paragraph break: \n{3,} -> \n\n
    text = text.replace(/\n{3,}/g, '\n\n');
  }

  if (config.removeDuplicateLines) {
    // Deduplicate identical lines while preserving initial order
    const lines = text.split('\n');
    const seen = new Set();
    const uniqueLines = [];
    for (const line of lines) {
      if (!seen.has(line)) {
        seen.add(line);
        uniqueLines.push(line);
      }
    }
    text = uniqueLines.join('\n');
  }

  if (config.sortLines && config.sortLines !== 'none') {
    const lines = text.split('\n');
    if (config.sortLines === 'asc') {
      lines.sort((a, b) => a.localeCompare(b));
    } else if (config.sortLines === 'desc') {
      lines.sort((a, b) => b.localeCompare(a));
    } else if (config.sortLines === 'natural') {
      lines.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    }
    text = lines.join('\n');
  }

  // ==========================================
  // STAGE 3: Formatting & Syntax Stripping
  // ==========================================
  if (config.stripAIArtifacts) {
    text = stripAIArtifacts(text);
  }

  if (config.stripMarkdownFences) {
    // Remove triple-backtick blocks while retaining inner code
    // Regex: ```(?:[a-zA-Z0-9]+)?\n([\s\S]*?)``` -> $1
    text = text.replace(/```(?:[a-zA-Z0-9_-]+)?\s*\n?([\s\S]*?)```/g, '$1');
  }

  if (config.stripMarkdownLinks) {
    // Convert [link text](http://...) to link text
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    // Strip image markdown: ![alt](url)
    text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');
  }

  if (config.stripMarkdownSyntax) {
    // Bold / Italic asterisks and underscores:
    // ***text***, **text**, *text*
    text = text.replace(/\*{1,3}(.*?)\*{1,3}/g, '$1');
    text = text.replace(/_{1,3}(.*?)_{1,3}/g, '$1');
    // Strikethrough ~~text~~
    text = text.replace(/~~(.*?)~~/g, '$1');
    // Inline code `code`
    text = text.replace(/`([^`]+)`/g, '$1');
    // Headers: ^#{1,6}\s*
    text = text.replace(/^#{1,6}\s+/gm, '');
    // Blockquotes: ^>\s*
    text = text.replace(/^>[ \t]*/gm, '');
    // Bullet lists: ^[-*+]\s+
    text = text.replace(/^[ \t]*[-*+][ \t]+/gm, '');
    // Numbered lists: ^\d+\.\s+
    text = text.replace(/^[ \t]*\d+\.[ \t]+/gm, '');
  }

  if (config.stripHtmlTags) {
    // Strip HTML tags like <div>, <p>, </span>
    text = text.replace(/<[^>]+>/g, '');
  }

  if (config.decodeHtmlEntities) {
    text = decodeHtmlEntities(text);
  }

  // Post Stage 3 whitespace cleanup (in case stripping removed bullets/fences and left empty lines)
  if (config.trimEdgeSpaces) {
    text = text.replace(/^[ \t]+|[ \t]+$/gm, '');
  }
  if (config.fixDoubleSpacing) {
    text = text.replace(/\n{3,}/g, '\n\n');
  }

  // ==========================================
  // STAGE 4: Typographical & Casing Adjustments
  // ==========================================
  if (config.normalizeQuotes) {
    // Convert [“”«»„‟] to " and [‘’‹›‚‛] to '
    text = text.replace(/[\u201C\u201D\u00AB\u00BB\u201E\u201F]/g, '"');
    text = text.replace(/[\u2018\u2019\u2039\u203A\u201A\u201B]/g, "'");
  }

  if (config.normalizeDashes) {
    // Convert em-dash (—) and en-dash (–) to regular hyphen (-)
    text = text.replace(/[\u2013\u2014\u2015]/g, '-');
  }

  if (config.normalizeEllipses) {
    // Convert … to ...
    text = text.replace(/\u2026/g, '...');
  }

  if (config.delimiterConversion && config.delimiterConversion !== 'none') {
    text = applyDelimiterConversion(text, config.delimiterConversion, config.customDelimiter);
  }

  if (config.casingMode && config.casingMode !== 'none') {
    text = applyCasing(text, config.casingMode);
  }

  // Final trim if trimEdgeSpaces is active
  if (config.trimEdgeSpaces) {
    text = text.replace(/^\s+|\s+$/g, (m) => (config.removeEmptyLines ? '' : m.replace(/^[^\S\r\n]+|[^\S\r\n]+$/g, '')));
  }

  // ==========================================
  // STAGE 5: Output Generation & Metrics
  // ==========================================
  const durationMs = performance.now() - startTime;
  const metrics = calculateMetrics(rawInput, text, durationMs, detectedInvisibleCount);

  return {
    output: text,
    metrics,
  };
}

/**
 * Strip AI boilerplate chatter, opening preambles, and closing pleasantries
 */
export function stripAIArtifacts(input) {
  let text = input;

  // Opening patterns:
  // e.g. "Certainly! Here is...", "Sure thing,", "Here's what you requested:",
  // "As an AI language model, ...", "Glad to help! Here is..."
  const preamblePatterns = [
    /^(?:Certainly|Sure|Sure thing|Of course|Glad to help|No problem)[!,.]?\s*(?:Here(?:'s| is| are)(?: the)?(?: requested)?(?: result| code| text| solution| breakdown| updated| information)?[:.]?\s*)?/i,
    /^Here(?:'s| is| are)\s+(?:the|what|your)?\s*(?:result|code|text|solution|answer|requested|information|cleanup)?[:.]\s*/i,
    /^Below is (?:the|what|your)\s*(?:result|code|text|solution|answer)?[:.]\s*/i,
    /^As an AI(?: language model)?,?\s*/i,
    /^I hope this helps! Here is:?\s*/i,
  ];

  // Apply to the beginning of text or first non-empty lines
  for (const pattern of preamblePatterns) {
    text = text.replace(pattern, '');
  }

  // Closing patterns:
  // e.g. "Hope this helps!", "Let me know if you need anything else!", "Feel free to ask..."
  const closingPatterns = [
    /\n*(?:Hope this helps|I hope this helps|Let me know if you have any questions|Let me know if you need anything else|Feel free to reach out|Feel free to ask if you have more questions|Happy coding|Have a great day)[!.]*[\s\S]*$/i,
  ];

  for (const pattern of closingPatterns) {
    text = text.replace(pattern, '');
  }

  return text.trim();
}

/**
 * Decode standard and numeric HTML entities
 */
export function decodeHtmlEntities(str) {
  if (!str) return '';
  const entityMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&cent;': '¢',
    '&pound;': '£',
    '&euro;': '€',
    '&yen;': '¥',
  };

  let decoded = str.replace(/&(?:amp|lt|gt|quot|#39|apos|nbsp|copy|reg|trade|cent|pound|euro|yen);/g, (match) => entityMap[match] || match);

  // Decode decimal entities: &#123;
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    try {
      return String.fromCharCode(parseInt(dec, 10));
    } catch {
      return match;
    }
  });

  // Decode hex entities: &#x1f600;
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    try {
      return String.fromCodePoint(parseInt(hex, 16));
    } catch {
      return match;
    }
  });

  return decoded;
}

/**
 * Delimiter and List transformations
 */
export function applyDelimiterConversion(text, mode, customDelim = ',') {
  if (!text) return '';

  if (mode === 'to-csv' || mode === 'to-csv-quoted') {
    // Split by newlines, trim items, and join with commas
    const lines = text.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);
    
    if (mode === 'to-csv-quoted') {
      return lines.map(item => `"${item.replace(/"/g, '""')}"`).join(', ');
    }
    return lines.join(', ');
  }

  if (mode === 'to-list') {
    // Split by commas, trim, format as itemized lines
    const delimiter = customDelim || ',';
    const items = text.split(delimiter)
      .map(i => i.trim())
      .filter(i => i.length > 0);
    return items.join('\n');
  }

  if (mode === 'to-bullets') {
    const delimiter = customDelim || ',';
    const items = text.split(delimiter)
      .map(i => i.trim())
      .filter(i => i.length > 0);
    return items.map(item => `- ${item}`).join('\n');
  }

  return text;
}

/**
 * Casing & Typography Transformations
 */
export function applyCasing(text, mode) {
  if (!text || mode === 'none') return text;

  switch (mode) {
    case 'upper':
      return text.toUpperCase();

    case 'lower':
      return text.toLowerCase();

    case 'sentence':
      // Capitalize first letter of each sentence, preserve paragraph structure
      // A sentence starts after ., !, ?, or at start of string/paragraph
      return text.toLowerCase().replace(/(^\s*|[.!?]\s+|\n+\s*)([a-z\u00C0-\u00FF])/g, (m, prefix, char) => {
        return prefix + char.toUpperCase();
      });

    case 'title': {
      // Capitalize words except minor articles/conjunctions/prepositions
      const minorWords = new Set([
        'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 
        'to', 'from', 'by', 'with', 'in', 'of', 'off', 'out', 'up', 'as'
      ]);

      return text.split('\n').map(line => {
        const words = line.split(/(\s+)/);
        let wordIndex = 0;
        return words.map(w => {
          if (!w.trim()) return w;
          const lower = w.toLowerCase();
          const cleanWord = lower.replace(/[^a-zA-Z0-9]/g, '');
          const isFirstOrLast = wordIndex === 0;
          wordIndex++;

          if (!isFirstOrLast && minorWords.has(cleanWord)) {
            return lower;
          }
          // Capitalize first alphanumeric
          return lower.replace(/^([^a-zA-Z0-9]*)([a-z])(.*)$/, (m, p1, p2, p3) => {
            return p1 + p2.toUpperCase() + p3;
          });
        }).join('');
      }).join('\n');
    }

    case 'camel':
      return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
      }).replace(/[\s\-_]+/g, '');

    case 'kebab':
      return text
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');

    case 'snake':
      return text
        .trim()
        .toLowerCase()
        .replace(/[\s\-]+/g, '_')
        .replace(/[^a-z0-9\_]/g, '');

    default:
      return text;
  }
}

/**
 * Find & Replace utility
 */
export function applyFindReplace(text, { findText, replaceText, findRegex, findMatchCase }) {
  if (!findText) return text;
  try {
    let regex;
    if (findRegex) {
      const flags = findMatchCase ? 'g' : 'gi';
      regex = new RegExp(findText, flags);
    } else {
      const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const flags = findMatchCase ? 'g' : 'gi';
      regex = new RegExp(escaped, flags);
    }
    return text.replace(regex, replaceText || '');
  } catch {
    return text;
  }
}

const textEncoder = new TextEncoder();

/**
 * Accurate metrics calculation: Word Count, Character Count (with/without spaces), Line Count, Size Delta
 */
export function calculateMetrics(inputStr, outputStr, durationMs = 0, invisibleCount = 0) {
  const getStats = (str) => {
    if (!str) {
      return { words: 0, chars: 0, charsNoSpaces: 0, lines: 0, bytes: 0 };
    }
    const wordsMatch = str.trim().match(/\S+/g);
    const words = wordsMatch ? wordsMatch.length : 0;
    const chars = str.length;
    const charsNoSpaces = str.replace(/\s/g, '').length;
    const lines = str ? str.split('\n').length : 0;
    const bytes = textEncoder.encode(str).length;
    return { words, chars, charsNoSpaces, lines, bytes };
  };

  const inStats = getStats(inputStr);
  const outStats = getStats(outputStr);

  const charDelta = outStats.chars - inStats.chars;
  const wordDelta = outStats.words - inStats.words;
  const lineDelta = outStats.lines - inStats.lines;
  const byteDelta = outStats.bytes - inStats.bytes;

  let percentReduced = 0;
  if (inStats.chars > 0) {
    percentReduced = Math.max(0, ((inStats.chars - outStats.chars) / inStats.chars) * 100);
  }

  return {
    input: inStats,
    output: outStats,
    delta: {
      chars: charDelta,
      words: wordDelta,
      lines: lineDelta,
      bytes: byteDelta,
      percentReduced: parseFloat(percentReduced.toFixed(2)),
    },
    invisibleCount,
    durationMs: parseFloat(durationMs.toFixed(2)),
  };
}
