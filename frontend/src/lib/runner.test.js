import { runSolution, runSolutionSync, CASE_TIMEOUT_MS } from './runner';

jest.setTimeout(15000);

test('a correct solution passes its cases through the worker runner', async () => {
  const result = await runSolution(
    'function twoSum(nums, target) { const s = new Map(); for (let i = 0; i < nums.length; i++) { const n = target - nums[i]; if (s.has(n)) return [s.get(n), i]; s.set(nums[i], i); } return [-1, -1]; }',
    'twoSum',
    [{ args: [[2, 7, 11, 15], 9], expected: [0, 1] }],
    false
  );
  expect(result.compileError).toBeNull();
  expect(result.allPassed).toBe(true);
  expect(result.results[0].passed).toBe(true);
});

test('an infinite loop terminates with a timeout result instead of hanging', async () => {
  const start = Date.now();
  const result = await runSolution(
    'function f(){while(true){}}',
    'f',
    [{ args: [], expected: 1 }],
    false,
    [],
    CASE_TIMEOUT_MS
  );
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(5000);
  expect(result.allPassed).toBe(false);
  expect(result.timedOut).toBe(true);
  expect(result.results[0].timedOut).toBe(true);
});

test('user code cannot reach localStorage or document from the worker', async () => {
  const evil = await runSolution(
    'function f(){ localStorage.clear(); return 1; }',
    'f',
    [{ args: [], expected: 1 }],
    false
  );
  expect(evil.results[0].passed).toBe(false);
  expect(evil.results[0].error).toMatch(/localStorage is not defined/);

  const evilDoc = await runSolution(
    'function f(){ return document.title; }',
    'f',
    [{ args: [], expected: 1 }],
    false
  );
  expect(evilDoc.results[0].passed).toBe(false);
  expect(evilDoc.results[0].error).toMatch(/document is not defined/);
});

test('a wrong solution fails and a syntax error surfaces as a compile error', async () => {
  const wrong = await runSolution('function f(){ return 999; }', 'f', [
    { args: [], expected: 1 },
  ]);
  expect(wrong.allPassed).toBe(false);

  const bad = await runSolution('function f( {', 'f', [{ args: [], expected: 1 }]);
  expect(bad.compileError).toBeTruthy();
});

test('hidden cases run but are reported separately from visible cases', async () => {
  const result = await runSolution(
    'function f(n){ return n * 2; }',
    'f',
    [{ args: [2], expected: 4 }],
    false,
    [
      { args: [0], expected: 0 },
      { args: [-3], expected: -6 },
    ]
  );
  expect(result.allPassed).toBe(true);
  expect(result.results).toHaveLength(1);
  expect(result.hiddenResults).toHaveLength(2);
  expect(result.hiddenResults.every((r) => r.passed)).toBe(true);
});

test('the sync comparison helper still handles unordered and float cases', () => {
  const r = runSolutionSync(
    'function threeSum(nums){ return [[-1,-1,2],[-1,0,1]]; }',
    'threeSum',
    [{ args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, 0, 1], [-1, -1, 2]] }],
    true
  );
  expect(r.allPassed).toBe(true);
});
