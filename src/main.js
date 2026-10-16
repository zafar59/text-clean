import { DEFAULT_CONFIG, PRESETS, runCleanupPipeline, countInvisibleChars } from './pipeline.js';
import { computeLineDiff, renderDiffHtml } from './diff.js';
import { SAMPLES } from './samples.js';

// Application State
const state = {
  rawInput: '',
  cleanedOutput: '',
  config: { ...DEFAULT_CONFIG },
  activePresetId: 'aiSanitizer',
  currentView: 'split', // 'split' | 'diff' | 'outputOnly'
  theme: localStorage.getItem('tcs_theme') || 'dark',
  undoStack: [],
  redoStack: [],
  isProcessing: false,
  worker: null,
  workerMsgId: 0,
};

// DOM Elements Cache
const DOM = {
  html: document.documentElement,
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeIcon: document.getElementById('themeIcon'),
  sampleSelect: document.getElementById('sampleSelect'),
  resetAllBtn: document.getElementById('resetAllBtn'),
  presetPills: document.querySelectorAll('.preset-pill'),
  rulesHeader: document.getElementById('rulesHeader'),
  rulesBody: document.getElementById('rulesBody'),
  rulesChevron: document.getElementById('rulesChevron'),
  togglePanelLabel: document.getElementById('togglePanelLabel'),
  activeRulesCount: document.getElementById('activeRulesCount'),
  rawInputText: document.getElementById('rawInputText'),
  cleanedOutputText: document.getElementById('cleanedOutputText'),
  inputEmptyOverlay: document.getElementById('inputEmptyOverlay'),
  outputEmptyOverlay: document.getElementById('outputEmptyOverlay'),
  inputCharCountBadge: document.getElementById('inputCharCountBadge'),
  outputCharCountBadge: document.getElementById('outputCharCountBadge'),
  uploadFileBtn: document.getElementById('uploadFileBtn'),
  fileUploadInput: document.getElementById('fileUploadInput'),
  pasteClipboardBtn: document.getElementById('pasteClipboardBtn'),
  clearInputBtn: document.getElementById('clearInputBtn'),
  copyOutputBtn: document.getElementById('copyOutputBtn'),
  downloadOutputBtn: document.getElementById('downloadOutputBtn'),
  undoBtn: document.getElementById('undoBtn'),
  redoBtn: document.getElementById('redoBtn'),
  viewSplitBtn: document.getElementById('viewSplitBtn'),
  viewDiffBtn: document.getElementById('viewDiffBtn'),
  viewOutputOnlyBtn: document.getElementById('viewOutputOnlyBtn'),
  editorsGrid: document.getElementById('editorsGrid'),
  diffPanelWrapper: document.getElementById('diffPanelWrapper'),
  diffContentArea: document.getElementById('diffContentArea'),
  massivePayloadBanner: document.getElementById('massivePayloadBanner'),
  massiveBannerText: document.getElementById('massiveBannerText'),
  workerStatusBadge: document.getElementById('workerStatusBadge'),
  metricWordsOut: document.getElementById('metricWordsOut'),
  metricWordsDelta: document.getElementById('metricWordsDelta'),
  metricCharsOut: document.getElementById('metricCharsOut'),
  metricCharsNoSpace: document.getElementById('metricCharsNoSpace'),
  metricLinesOut: document.getElementById('metricLinesOut'),
  metricLinesDelta: document.getElementById('metricLinesDelta'),
  metricSize: document.getElementById('metricSize'),
  metricSpeed: document.getElementById('metricSpeed'),
  reductionBadge: document.getElementById('reductionBadge'),
  reductionPercentText: document.getElementById('reductionPercentText'),
  invisibleCharWarning: document.getElementById('invisibleCharWarning'),
  invisibleCharText: document.getElementById('invisibleCharText'),
  toastContainer: document.getElementById('toastContainer'),
  // Inputs in Rules
  findText: document.getElementById('findText'),
  replaceText: document.getElementById('replaceText'),
  findRegex: document.getElementById('findRegex'),
  findMatchCase: document.getElementById('findMatchCase'),
  cfg_casingMode: document.getElementById('cfg_casingMode'),
  cfg_delimiterConversion: document.getElementById('cfg_delimiterConversion'),
  cfg_sortLines: document.getElementById('cfg_sortLines'),
};

