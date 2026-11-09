// Runs the user's solution code in the browser against a problem's
// test cases. The code is the user's own, running locally in their own
// browser; every call is wrapped so a mistake is reported, never fatal.

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

// Returns { results: [{ passed, input, expected, actual, error }], allPassed, compileError }
export function runSolution(code, functionName, testCases, unordered) {
  let fn;
  try {
    // Intentional: this is the point of the app. The code being compiled
    // is the user's own solution, typed by them, running only in their
    // own browser. No remote code is ever evaluated.
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
