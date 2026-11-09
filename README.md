# Patternwise — Learn LeetCode by Pattern

Stop solving random problems. Learn the six moves that solve most of them.

**Patternwise** is an interactive LeetCode tutoring app built around *patterns*,
not grinding. Pick a pattern, read a guided lesson with a worked example, then
solve real LeetCode problems in that pattern with hints that unlock one at a
time, and run your code in the browser against real test cases.

## The concept

Most LeetCode problems are variations on a small set of patterns. Once you
recognize the pattern, the solution shape follows. Patternwise teaches the
pattern first, then makes you practice it:

1. **Learn the pattern.** A short lesson: the core idea, when it applies, and
   the template to reach for.
2. **Watch it work.** A worked example walks through a real problem step by
   step, with code.
3. **Solve, with hints.** Problems run in your browser against real test
   cases. Hints unlock progressively (three per problem), so the answer is
   never just handed to you.
4. **Master the pattern.** Solving every problem in a pattern marks it
   mastered. Progress is tracked per pattern and saved in localStorage.

## Patterns (6) and problems (24)

| Pattern | Problems |
| --- | --- |
| Two Pointers | Two Sum II (167), Valid Palindrome (125), Container With Most Water (11), 3Sum (15) |
| Sliding Window | Maximum Average Subarray I (643), Longest Substring Without Repeating Characters (3), Permutation in String (567), Minimum Window Substring (76) |
| Binary Search | Binary Search (704), Search in Rotated Sorted Array (33), Find Minimum in Rotated Sorted Array (153), Koko Eating Bananas (875) |
| Hash Map | Two Sum (1), Group Anagrams (49), Top K Frequent Elements (347), Longest Consecutive Sequence (128) |
| Stack | Valid Parentheses (20), Daily Temperatures (739), Evaluate Reverse Polish Notation (150), Decode String (394) |
| Dynamic Programming | Climbing Stairs (70), House Robber (198), Coin Change (322), Longest Increasing Subsequence (300) |

Every problem links out to its LeetCode page, and every problem's test cases
were verified against reference solutions.

## Run it

```bash
cd frontend
npm install
npm start        # dev server at http://localhost:3000
npm run build    # production build in frontend/build
npm test         # smoke test
```

No account, no backend, no keys. Progress and editor code are stored in
`localStorage` on the user's device.

## Layout

```
frontend/
  src/
    data/patterns.js        # the curriculum: 6 patterns, lessons, 24 problems
    lib/progress.js         # localStorage progress store
    lib/runner.js           # in-browser test runner for user solutions
    components/
      Dashboard.js          # home: stats + pattern cards
      PatternView.js        # lesson + worked example + problem list
      ProblemView.js        # problem, hints, editor, test results
    App.js                  # shell + navigation
    index.css               # design system
backend/                    # original Express stub, kept for reference;
                            # the app is fully client-side and does not use it
```

## Adding a pattern or problem

Add an entry to `PATTERNS` in `frontend/src/data/patterns.js`: a lesson
(`idea`, `whenToUse`, `template`), a `workedExample`, and problems with
`hints` (3), `starterCode`, `functionName`, and `testCases`. Verify new test
cases against a reference solution before shipping; a wrong expected value
teaches the wrong thing.
