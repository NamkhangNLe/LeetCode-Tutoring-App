import React, { useEffect } from 'react';
import { patternMastery, masteryLabel, markLessonRead } from '../lib/progress';

const DIFF_CLASS = {
  Easy: 'pill-easy',
  Medium: 'pill-medium',
  Hard: 'pill-hard',
};

export default function PatternView({ pattern, progress, onProgressChange, onOpenProblem, onBack }) {
  const m = patternMastery(progress, pattern);

  useEffect(() => {
    if (!progress.lessonsRead[pattern.id]) {
      onProgressChange(markLessonRead(progress, pattern.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern.id]);

  return (
    <div className="pattern-view">
      <button className="back-link" onClick={onBack}>
        ← All patterns
      </button>

      <header className="pattern-header">
        <p className="eyebrow">{pattern.tagline}</p>
        <h1>{pattern.name}</h1>
        <p className="pattern-summary-large">{pattern.summary}</p>
        <div className="mastery-row large">
          <div className="mastery-bar">
            <div className="mastery-fill" style={{ width: `${m.pct}%` }} />
          </div>
          <span className="mastery-text">
            {m.solved}/{m.total} solved
            {m.assisted > 0 ? ` · ${m.unassisted} unassisted, ${m.assisted} with help` : ''} ·{' '}
            {masteryLabel(m.pct)}
          </span>
        </div>
      </header>

      <section className="lesson-section">
        <h2>The idea</h2>
        {pattern.lesson.idea.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </section>

      <section className="lesson-section">
        <h2>When to use it</h2>
        <ul className="check-list">
          {pattern.lesson.whenToUse.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="lesson-section">
        <h2>The template</h2>
        <pre className="code-block">
          <code>{pattern.lesson.template}</code>
        </pre>
      </section>

      <section className="lesson-section worked">
        <h2>{pattern.workedExample.title}</h2>
        <p className="worked-problem">{pattern.workedExample.problem}</p>
        <ol className="steps">
          {pattern.workedExample.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        <pre className="code-block">
          <code>{pattern.workedExample.code}</code>
        </pre>
      </section>

      <section className="lesson-section">
        <h2>Problems in this pattern</h2>
        <p className="section-sub">
          Solve them in the browser. Hints unlock one at a time, and your code is
          checked against real test cases.
        </p>
        <div className="problem-list">
          {pattern.problems.map((prob) => {
            const solved = !!progress.solved[prob.key];
            const assisted = !!progress.solved[prob.key]?.assisted;
            const hintsUsed = progress.solved[prob.key]?.hintsUsed || 0;
            return (
              <button
                key={prob.key}
                className={`problem-row ${solved ? 'solved' : ''}`}
                onClick={() => onOpenProblem(prob.key)}
              >
                <span className={`solve-check ${solved ? 'on' : ''}`}>
                  {solved ? '✓' : ''}
                </span>
                <span className="problem-num">LC {prob.number}</span>
                <span className="problem-title">{prob.title}</span>
                <span className={`pill ${DIFF_CLASS[prob.difficulty]}`}>{prob.difficulty}</span>
                {solved && assisted && (
                  <span className="hints-note">solved with help</span>
                )}
                {solved && !assisted && hintsUsed > 0 && (
                  <span className="hints-note">
                    {hintsUsed} hint{hintsUsed === 1 ? '' : 's'} used
                  </span>
                )}
                <span className="problem-arrow">→</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