// Initialize Web Worker for large payloads
function initWorker() {
  try {
    state.worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    state.worker.onmessage = (e) => {
      const { id, success, result, error } = e.data;
      if (id === state.workerMsgId) {
        state.isProcessing = false;
        DOM.workerStatusBadge.textContent = 'Processed';
        DOM.workerStatusBadge.style.color = 'var(--accent-emerald)';
        if (success && result) {
          applyPipelineResult(result);
        } else {
          showToast(`Worker error: ${error || 'Unknown'}`, 'info');
        }
      }
    };
  } catch (err) {
    console.warn('Web Worker not supported or failed to load. Falling back to main thread.', err);
    state.worker = null;
  }
}

// Initialize Application
function init() {
  // Set theme
  setTheme(state.theme);

  // Initialize Worker
  initWorker();

  // Bind Rule Toggles from DOM
  bindRuleToggles();

  // Attach Event Listeners
  attachEvents();

  // Apply default preset (AI Sanitizer) without firing toast on load
  applyPreset('aiSanitizer', true);

  // Load initial AI sample without firing toast on load
  loadSample('aiResponse', true);
}

// Setup Theme
function setTheme(theme) {
  state.theme = theme;
  DOM.html.setAttribute('data-theme', theme);
  localStorage.setItem('tcs_theme', theme);

  if (theme === 'light') {
    DOM.themeIcon.innerHTML = `
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    `;
    DOM.themeToggleBtn.title = 'Switch to Dark Mode';
  } else {
    DOM.themeIcon.innerHTML = `
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2"/><path d="M12 20v2"/>
      <path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/>
      <path d="M2 12h2"/><path d="M20 12h2"/>
      <path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
    `;
    DOM.themeToggleBtn.title = 'Switch to Light Mode';
  }
}

// Bind checkbox toggles to config keys
function bindRuleToggles() {
  const toggleKeys = [
    'stripZeroWidth', 'stripByteOrderMark', 'stripControlChars',
    'trimEdgeSpaces', 'collapseSpaces', 'removeEmptyLines', 'fixDoubleSpacing', 'removeDuplicateLines',
    'stripAIArtifacts', 'stripMarkdownFences', 'stripMarkdownSyntax', 'stripMarkdownLinks',
    'stripHtmlTags', 'decodeHtmlEntities', 'normalizeQuotes', 'normalizeDashes'
  ];

  toggleKeys.forEach(key => {
    const el = document.getElementById(`cfg_${key}`);
    if (el) {
      el.addEventListener('change', () => {
        state.config[key] = el.checked;
        state.activePresetId = null; // custom configuration
        updatePresetPillsUI();
        updateActiveRulesCount();
        triggerPipeline();
      });
    }
  });

  // Select inputs
  DOM.cfg_sortLines.addEventListener('change', () => {
    state.config.sortLines = DOM.cfg_sortLines.value;
    triggerPipeline();
  });

  DOM.cfg_casingMode.addEventListener('change', () => {
    state.config.casingMode = DOM.cfg_casingMode.value;
    triggerPipeline();
  });

  DOM.cfg_delimiterConversion.addEventListener('change', () => {
    state.config.delimiterConversion = DOM.cfg_delimiterConversion.value;
    triggerPipeline();
  });

  // Find & Replace
  const onFindReplaceChange = () => {
    state.config.findText = DOM.findText.value;
    state.config.replaceText = DOM.replaceText.value;
    state.config.findRegex = DOM.findRegex.checked;
    state.config.findMatchCase = DOM.findMatchCase.checked;
    state.config.findReplaceEnabled = !!state.config.findText;
    triggerPipeline();
  };

  DOM.findText.addEventListener('input', debounce(onFindReplaceChange, 200));
  DOM.replaceText.addEventListener('input', debounce(onFindReplaceChange, 200));
  DOM.findRegex.addEventListener('change', onFindReplaceChange);
  DOM.findMatchCase.addEventListener('change', onFindReplaceChange);
}

