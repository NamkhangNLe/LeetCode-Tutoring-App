import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import PatternView from './components/PatternView';
import ProblemView from './components/ProblemView';
import { PATTERNS, getPattern, getProblem } from './data/patterns';
import { loadProgress, saveProgress } from './lib/progress';

// Hash routing: every pattern and problem has a shareable URL and a refresh
// preserves your place. Routes: #/ (home), #/pattern/:id,
// #/problem/:patternId/:problemKey. The back button works via hashchange.
function parseHash() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const parts = hash.split('/').filter(Boolean);
  if (parts[0] === 'pattern' && parts[1] && getPattern(parts[1])) {
    return { name: 'pattern', patternId: parts[1] };
  }
  if (parts[0] === 'problem' && parts[1] && parts[2] && getProblem(parts[1], parts[2])) {
    return { name: 'problem', patternId: parts[1], problemKey: parts[2] };
  }
  return { name: 'home' };
}

function hashFor(view) {
  if (view.name === 'pattern') return `#/pattern/${view.patternId}`;
  if (view.name === 'problem') return `#/problem/${view.patternId}/${view.problemKey}`;
  return '#/';
}

function App() {
  const [view, setView] = useState(() => parseHash());
  const [progress, setProgress] = useState(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    const onHashChange = () => setView(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((next) => {
    const hash = hashFor(next);
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
    setView(next);
  }, []);

  const handleProgressChange = useCallback((next) => {
    setProgress(next);
  }, []);

  const resetProgress = () => {
    if (window.confirm('Reset all progress? This clears solved problems and lessons read.')) {
      setProgress({ solved: {}, lessonsRead: {} });
    }
  };

  let content;
  if (view.name === 'pattern') {
    const pattern = getPattern(view.patternId);
    content = (
      <PatternView
        pattern={pattern}
        progress={progress}
        onProgressChange={handleProgressChange}
        onOpenProblem={(problemKey) =>
          navigate({ name: 'problem', patternId: pattern.id, problemKey })
        }
        onBack={() => navigate({ name: 'home' })}
      />
    );
  } else if (view.name === 'problem') {
    const found = getProblem(view.patternId, view.problemKey);
    const idx = found.pattern.problems.findIndex((p) => p.key === found.key);
    const prevProblem = idx > 0 ? found.pattern.problems[idx - 1] : null;
    const nextProblem =
      idx >= 0 && idx < found.pattern.problems.length - 1
        ? found.pattern.problems[idx + 1]
        : null;
    content = (
      <ProblemView
        problem={found}
        progress={progress}
        onProgressChange={handleProgressChange}
        onBack={() => navigate({ name: 'pattern', patternId: view.patternId })}
        prevProblem={prevProblem}
        nextProblem={nextProblem}
        onNavigateProblem={(problemKey) =>
          navigate({ name: 'problem', patternId: view.patternId, problemKey })
        }
      />
    );
  } else {
    content = (
      <Dashboard
        progress={progress}
        onOpenPattern={(id) => navigate({ name: 'pattern', patternId: id })}
        onOpenProblem={(patternId, problemKey) =>
          navigate({ name: 'problem', patternId, problemKey })
        }
      />
    );
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <button className="brand" onClick={() => navigate({ name: 'home' })}>
            <span className="brand-mark">▦</span>
            <span className="brand-name">Patternwise</span>
            <span className="brand-sub">LeetCode, taught by pattern</span>
          </button>
          <nav className="header-nav">
            <button onClick={() => navigate({ name: 'home' })}>Patterns</button>
            <button className="reset-link" onClick={resetProgress}>
              Reset progress
            </button>
          </nav>
        </div>
      </header>

      <main className="main">{content}</main>

      <footer className="site-footer">
        <div className="footer-inner">
          <p>
            Patternwise teaches {PATTERNS.length} patterns that cover a large
            share of common interview problems. Lessons, worked examples, and
            runnable problems, all on your device. The catalog does not cover
            trees, graphs, heaps, backtracking, intervals, or 2D DP yet. Problem
            statements link out to LeetCode.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
