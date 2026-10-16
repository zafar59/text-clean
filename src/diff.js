/**
 * Fast Line & Character Diff Computation for Text Cleanup Studio
 * Generates structured diff tokens (added, removed, unchanged) for rendering in unified or side-by-side view.
 */

export function computeLineDiff(original, cleaned) {
  if (!original && !cleaned) return [];
  if (!original) {
    return cleaned.split('\n').map(line => ({ type: 'added', text: line }));
  }
  if (!cleaned) {
    return original.split('\n').map(line => ({ type: 'removed', text: line }));
  }

  const origLines = original.split('\n');
  const cleanLines = cleaned.split('\n');

  // Simple and fast Longest Common Subsequence (LCS) for line-level diff
  const n = origLines.length;
  const m = cleanLines.length;

  // For very large inputs (> 2500 lines), use a fast chunked or windowed diff to avoid O(N*M) memory
  if (n * m > 2500000) {
    return computeFastHeuristicDiff(origLines, cleanLines);
  }

  // Dynamic programming LCS table
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (origLines[i] === cleanLines[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // Backtrack to build the diff
  let i = n;
  let j = m;
  const rawDiff = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origLines[i - 1] === cleanLines[j - 1]) {
      rawDiff.push({ type: 'unchanged', text: origLines[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawDiff.push({ type: 'added', text: cleanLines[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      rawDiff.push({ type: 'removed', text: origLines[i - 1] });
      i--;
    }
  }

  return rawDiff.reverse();
}

/**
 * Fast heuristic diff for huge files
 */
function computeFastHeuristicDiff(origLines, cleanLines) {
  const result = [];
  const max = Math.max(origLines.length, cleanLines.length);

  for (let idx = 0; idx < max; idx++) {
    const o = origLines[idx];
    const c = cleanLines[idx];

    if (o !== undefined && c !== undefined) {
      if (o === c) {
        result.push({ type: 'unchanged', text: o });
      } else {
        result.push({ type: 'removed', text: o });
        result.push({ type: 'added', text: c });
      }
    } else if (o !== undefined) {
      result.push({ type: 'removed', text: o });
    } else if (c !== undefined) {
      result.push({ type: 'added', text: c });
    }
  }
  return result;
}

/**
 * Render diff into HTML nodes with line numbers and change highlights
 */
export function renderDiffHtml(diffItems) {
  if (!diffItems || diffItems.length === 0) {
    return '<div class="diff-empty-state">No diff to display.</div>';
  }

  let origLineNum = 1;
  let cleanLineNum = 1;

  const htmlRows = diffItems.map(item => {
    let lineIndicator = ' ';
    let leftNum = '';
    let rightNum = '';
    let rowClass = 'diff-row';

    if (item.type === 'unchanged') {
      leftNum = origLineNum++;
      rightNum = cleanLineNum++;
      rowClass += ' diff-row-unchanged';
      lineIndicator = ' ';
    } else if (item.type === 'removed') {
      leftNum = origLineNum++;
      rightNum = '';
      rowClass += ' diff-row-removed';
      lineIndicator = '−';
    } else if (item.type === 'added') {
      leftNum = '';
      rightNum = cleanLineNum++;
      rowClass += ' diff-row-added';
      lineIndicator = '+';
    }

    const safeText = escapeHtml(item.text) || '&nbsp;';

    return `
      <div class="${rowClass}">
        <div class="diff-num diff-num-left">${leftNum}</div>
        <div class="diff-num diff-num-right">${rightNum}</div>
        <div class="diff-sign">${lineIndicator}</div>
        <div class="diff-content">${safeText}</div>
      </div>
    `;
  });

  return `<div class="diff-viewer-table">${htmlRows.join('')}</div>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
