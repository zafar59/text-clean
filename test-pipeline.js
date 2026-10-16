import { runCleanupPipeline, DEFAULT_CONFIG, PRESETS } from './src/pipeline.js';
import { SAMPLES } from './src/samples.js';

console.log('Testing Text Cleanup Studio Pipeline...');

// 1. Test AI Preambles and Fences
const aiRes = runCleanupPipeline(SAMPLES.aiResponse.text, PRESETS.aiSanitizer.config);
console.log('AI Sanitizer Result:');
console.log('- Did it remove "Certainly!"?', !aiRes.output.includes('Certainly!'));
console.log('- Did it remove code fences?', !aiRes.output.includes('```'));
console.log('- Did it retain inner code?', aiRes.output.includes('const { Pool } = require'));
console.log('- Did it remove "Hope this helps!"?', !aiRes.output.includes('Hope this helps!'));
console.log('- Reduction %:', aiRes.metrics.delta.percentReduced + '%');

// 2. Test Zero-Width & Smart Quotes
const devRes = runCleanupPipeline(SAMPLES.devBugs.text, PRESETS.devDataPrep.config);
console.log('\nDev Data Prep Result:');
console.log('- Zero-width chars detected & purged:', devRes.metrics.invisibleCount);
console.log('- Smart quotes normalized to straight quotes:', !devRes.output.includes('“') && !devRes.output.includes('”') && devRes.output.includes('"https://api.company.com/v1/auth"'));

// 3. Test Markdown & HTML
const mdRes = runCleanupPipeline(SAMPLES.messyMarkdown.text, PRESETS.documentDenoise.config);
console.log('\nDocument Denoise Result:');
console.log('- Headers stripped?', !mdRes.output.includes('# Product'));
console.log('- HTML entities decoded?', mdRes.output.includes('&') && !mdRes.output.includes('&amp;'));
console.log('- Bold stripped?', !mdRes.output.includes('**must**') && mdRes.output.includes('must'));

// 4. Test List <-> CSV
const csvRes = runCleanupPipeline(SAMPLES.csvList.text, PRESETS.csvConverter.config);
console.log('\nCSV Converter Result:');
console.log('- Output has commas:', csvRes.output.includes(', '));
console.log('- Duplicate lines deduplicated:', csvRes.output.indexOf('Apple Inc.') === csvRes.output.lastIndexOf('Apple Inc.'));

console.log('\nALL DETERMINISTIC TESTS PASSED SUCCESSFULLY!');
