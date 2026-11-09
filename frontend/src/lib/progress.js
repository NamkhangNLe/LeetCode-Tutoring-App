// Progress is stored locally (localStorage). No account, no backend:
// the app works fully client-side and progress never leaves the device.

const KEY = 'patternwise-progress-v1';

const EMPTY = {
  solved: {}, // problemKey -> { hintsUsed, solvedAt, ranAt }
  lessonsRead: {}, // patternId -> true
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY, solved: {}, lessonsRead: {} };
    const parsed = JSON.parse(raw);
    return {
      solved: parsed.solved || {},
      lessonsRead: parsed.lessonsRead || {},
    };
  } catch (e) {
    return { ...EMPTY, solved: {}, lessonsRead: {} };
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch (e) {
    // storage full or unavailable: progress just does not persist
  }
}

export function markSolved(progress, problemKey, hintsUsed, assisted = false) {
  return {
    ...progress,
    solved: {
      ...progress.solved,
      [problemKey]: { hintsUsed, solvedAt: Date.now(), assisted: !!assisted },
    },
  };
}

export function unmarkSolved(progress, problemKey) {
  const solved = { ...progress.solved };
  delete solved[problemKey];
  return { ...progress, solved };
}

export function markLessonRead(progress, patternId) {
  return {
    ...progress,
    lessonsRead: { ...progress.lessonsRead, [patternId]: true },
  };
}

export function patternMastery(progress, pattern) {
  const total = pattern.problems.length;
  const solved = pattern.problems.filter((p) => progress.solved[p.key]);
  const unassisted = solved.filter((p) => !progress.solved[p.key].assisted).length;
  return {
    solved: solved.length,
    total,
    unassisted,
    assisted: solved.length - unassisted,
    pct: total === 0 ? 0 : Math.round((solved.length / total) * 100),
  };
}

export function overallStats(progress, patterns) {
  const totalProblems = patterns.reduce((n, p) => n + p.problems.length, 0);
  const solvedCount = Object.keys(progress.solved).length;
  const mastered = patterns.filter((p) => patternMastery(progress, p).pct === 100).length;
  const hintsUsed = Object.values(progress.solved).reduce(
    (n, s) => n + (s.hintsUsed || 0),
    0
  );
  return { totalProblems, solvedCount, mastered, hintsUsed, patterns: patterns.length };
}

export function masteryLabel(pct) {
  if (pct === 100) return 'Mastered';
  if (pct >= 50) return 'Almost there';
  if (pct > 0) return 'Warming up';
  return 'Not started';
}