// Sync UI controls with current config state
function syncConfigToUI() {
  for (const [key, val] of Object.entries(state.config)) {
    const el = document.getElementById(`cfg_${key}`);
    if (el && el.type === 'checkbox') {
      el.checked = !!val;
    }
  }
  DOM.cfg_sortLines.value = state.config.sortLines || 'none';
  DOM.cfg_casingMode.value = state.config.casingMode || 'none';
  DOM.cfg_delimiterConversion.value = state.config.delimiterConversion || 'none';
  updateActiveRulesCount();
}

function updateActiveRulesCount() {
  let count = 0;
  for (const [k, v] of Object.entries(state.config)) {
    if (typeof v === 'boolean' && v === true) count++;
    else if (typeof v === 'string' && v !== 'none' && v !== '') count++;
  }
  DOM.activeRulesCount.textContent = `${count} active rules`;
}

// Preset Handlers
function applyPreset(presetId, silent = false) {
  const preset = PRESETS[presetId];
  if (!preset) return;

  state.activePresetId = presetId;
  state.config = { ...DEFAULT_CONFIG, ...preset.config };
  syncConfigToUI();
  updatePresetPillsUI();
  triggerPipeline();
  if (!silent) {
    showToast(`Applied preset: ${preset.name}`, 'info');
  }
}

function updatePresetPillsUI() {
  DOM.presetPills.forEach(pill => {
    const id = pill.getAttribute('data-preset');
    if (id === state.activePresetId) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });
}

