// The program that runs inside the sandbox Worker (browser) or worker_threads
// worker (Node). It is shipped as a string so the browser can build the Worker
// from a Blob URL: no separate worker chunk, no bundler config, and it works
// unchanged from a static GitHub Pages host.
//
// The worker has no DOM: no window, no document, no localStorage, no fetch
// of the page's storage. User code that touches those globals throws a
// ReferenceError, which is reported per test case instead of executing.
// The worker runs one test case per message and the host terminates it on
// timeout, so an infinite loop can never freeze the tab.

export const WORKER_SOURCE = `
function deepEqual(a, b, unordered) {
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    return Math.abs(a - b) < 1e-9;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    if (unordered) {
      const rest = b.slice();
      return a.every(function (x) {
        const i = rest.findIndex(function (y) { return deepEqual(x, y, true); });
        if (i === -1) return false;
        rest.splice(i, 1);
        return true;
      });
    }
    return a.every(function (x, i) { return deepEqual(x, b[i], false); });
  }
  return a === b;
}

function clone(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

function formatValue(value) {
  if (value === undefined) return 'undefined';
  try {
    const s = JSON.stringify(value);
    return s === undefined ? String(value) : s;
  } catch (e) {
    return String(value);
  }
}

self.onmessage = function (e) {
  const msg = e && e.data !== undefined ? e.data : e;
  const id = msg.id;
  let fn;
  try {
    const factory = new Function(msg.code + '\\nreturn ' + msg.functionName + ';');
    fn = factory();
    if (typeof fn !== 'function') {
      self.postMessage({ id: id, compileError: 'Could not find a function named ' + msg.functionName + '. Make sure your solution defines it.' });
      return;
    }
  } catch (err) {
    self.postMessage({ id: id, compileError: err && err.message ? err.message : String(err) });
    return;
  }
  let actual;
  try {
    actual = fn.apply(null, clone(msg.args));
  } catch (err) {
    self.postMessage({ id: id, error: err && err.message ? err.message : String(err) });
    return;
  }
  let passed;
  try {
    passed = deepEqual(actual, msg.expected, !!msg.unordered);
  } catch (err) {
    self.postMessage({ id: id, error: err && err.message ? err.message : String(err) });
    return;
  }
  self.postMessage({ id: id, passed: passed, actual: formatValue(actual) });
};
`;
