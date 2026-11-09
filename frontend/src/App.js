import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import PatternView from './components/PatternView';
import ProblemView from './components/ProblemView';
import { PATTERNS, getPattern, getProblem } from './data/patterns';
import { loadProgress, saveProgress } from './lib/progress';

function App() {
  const [view, setView] = useState({ name: 'home' });
  const [progress, setProgress] = useState(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

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
          setView({ name: 'problem', patternId: pattern.id, problemKey })
        }
        onBack={() => setView({ name: 'home' })}
      />
    );
  } else if (view.name === 'problem') {
    const found = getProblem(view.patternId, view.problemKey);
    content = (
      <ProblemView
        problem={found}
        progress={progress}
        onProgressChange={handleProgressChange}
        onBack={() => setView({ name: 'pattern', patternId: view.patternId })}
      />
    );
  } else {
    content = (
      <Dashboard progress={progress} onOpenPattern={(id) => setView({ name: 'pattern', patternId: id })} />
    );
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <button className="brand" onClick={() => setView({ name: 'home' })}>
            <span className="brand-mark">▦</span>
            <span className="brand-name">Patternwise</span>
            <span className="brand-sub">LeetCode, taught by pattern</span>
          </button>
          <nav className="header-nav">
            <button onClick={() => setView({ name: 'home' })}>Patterns</button>
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
            Patternwise teaches the {PATTERNS.length} patterns behind most LeetCode
            problems. Lessons, worked examples, and runnable problems, all on your
            device. Problem statements link out to LeetCode.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
