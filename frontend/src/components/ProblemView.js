import React, { useState, useEffect, useRef } from 'react';
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

export default function ProblemView({ problem, progress, onProgressChange, onBack }) {
  const solved = !!progress.solved[problem.key];
  const [code, setCode] = useState(() => loadCode(problem.key, problem.starterCode));
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [runResult, setRunResult] = useState(null);
  const [showApproach, setShowApproach] = useState(false);
  const [justSolved, setJustSolved] = useState(false);
  const editorRef = useRef(null);

  // Reset local state when switching problems.
  useEffect(() => {
    setCode(loadCode(problem.key, problem.starterCode));
    setHintsRevealed(0);
    setRunResult(null);
    setShowApproach(false);
    setJustSolved(false);
  }, [problem.key, problem.starterCode]);

  const handleCodeChange = (value) => {
    setCode(value);
    saveCode(problem.key, value);
  };

  const handleTab = (e) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = editorRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = code.slice(0, start) + '  ' + code.slice(end);
    handleCodeChange(next);
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + 2;
    });
  };

  const handleRun = () => {
    const result = runSolution(code, problem.functionName, problem.testCases, problem.unordered);
    setRunResult(result);
    if (result.allPassed && !solved) {
      onProgressChange(markSolved(progress, problem.key, hintsRevealed));
      setJustSolved(true);
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
      onProgressChange(markSolved(progress, problem.key, hintsRevealed));
    }
  };

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
              {solved && <span className="pill pill-solved">✓ Solved</span>}
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
          <div className="editor-panel">
            <div className="editor-header">
              <span className="editor-title">solution.js</span>
              <span className="editor-fn">
                define <code>{problem.functionName}</code>
              </span>
              <button className="btn btn-mini" onClick={handleResetCode}>
                Reset
              </button>
            </div>
            <textarea
              ref={editorRef}
              className="editor"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              onKeyDown={handleTab}
              spellCheck={false}
              aria-label="Code editor"
            />
            <div className="editor-footer">
              <button className="btn btn-primary" onClick={handleRun}>
                ▶ Run tests
              </button>
              <span className="test-count">
                {problem.testCases.length} test cases · runs in your browser
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
                      ? `All ${runResult.results.length} tests passed.`
                      : `${runResult.results.filter((r) => r.passed).length} of ${
                          runResult.results.length
                        } tests passed.`}
                  </div>
                  {justSolved && runResult.allPassed && (
                    <div className="solved-banner">
                      Solved! This problem is now marked complete for the{' '}
                      {problem.pattern.name} pattern.
                    </div>
                  )}
                  {runResult.results.map((r, i) => (
                    <div key={i} className={`test-case ${r.passed ? 'pass' : 'fail'}`}>
                      <div className="test-case-head">
                        <span className="test-status">{r.passed ? '✓ Passed' : '✗ Failed'}</span>
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
    </div>
  );
}
