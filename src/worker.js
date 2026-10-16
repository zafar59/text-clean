import { runCleanupPipeline } from './pipeline.js';

self.onmessage = function (e) {
  const { id, rawInput, config } = e.data;
  try {
    const result = runCleanupPipeline(rawInput, config);
    self.postMessage({ id, success: true, result });
  } catch (err) {
    self.postMessage({ id, success: false, error: err.message });
  }
};
