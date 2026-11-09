import React, { useState } from 'react';
import { PATTERNS, ALL_PROBLEMS } from '../data/patterns';
import { patternMastery, overallStats, masteryLabel } from '../lib/progress';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

const DIFF_CLASS = {
  Easy: 'pill-easy',
  Medium: 'pill-medium',
  Hard: 'pill-hard',
};

function PatternCard({ pattern, progress, onOpen }) {
  const m = patternMastery(progress, pattern);
  const counts = { Easy: 0, Medium: 0, Hard: 0 };
  pattern.problems.forEach((p) => {
    counts[p.difficulty] = (counts[p.difficulty] || 0) + 1;
  });
  return (
    <article className="pattern-card" onClick={onOpen}>
      <div className="pattern-card-top">
        <span className="pattern-index">{String(pattern.number || '').padStart(2, '0')}</span>
        <span className={`mastery-tag ${m.pct === 100 ? 'mastered' : ''}`}>
          {masteryLabel(m.pct)}
        </span>
      </div>
      <h3>{pattern.name}</h3>
      <p className="pattern-tagline">{pattern.tagline}</p>
      <p className="pattern-summary">{pattern.summary}</p>
      <div className="pattern-meta">
        <span>{pattern.problems.length} problems</span>
        <span className="dot-sep">·</span>
        {Object.entries(counts)
          .filter(([, n]) => n > 0)
          .map(([d, n]) => (
            <span key={d} className={`pill ${DIFF_CLASS[d]}`}>
              {n} {d}
            </span>
          ))}
      </div>
      <div className="mastery-row">
        <div className="mastery-bar">
          <div className="mastery-fill" style={{ width: `${m.pct}%` }} />
        </div>
        <span className="mastery-text">
          {m.solved}/{m.total} solved
        </span>
      </div>
      <span className="card-cta">
        {progress.lessonsRead[pattern.id] ? 'Continue pattern' : 'Start lesson'} →
      </span>
    </article>
  );
}

export default function Dashboard({ progress, onOpenPattern, onOpenProblem }) {
  const stats = overallStats(progress, PATTERNS);
  const patterns = PATTERNS.map((p, i) => ({ ...p, number: i + 1 }));
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const q = query.trim().toLowerCase();
  const matches = q || difficulty !== 'All'
    ? ALL_PROBLEMS.filter((p) => {
        if (difficulty !== 'All' && p.difficulty !== difficulty) return false;
        if (!q) return true;
        return (
          p.title.toLowerCase().includes(q) ||
          p.patternName.toLowerCase().includes(q) ||
          String(p.number).includes(q)
        );
      })
    : [];
  return (
    <div className="dashboard">
      <section className="hero">
        <p className="eyebrow">Learn LeetCode by pattern, not by grinding</p>
        <h1>
          Stop solving random problems.
          <br />
          Learn the six moves that solve most of them.
        </h1>
        <p className="hero-sub">
          Each pattern is a guided lesson with a worked example, then real LeetCode
          problems you solve in the browser with hints that unlock one at a time.
          Your progress lives on your device, no account needed.
        </p>
        <div className="stats-row">
          <div className="stat">
            <span className="stat-num">{stats.solvedCount}</span>
            <span className="stat-label">of {stats.totalProblems} problems solved</span>
          </div>
          <div className="stat">
            <span className="stat-num">{stats.mastered}</span>
            <span className="stat-label">of {stats.patterns} patterns mastered</span>
          </div>
          <div className="stat">
            <span className="stat-num">{stats.hintsUsed}</span>
            <span className="stat-label">hints used while solving</span>
          </div>
        </div>
      </section>

      <section className="problem-search">
        <h2>Find a problem</h2>
        <div className="search-row">
          <input
            className="search-input"
            type="search"
            placeholder="Search by title, pattern, or LeetCode number…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search problems"
          />
          <div className="difficulty-filter" role="group" aria-label="Filter by difficulty">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                className={`filter-pill ${difficulty === d ? 'active' : ''}`}
                onClick={() => setDifficulty(d)}
                aria-pressed={difficulty === d}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        {matches.length > 0 && (
          <div className="problem-list search-results">
            {matches.map((prob) => {
              const solved = !!progress.solved[prob.key];
              const assisted = !!progress.solved[prob.key]?.assisted;
              return (
                <button
                  key={prob.key}
                  className={`problem-row ${solved ? 'solved' : ''}`}
                  onClick={() => onOpenProblem(prob.patternId, prob.key)}
                >
                  <span className={`solve-check ${solved ? 'on' : ''}`}>
                    {solved ? '✓' : ''}
                  </span>
                  <span className="problem-num">LC {prob.number}</span>
                  <span className="problem-title">{prob.title}</span>
                  <span className="pill pill-pattern">{prob.patternName}</span>
                  <span className={`pill ${DIFF_CLASS[prob.difficulty]}`}>{prob.difficulty}</span>
                  {solved && assisted && <span className="hints-note">solved with help</span>}
                  <span className="problem-arrow">→</span>
                </button>
              );
            })}
          </div>
        )}
        {(q || difficulty !== 'All') && matches.length === 0 && (
          <p className="section-sub">No problems match that search.</p>
        )}
      </section>

      <section className="pattern-grid">
        {patterns.map((pattern) => (
          <PatternCard
            key={pattern.id}
            pattern={pattern}
            progress={progress}
            onOpen={() => onOpenPattern(pattern.id)}
          />
        ))}
      </section>

      <section className="how-it-works">
        <h2>How it works</h2>
        <ol>
          <li>
            <strong>Learn the pattern.</strong> A short lesson explains the idea, when
            it applies, and the template to reach for.
          </li>
          <li>
            <strong>Watch it work.</strong> A worked example walks through a real
            problem step by step, with code.
          </li>
          <li>
            <strong>Solve, with hints.</strong> Problems run in your browser against
            real test cases. Hints unlock progressively, so the answer is never just
            handed to you.
          </li>
          <li>
            <strong>Master the pattern.</strong> Solving every problem in a pattern
            marks it mastered. Come back any time, your progress is saved locally.
          </li>
        </ol>
      </section>
    </div>
  );
}
