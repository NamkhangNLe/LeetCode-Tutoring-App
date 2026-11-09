// Runs the user's solution code against a problem's test cases.
//
// Safety model (fixed 2026-11-09: the old version compiled user code with
// `new Function` and ran it synchronously on the main thread, so
// `while (true) {}` froze the tab and `localStorage.clear()` wiped progress):
//  - User code runs in a Web Worker built from a Blob URL (see workerSource.js),
//    never on the main thread. A Worker has no DOM, no document, no
//    localStorage, and a fresh global scope per case.
//  - Each test case runs in its own fresh Worker with a per-case timeout
//    (default 2000 ms). On timeout the Worker is terminated and the case is
//    reported as "timed out" instead of hanging.
//  - In Node (tests / verification) the same worker source runs under
//    worker_threads via a small adapter, so the timeout behaviour is real
//    there too, not mocked.

import { WORKER_SOURCE } from './workerSource';

export const CASE_TIMEOUT_MS = 2000;

function deepEqual(a, b, unordered) {
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    return Math.abs(a - b) < 1e-9;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    if (unordered) {
      const rest = [...b];
      return a.every((x) => {
        const i = rest.findIndex((y) => deepEqual(x, y, true));
        if (i === -1) return false;
        rest.splice(i, 1);
        return true;
      });
    }
    return a.every((x, i) => deepEqual(x, b[i], false));
  }
  return a === b;
}

function clone(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

export function formatValue(value) {
  if (value === undefined) return 'undefined';
  try {
    const s = JSON.stringify(value);
    return s === undefined ? String(value) : s;
  } catch (e) {
    return String(value);
  }
}

export function formatArgs(args) {
  return args.map(formatValue).join(', ');
}

// Synchronous in-process run, kept for unit tests of the comparison logic
// only. The UI never uses this: it would reintroduce the freeze.
export function runSolutionSync(code, functionName, testCases, unordered) {
  let fn;
  try {
    // eslint-disable-next-line no-new-func
    const factory = new Function(`${code}\nreturn ${functionName};`);
    fn = factory();
    if (typeof fn !== 'function') {
      return {
        results: [],
        allPassed: false,
        compileError: `Could not find a function named ${functionName}. Make sure your solution defines it.`,
      };
    }
  } catch (e) {
    return { results: [], allPassed: false, compileError: e.message };
  }

  const results = testCases.map((tc) => {
    let actual;
    try {
      actual = fn(...clone(tc.args));
    } catch (e) {
      return {
        passed: false,
        input: formatArgs(tc.args),
        expected: formatValue(tc.expected),
        actual: null,
        error: e.message,
      };
    }
    const passed = deepEqual(actual, tc.expected, !!unordered);
    return {
      passed,
      input: formatArgs(tc.args),
      expected: formatValue(tc.expected),
      actual: formatValue(actual),
      error: null,
    };
  });

  return { results, allPassed: results.every((r) => r.passed), compileError: null };
}

// --- Worker spawning -------------------------------------------------------

// Browser: Worker from a Blob URL, so no worker chunk or bundler config is
// needed and the file works from any static host.
function spawnBrowserWorker() {
  const blob = new Blob([WORKER_SOURCE], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  const origTerminate = worker.terminate.bind(worker);
  worker.terminate = () => {
    origTerminate();
    URL.revokeObjectURL(url);
  };
  return worker;
}

// Node (jest / verification): the same source under worker_threads, with a
// `self` shim so the worker program is identical in both environments.
async function spawnNodeWorker() {
  const { Worker } = await import(/* webpackIgnore: true */ 'worker_threads');
  const shim = [
    "const { parentPort } = require('worker_threads');",
    'globalThis.self = {',
    '  postMessage: (m) => parentPort.postMessage(m),',
    '};',
    "Object.defineProperty(globalThis.self, 'onmessage', {",
    '  configurable: true,',
    '  set(fn) { parentPort.on("message", (data) => fn({ data })); },',
    '  get() { return null; },',
    '});',
    '',
  ].join('\n');
  const worker = new Worker(shim + WORKER_SOURCE, { eval: true });
  return {
    postMessage: (msg) => worker.postMessage(msg),
    terminate: () => worker.terminate(),
    set onmessage(fn) {
      worker.on('message', (data) => fn({ data }));
    },
    set onerror(fn) {
      worker.on('error', (err) => fn({ message: err && err.message ? err.message : String(err) }));
    },
  };
}

async function spawnWorker() {
  if (typeof Worker !== 'undefined') return spawnBrowserWorker();
  return spawnNodeWorker();
}

// Run ONE test case in a fresh worker with a hard timeout. Resolves to a
// result object; never hangs: on timeout the worker is terminated.
function runCase(code, functionName, tc, unordered, timeoutMs) {
  return new Promise((resolve) => {
    let settled = false;
    let worker = null;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      try {
        if (worker) worker.terminate();
      } catch (e) {
        // already gone
      }
      resolve({
        passed: false,
        input: formatArgs(tc.args),
        expected: formatValue(tc.expected),
        actual: null,
        error: null,
        timedOut: true,
      });
    }, timeoutMs);

    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        if (worker) worker.terminate();
      } catch (e) {
        // already gone
      }
      resolve(result);
    };

    spawnWorker()
      .then((w) => {
        if (settled) {
          try {
            w.terminate();
          } catch (e) {
            // ignore
          }
          return;
        }
        worker = w;
        w.onmessage = (e) => {
          const msg = e.data;
          if (msg.compileError) {
            finish({ compileError: msg.compileError });
            return;
          }
          if (msg.error) {
            finish({
              passed: false,
              input: formatArgs(tc.args),
              expected: formatValue(tc.expected),
              actual: null,
              error: msg.error,
              timedOut: false,
            });
            return;
          }
          finish({
            passed: !!msg.passed,
            input: formatArgs(tc.args),
            expected: formatValue(tc.expected),
            actual: msg.actual,
            error: null,
            timedOut: false,
          });
        };
        w.onerror = (e) => {
          finish({
            passed: false,
            input: formatArgs(tc.args),
            expected: formatValue(tc.expected),
            actual: null,
            error: (e && e.message) || 'Worker error',
            timedOut: false,
          });
        };
        w.postMessage({
          id: 1,
          code,
          functionName,
          args: clone(tc.args),
          expected: clone(tc.expected),
          unordered: !!unordered,
        });
      })
      .catch((e) => {
        finish({
          passed: false,
          input: formatArgs(tc.args),
          expected: formatValue(tc.expected),
          actual: null,
          error: (e && e.message) || String(e),
          timedOut: false,
        });
      });
  });
}

