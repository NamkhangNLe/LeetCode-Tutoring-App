import React, { useState, useEffect, useRef, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { runSolution } from '../lib/runner';
import { markSolved, unmarkSolved } from '../lib/progress';

const CODE_KEY = 'patternwise-code-v1';

function loadCode(problemKey, starterCode) {
  try {
    const all = JSON.parse(localStorage.getItem(CODE_KEY) || '{}');
    return all[problemKey] || starterCode;
  } catch (e) {
    return starterCode;
  }
}

function saveCode(problemKey, code) {
  try {
    const all = JSON.parse(localStorage.getItem(CODE_KEY) || '{}');
    all[problemKey] = code;
    localStorage.setItem(CODE_KEY, JSON.stringify(all));
  } catch (e) {
    // ignore persistence failures
  }
}

const DIFF_CLASS = {
  Easy: 'pill-easy',
  Medium: 'pill-medium',
  Hard: 'pill-hard',
};

export default function ProblemView({
  problem,
  progress,
  onProgressChange,
  onBack,
  prevProblem,
  nextProblem,
  onNavigateProblem,
}) {
  const solved = !!progress.solved[problem.key];
  const assisted = !!progress.solved[problem.key]?.assisted;
  const [code, setCode] = useState(() => loadCode(problem.key, problem.starterCode));
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [runResult, setRunResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [showApproach, setShowApproach] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [justSolved, setJustSolved] = useState(false);
  const solutionRevealedRef = useRef(false);
  const runIdRef = useRef(0);

  // Reset local state when switching problems.
  useEffect(() => {
    setCode(loadCode(problem.key, problem.starterCode));
    setHintsRevealed(0);
    setRunResult(null);
    setRunning(false);
    setShowApproach(false);
    setShowSolution(false);
    setJustSolved(false);
    solutionRevealedRef.current = false;
    runIdRef.current += 1;
  }, [problem.key, problem.starterCode]);

  const handleCodeChange = (value) => {
    setCode(value);
    saveCode(problem.key, value);
  };

  const handleRun = useCallback(async () => {
    const runId = ++runIdRef.current;
    setRunning(true);
    setJustSolved(false);
    const result = await runSolution(
      code,
      problem.functionName,
      problem.testCases,
      problem.unordered,
      problem.hiddenTestCases || []
    );
    if (runId !== runIdRef.current) return; // user moved to another problem
    setRunResult(result);
    setRunning(false);
    if (result.allPassed && !solved) {
      onProgressChange(
        markSolved(progress, problem.key, hintsRevealed, solutionRevealedRef.current)
      );
      setJustSolved(true);
    }
  }, [code, problem, progress, solved, hintsRevealed, onProgressChange]);

  // Cmd/Ctrl+Enter runs the tests, from anywhere in the editor panel.
  const handleEditorKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  };

  const handleResetCode = () => {
    handleCodeChange(problem.starterCode);
    setRunResult(null);
  };

  const handleToggleSolved = () => {
    if (solved) {
      onProgressChange(unmarkSolved(progress, problem.key));
    } else {
      onProgressChange(
        markSolved(progress, problem.key, hintsRevealed, solutionRevealedRef.current)
      );
    }
  };

  const handleRevealSolution = () => {
    solutionRevealedRef.current = true;
    setShowSolution((v) => !v);
  };

  const hiddenPassed = runResult
    ? runResult.hiddenResults.filter((r) => r.passed).length
    : 0;
  const hiddenTotal = runResult ? runResult.hiddenResults.length : 0;

  return (
    <div className="problem-view">
      <button className="back-link" onClick={onBack}>
        ← {problem.pattern.name}
      </button>

      <div className="problem-layout">
        <div className="problem-left">
          <header className="problem-header">
            <span className="problem-num">LeetCode {problem.number}</span>
            <h1>{problem.title}</h1>
            <div className="problem-tags">
              <span className={`pill ${DIFF_CLASS[problem.difficulty]}`}>{problem.difficulty}</span>
              <span className="pill pill-pattern">{problem.pattern.name}</span>
              {solved && !assisted && <span className="pill pill-solved">✓ Solved</span>}
              {solved && assisted && (
                <span className="pill pill-assisted">✓ Solved with help</span>
              )}
            </div>
          </header>

          <p className="problem-prompt">{problem.prompt}</p>

          <section className="hints">
            <h2>Hints, one at a time</h2>
            <p className="section-sub">
              Try the problem first. Each hint gives away a little more, and the
              hints you use are recorded with your solve.
            </p>
            {problem.hints.slice(0, hintsRevealed).map((hint, i) => (
              <div key={i} className="hint-card">
                <span className="hint-num">Hint {i + 1}</span>
                <p>{hint}</p>
              </div>
            ))}
            {hintsRevealed < problem.hints.length && (
              <button
                className="btn btn-ghost"
                onClick={() => setHintsRevealed((n) => n + 1)}
              >
                Reveal hint {hintsRevealed + 1} of {problem.hints.length}
              </button>
            )}
          </section>

          <section className="approach">
            <button
              className="approach-toggle"
              onClick={() => setShowApproach((v) => !v)}
            >
              {showApproach ? 'Hide the approach ▲' : 'Show the approach ▼'}
            </button>
            {showApproach && <p>{problem.approach}</p>}
          </section>

          <section className="solution-reveal">
            <button className="approach-toggle" onClick={handleRevealSolution}>
              {showSolution
                ? 'Hide the reference solution ▲'
                : 'Reveal the reference solution ▼'}
            </button>
            <p className="section-sub">
              Stuck for real? Read the solution, understand it, then re-solve it
              yourself. Revealing it marks this problem as solved with help, not
              as an unassisted solve.
            </p>
            {showSolution && (
              <div className="solution-card">
                <pre className="code-block">
                  <code>{problem.solution}</code>
                </pre>
                <p className="complexity">
                  <strong>Complexity:</strong> {problem.complexity}
                </p>
              </div>
            )}
          </section>

          <a
            className="leetcode-link"
            href={problem.url}
            target="_blank"
            rel="noreferrer"
          >
            Open on LeetCode ↗
          </a>
        </div>

        <div className="problem-right">
          <div className="editor-panel" onKeyDown={handleEditorKeyDown}>
            <div className="editor-header">
              <span className="editor-title">solution.js</span>
              <span className="editor-fn">
                define <code>{problem.functionName}</code>
              </span>
              <button className="btn btn-mini" onClick={handleResetCode}>
                Reset
              </button>
            </div>
            <CodeMirror
              value={code}
              height="340px"
              theme={oneDark}
              extensions={[javascript({ jsx: false })]}
              onChange={(value) => handleCodeChange(value)}
              basicSetup={{
                lineNumbers: true,
                bracketMatching: true,
                autocompletion: false,
                foldGutter: false,
                highlightActiveLineGutter: true,
              }}
              aria-label="Code editor"
            />
            <div className="editor-footer">
              <button className="btn btn-primary" onClick={handleRun} disabled={running}>
                {running ? 'Running…' : '▶ Run tests'}
              </button>
              <span className="test-count">
                {problem.testCases.length} visible +{' '}
                {(problem.hiddenTestCases || []).length} hidden test cases · runs
                sandboxed in your browser · ⌘/Ctrl+Enter to run
              </span>
            </div>
          </div>

          {runResult && (
            <div className="results">
              {runResult.compileError ? (
                <div className="result-error">
                  <strong>Could not run your code.</strong>
                  <p>{runResult.compileError}</p>
                </div>
              ) : (
                <>
                  <div className={`results-summary ${runResult.allPassed ? 'pass' : 'fail'}`}>
                    {runResult.allPassed
                      ? `All ${runResult.results.length + hiddenTotal} tests passed.`
                      : `${runResult.results.filter((r) => r.passed).length} of ${
                          runResult.results.length
                        } visible tests passed.`}
                  </div>
                  {hiddenTotal > 0 && (
                    <div className="hidden-summary">
                      Hidden tests: {hiddenPassed} of {hiddenTotal} passed.
                    </div>
                  )}
                  {runResult.timedOut && (
                    <div className="result-error">
                      <strong>Your code timed out.</strong>
                      <p>
                        A test case ran longer than 2 seconds and was stopped, so
                        the tab stays responsive. Check for an infinite loop or a
                        loop that never makes progress.
                      </p>
                    </div>
                  )}
                  {justSolved && runResult.allPassed && (
                    <div className="solved-banner">
                      Solved{assisted || solutionRevealedRef.current
                        ? ' with the reference solution — marked as assisted'
                        : ''}
                      ! This problem is now marked complete for the{' '}
                      {problem.pattern.name} pattern.
                    </div>
                  )}
                  {runResult.results.map((r, i) => (
                    <div key={i} className={`test-case ${r.passed ? 'pass' : 'fail'}`}>
                      <div className="test-case-head">
                        <span className="test-status">
                          {r.timedOut ? '◷ Timed out' : r.passed ? '✓ Passed' : '✗ Failed'}
                        </span>
                        <span className="test-name">Test case {i + 1}</span>
                      </div>
                      <div className="test-detail">
                        <span>Input</span>
                        <code>{r.input}</code>
                      </div>
                      <div className="test-detail">
                        <span>Expected</span>
                        <code>{r.expected}</code>
                      </div>
                      {r.error ? (
                        <div className="test-detail">
                          <span>Error</span>
                          <code>{r.error}</code>
                        </div>
                      ) : (
                        !r.passed && (
                          <div className="test-detail">
                            <span>Got</span>
                            <code>{r.actual}</code>
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          <button className="btn btn-ghost mark-solved-btn" onClick={handleToggleSolved}>
            {solved ? 'Mark as not solved' : 'I solved it on LeetCode — mark solved'}
          </button>
        </div>
      </div>

      <nav className="problem-nav">
        {prevProblem ? (
          <button
            className="btn btn-ghost"
            onClick={() => onNavigateProblem(prevProblem.key)}
          >
            ← {prevProblem.title}
          </button>
        ) : (
          <span />
        )}
        {nextProblem ? (
          <button
            className="btn btn-ghost"
            onClick={() => onNavigateProblem(nextProblem.key)}
          >
            {nextProblem.title} →
          </button>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