// Debounce helper
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Trigger Pipeline execution
async function triggerPipeline() {
  const text = DOM.rawInputText.value;
  state.rawInput = text;

  // Handle empty state
  if (!text) {
    state.cleanedOutput = '';
    DOM.cleanedOutputText.value = '';
    DOM.inputEmptyOverlay.style.display = 'flex';
    DOM.outputEmptyOverlay.style.display = 'flex';
    DOM.inputCharCountBadge.textContent = '(0 chars)';
    DOM.outputCharCountBadge.textContent = '(0 chars)';
    DOM.massivePayloadBanner.classList.remove('visible');
    DOM.invisibleCharWarning.style.display = 'none';
    renderMetrics(runCleanupPipeline('', state.config).metrics);
    if (state.currentView === 'diff') {
      DOM.diffContentArea.innerHTML = '<div class="diff-empty-state">No diff available. Paste text in raw input to view diff comparison.</div>';
    }
    return;
  }

  DOM.inputEmptyOverlay.style.display = 'none';
  DOM.outputEmptyOverlay.style.display = 'none';
  DOM.inputCharCountBadge.textContent = `(${text.length.toLocaleString()} chars)`;

  // Check massive payload (> 25,000 chars) for background Web Worker offload to preserve INP
  const isMassive = text.length > 25000;
  if (isMassive) {
    DOM.massivePayloadBanner.classList.add('visible');
    DOM.massiveBannerText.textContent = `Large payload (${text.length.toLocaleString()} chars). Executing asynchronously via background worker to preserve responsiveness...`;
    DOM.workerStatusBadge.textContent = 'Processing...';
    DOM.workerStatusBadge.style.color = 'var(--accent-amber)';

    if (state.worker) {
      state.isProcessing = true;
      state.workerMsgId++;
      state.worker.postMessage({
        id: state.workerMsgId,
        rawInput: text,
        config: state.config
      });
      return;
    }
  } else {
    DOM.massivePayloadBanner.classList.remove('visible');
  }

  // Yield to main thread for responsive INP (Interaction to Next Paint)
  if (typeof window !== 'undefined' && 'scheduler' in window && typeof window.scheduler.yield === 'function') {
    await window.scheduler.yield();
  } else {
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  // If text changed during yield, drop stale execution
  if (DOM.rawInputText.value !== text) return;

  // Fast synchronous execution for standard text
  const result = runCleanupPipeline(text, state.config);
  applyPipelineResult(result);
}

// Apply pipeline output and metrics
function applyPipelineResult(result) {
  state.cleanedOutput = result.output;
  DOM.cleanedOutputText.value = result.output;
  DOM.outputCharCountBadge.textContent = `(${result.output.length.toLocaleString()} chars)`;

  renderMetrics(result.metrics);

  // Update diff if diff view is active
  if (state.currentView === 'diff') {
    renderDiffView();
  }
}

// Format numbers and bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Render live metrics
function renderMetrics(metrics) {
  // Words
  DOM.metricWordsOut.textContent = metrics.output.words.toLocaleString();
  if (metrics.delta.words < 0) {
    DOM.metricWordsDelta.textContent = `(${metrics.delta.words.toLocaleString()})`;
    DOM.metricWordsDelta.className = 'metric-delta delta-reduction';
  } else if (metrics.delta.words > 0) {
    DOM.metricWordsDelta.textContent = `(+${metrics.delta.words.toLocaleString()})`;
    DOM.metricWordsDelta.className = 'metric-delta delta-increase';
  } else {
    DOM.metricWordsDelta.textContent = '';
  }

  // Chars
  DOM.metricCharsOut.textContent = metrics.output.chars.toLocaleString();
  DOM.metricCharsNoSpace.textContent = `/ ${metrics.output.charsNoSpaces.toLocaleString()} no spaces`;

  // Lines
  DOM.metricLinesOut.textContent = metrics.output.lines.toLocaleString();
  if (metrics.delta.lines < 0) {
    DOM.metricLinesDelta.textContent = `(${metrics.delta.lines.toLocaleString()})`;
    DOM.metricLinesDelta.className = 'metric-delta delta-reduction';
  } else if (metrics.delta.lines > 0) {
    DOM.metricLinesDelta.textContent = `(+${metrics.delta.lines.toLocaleString()})`;
    DOM.metricLinesDelta.className = 'metric-delta delta-increase';
  } else {
    DOM.metricLinesDelta.textContent = '';
  }

  // Size
  DOM.metricSize.textContent = formatBytes(metrics.output.bytes);

  // Speed
  DOM.metricSpeed.textContent = metrics.durationMs < 1 ? '< 1 ms' : `${metrics.durationMs} ms`;

  // Reduction percentage badge
  const percent = metrics.delta.percentReduced;
  DOM.reductionPercentText.textContent = `${percent.toFixed(1)}% Smaller`;

  // Invisible characters badge
  if (metrics.invisibleCount > 0) {
    DOM.invisibleCharWarning.style.display = 'inline-flex';
    DOM.invisibleCharText.textContent = `${metrics.invisibleCount} Invisible Unicode Chars Stripped`;
  } else {
    DOM.invisibleCharWarning.style.display = 'none';
  }
}

// Render Diff View
function renderDiffView() {
  const diffTokens = computeLineDiff(state.rawInput, state.cleanedOutput);
  DOM.diffContentArea.innerHTML = renderDiffHtml(diffTokens);
}

// Switch Views (Split / Diff / OutputOnly)
function setViewMode(mode) {
  state.currentView = mode;

  DOM.viewSplitBtn.classList.toggle('active', mode === 'split');
  DOM.viewDiffBtn.classList.toggle('active', mode === 'diff');
  DOM.viewOutputOnlyBtn.classList.toggle('active', mode === 'outputOnly');

  if (mode === 'split') {
    DOM.editorsGrid.style.display = 'grid';
    DOM.editorsGrid.classList.remove('view-diff-only');
    document.getElementById('inputPanel').style.display = 'flex';
    document.getElementById('outputPanel').style.display = 'flex';
    DOM.diffPanelWrapper.classList.remove('visible');
  } else if (mode === 'diff') {
    DOM.editorsGrid.style.display = 'none';
    DOM.diffPanelWrapper.classList.add('visible');
    renderDiffView();
  } else if (mode === 'outputOnly') {
    DOM.editorsGrid.style.display = 'grid';
    DOM.editorsGrid.classList.add('view-diff-only');
    document.getElementById('inputPanel').style.display = 'none';
    document.getElementById('outputPanel').style.display = 'flex';
    DOM.diffPanelWrapper.classList.remove('visible');
  }
}

// Sample Loader
function loadSample(sampleId, silent = false) {
  const sample = SAMPLES[sampleId];
  if (!sample) return;

  pushUndoState();
  const text = typeof sample.generator === 'function' ? sample.generator() : sample.text;
  DOM.rawInputText.value = text;
  triggerPipeline();
  if (!silent) {
    showToast(`Loaded sample: ${sample.title}`, 'info');
  }
}

// Undo / Redo History Stack
function pushUndoState() {
  state.undoStack.push(DOM.rawInputText.value);
  if (state.undoStack.length > 30) state.undoStack.shift();
  state.redoStack = [];
  updateUndoRedoUI();
}

function undo() {
  if (state.undoStack.length === 0) return;
  state.redoStack.push(DOM.rawInputText.value);
  const prev = state.undoStack.pop();
  DOM.rawInputText.value = prev;
  triggerPipeline();
  updateUndoRedoUI();
  showToast('Undo performed', 'info');
}

function redo() {
  if (state.redoStack.length === 0) return;
  state.undoStack.push(DOM.rawInputText.value);
  const next = state.redoStack.pop();
  DOM.rawInputText.value = next;
  triggerPipeline();
  updateUndoRedoUI();
  showToast('Redo performed', 'info');
}

function updateUndoRedoUI() {
  DOM.undoBtn.disabled = state.undoStack.length === 0;
  DOM.redoBtn.disabled = state.redoStack.length === 0;
}

// Toast System
export function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconSvg = type === 'success'
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 2600);
}