// Returns { results, hiddenResults, allPassed, compileError, timedOut }.
// `testCases` are shown in full; `hiddenTestCases` are run the same way but
// the UI only reports their pass/fail counts, never inputs or expected values.
export async function runSolution(
  code,
  functionName,
  testCases,
  unordered,
  hiddenTestCases = [],
  timeoutMs = CASE_TIMEOUT_MS
) {
  const runAll = async (cases) => {
    const out = [];
    for (const tc of cases) {
      // eslint-disable-next-line no-await-in-loop
      const r = await runCase(code, functionName, tc, unordered, timeoutMs);
      if (r.compileError) return { out, compileError: r.compileError };
      out.push(r);
    }
    return { out, compileError: null };
  };

  const visible = await runAll(testCases || []);
  if (visible.compileError) {
    return {
      results: [],
      hiddenResults: [],
      allPassed: false,
      compileError: visible.compileError,
      timedOut: false,
    };
  }
  const hidden = await runAll(hiddenTestCases || []);
  if (hidden.compileError) {
    return {
      results: visible.out,
      hiddenResults: [],
      allPassed: false,
      compileError: hidden.compileError,
      timedOut: false,
    };
  }
  const all = [...visible.out, ...hidden.out];
  return {
    results: visible.out,
    hiddenResults: hidden.out,
    allPassed: all.length > 0 && all.every((r) => r.passed),
    compileError: null,
    timedOut: all.some((r) => r.timedOut),
  };
}