// Download Sanitized Text
function downloadCleanedText() {
  if (!state.cleanedOutput) {
    showToast('Output is empty. Nothing to download.', 'info');
    return;
  }

  let ext = 'txt';
  let mimeType = 'text/plain;charset=utf-8';

  if (state.config.delimiterConversion.includes('csv')) {
    ext = 'csv';
    mimeType = 'text/csv;charset=utf-8';
  } else if (state.config.stripMarkdownSyntax === false && state.rawInput.includes('#')) {
    ext = 'md';
    mimeType = 'text/markdown;charset=utf-8';
  }

  const blob = new Blob([state.cleanedOutput], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cleaned-text-${Date.now()}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Downloaded sanitized file: .${ext}`, 'success');
}

// Attach all UI events
function attachEvents() {
  // Theme Toggle
  DOM.themeToggleBtn.addEventListener('click', () => {
    setTheme(state.theme === 'dark' ? 'light' : 'dark');
  });

  // Preset Pills Click
  DOM.presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const id = pill.getAttribute('data-preset');
      applyPreset(id);
    });
  });

  // Sample Select
  DOM.sampleSelect.addEventListener('change', () => {
    const val = DOM.sampleSelect.value;
    if (val) {
      loadSample(val);
      DOM.sampleSelect.value = ''; // reset
    }
  });

  // Rules Header Collapse/Expand
  DOM.rulesHeader.addEventListener('click', () => {
    const isCollapsed = DOM.rulesBody.classList.toggle('collapsed');
    DOM.rulesChevron.style.transform = isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
    DOM.togglePanelLabel.textContent = isCollapsed ? 'Click to expand' : 'Click to collapse';
  });

  // Input Typing (with pushUndo on pause)
  const debouncedPipeline = debounce(triggerPipeline, 80);
  DOM.rawInputText.addEventListener('input', () => {
    debouncedPipeline();
  });

  DOM.rawInputText.addEventListener('keydown', (e) => {
    if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
      e.preventDefault();
      undo();
    } else if ((e.key === 'y' && (e.ctrlKey || e.metaKey)) || (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey)) {
      e.preventDefault();
      redo();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      triggerPipeline();
      showToast('Sanitization refreshed', 'success');
    }
  });

  // Paste from Clipboard
  DOM.pasteClipboardBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        pushUndoState();
        DOM.rawInputText.value = text;
        triggerPipeline();
        showToast('Pasted from clipboard', 'success');
      } else {
        showToast('Clipboard is empty', 'info');
      }
    } catch (err) {
      showToast('Clipboard access denied. Please paste manually.', 'info');
    }
  });

  // Clear Input
  DOM.clearInputBtn.addEventListener('click', () => {
    if (DOM.rawInputText.value) {
      pushUndoState();
      DOM.rawInputText.value = '';
      triggerPipeline();
      showToast('Input cleared', 'info');
    }
  });

  // Reset All Button
  DOM.resetAllBtn.addEventListener('click', () => {
    pushUndoState();
    DOM.rawInputText.value = '';
    applyPreset('aiSanitizer');
    DOM.findText.value = '';
    DOM.replaceText.value = '';
    triggerPipeline();
    showToast('Reset to default configuration', 'info');
  });

  // Copy Cleaned Output
  DOM.copyOutputBtn.addEventListener('click', async () => {
    if (!state.cleanedOutput) {
      showToast('Output is empty. Nothing to copy.', 'info');
      return;
    }
    try {
      await navigator.clipboard.writeText(state.cleanedOutput);
      showToast(`Copied ${state.cleanedOutput.length.toLocaleString()} characters!`, 'success');
    } catch {
      // Fallback
      DOM.cleanedOutputText.select();
      document.execCommand('copy');
      showToast(`Copied ${state.cleanedOutput.length.toLocaleString()} characters!`, 'success');
    }
  });

  // Global Keyboard Shortcut: Ctrl+Shift+C to Copy Output
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      DOM.copyOutputBtn.click();
    }
  });

  // Download Output
  DOM.downloadOutputBtn.addEventListener('click', downloadCleanedText);

  // Undo / Redo buttons
  DOM.undoBtn.addEventListener('click', undo);
  DOM.redoBtn.addEventListener('click', redo);

  // View switchers
  DOM.viewSplitBtn.addEventListener('click', () => setViewMode('split'));
  DOM.viewDiffBtn.addEventListener('click', () => setViewMode('diff'));
  DOM.viewOutputOnlyBtn.addEventListener('click', () => setViewMode('outputOnly'));

  // File Upload
  DOM.uploadFileBtn.addEventListener('click', () => {
    DOM.fileUploadInput.click();
  });

  DOM.fileUploadInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        pushUndoState();
        DOM.rawInputText.value = evt.target.result;
        triggerPipeline();
        showToast(`Loaded file: ${file.name}`, 'success');
      };
      reader.readAsText(file);
    }
  });

  // Drag and Drop support
  const inputArea = DOM.rawInputText;
  inputArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    inputArea.style.borderColor = 'var(--accent-primary)';
  });
  inputArea.addEventListener('dragleave', () => {
    inputArea.style.borderColor = '';
  });
  inputArea.addEventListener('drop', (e) => {
    e.preventDefault();
    inputArea.style.borderColor = '';
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        pushUndoState();
        inputArea.value = evt.target.result;
        triggerPipeline();
        showToast(`Dropped file: ${file.name}`, 'success');
      };
      reader.readAsText(file);
    }
  });
}

// Start application
window.addEventListener('DOMContentLoaded', init);

// ==========================================================================
// Core Web Vitals (CWV) Real User Monitoring & Diagnostics
// Measures LCP, INP, CLS, FCP, and TTFB using standard PerformanceObserver
// ==========================================================================
const webVitals = {
  fcp: null,
  lcp: null,
  cls: 0,
  inp: null,
  ttfb: null,
};

function initWebVitalsObserver() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  // FCP
  try {
    const fcpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
        webVitals.fcp = Math.round(entry.startTime);
        fcpObserver.disconnect();
      }
    });
    fcpObserver.observe({ type: 'paint', buffered: true });
  } catch {}

  // LCP
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        webVitals.lcp = Math.round(lastEntry.startTime);
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {}

  // CLS
  try {
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          webVitals.cls = parseFloat((webVitals.cls + entry.value).toFixed(4));
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch {}

  // INP
  try {
    const inpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const duration = Math.round(entry.duration);
        if (webVitals.inp === null || duration > webVitals.inp) {
          webVitals.inp = duration;
        }
      }
    });
    inpObserver.observe({ type: 'event', durationThreshold: 16, buffered: true });
  } catch {}

  // TTFB
  try {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length > 0) {
      webVitals.ttfb = Math.round(navEntries[0].responseStart);
    }
  } catch {}

  window.__CWV_METRICS__ = webVitals;
}

initWebVitalsObserver();

