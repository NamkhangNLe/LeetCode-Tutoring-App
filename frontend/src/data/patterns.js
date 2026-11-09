// Pattern library: the curriculum of Patternwise.
// Each pattern has a guided lesson, a worked example, and a set of
// real LeetCode problems. Problems are runnable in-browser: the user
// writes a JS function and it is checked against the test cases.

export const PATTERNS = [
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    tagline: 'Two indices, one pass.',
    difficulty: 'Easy to start',
    summary:
      'When the input is sorted (or can be ordered), put one pointer at each end and shrink the interval based on what you see. Sortedness lets you eliminate a whole half of the search space with a single comparison.',
    lesson: {
      idea: [
        'A brute-force pair search is O(n^2) because every element is compared with every other. Sorting buys structure: once the array is ordered, the smallest and largest values sit at the ends.',
        'Two pointers exploit that structure. Compare the pair at the ends, and move the pointer that cannot be part of the answer. Each step discards at least one element, so the whole scan is O(n) after an O(n log n) sort.',
        'The same shape appears with two pointers moving in the same direction (fast/slow), for example when removing duplicates or partitioning in place.',
      ],
      whenToUse: [
        'The input is sorted, or sorting it does not change the answer.',
        'You are looking for a pair, triplet, or subarray that satisfies a condition on a sum or a comparison.',
        'You need an in-place O(1)-space pass over an array.',
      ],
      template: `// Opposite ends: the classic pair search
let left = 0, right = nums.length - 1;
while (left < right) {
  const sum = nums[left] + nums[right];
  if (sum === target) return [left, right];
  if (sum < target) left++;   // need a bigger value
  else right--;               // need a smaller value
}

// Same direction: fast/slow
let slow = 0;
for (let fast = 0; fast < nums.length; fast++) {
  if (keep(nums[fast])) nums[slow++] = nums[fast];
}`,
    },
    workedExample: {
      title: 'Worked example: Two Sum II (LC 167)',
      problem:
        'The array is sorted. Find two numbers that add to target and return their 1-based positions.',
      steps: [
        'Start with left at the smallest value and right at the largest. Their sum is either the target, too small, or too big.',
        'If the sum is too small, the left value can never work with any value to its right that is smaller than the current right, so move left up. If the sum is too big, move right down.',
        'On [2, 7, 11, 15], target 9: 2 + 15 = 17, too big, so right moves to 11. 2 + 11 = 13, still too big, right moves to 7. 2 + 7 = 9. Done in 3 steps, not 6 pairs.',
        'The insight to remember: each comparison eliminates one pointer position forever. That is why the scan is linear.',
      ],
      code: `function twoSum(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}`,
    },
    problems: [
      {
        key: 'two-pointers-167',
        number: 167,
        title: 'Two Sum II - Input Array Is Sorted',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
        prompt:
          'Given a 1-indexed array of integers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target. Return the 1-based indices of the two numbers.',
        hints: [
          'The array is sorted. What do the two ends tell you about the sum?',
          'If numbers[left] + numbers[right] is smaller than the target, which pointer can move without ever missing the answer?',
          'You only need O(1) extra space. One pass with two pointers is enough.',
        ],
        hiddenTestCases: [
          { args: [[1, 2, 3, 4, 4, 9, 56, 90], 8], expected: [4, 5] },
          { args: [[-5, -3, 0, 1, 4, 7], -8], expected: [1, 2] },
          { args: [[1, 2], 3], expected: [1, 2] },
        ],
        solution: `function twoSum(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}`,
        complexity: 'Time O(n), space O(1). One pass over the already-sorted array; only two pointers are stored.',
        approach:
          'Left at 0, right at the end. While left < right, compare the sum to the target and move the pointer that cannot be part of any solution. Return 1-based indices.',
        functionName: 'twoSum',
        starterCode: `function twoSum(numbers, target) {
  // return the 1-based indices of the two numbers
}`,
        testCases: [
          { args: [[2, 7, 11, 15], 9], expected: [1, 2] },
          { args: [[2, 3, 4], 6], expected: [1, 3] },
          { args: [[-1, 0], -1], expected: [1, 2] },
        ],
      },
      {
        key: 'two-pointers-125',
        number: 125,
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/valid-palindrome/',
        prompt:
          'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.',
        hints: [
          'Compare the first and last characters that matter, then move inward.',
          'You need a helper to decide whether a character is alphanumeric, and you need to skip the rest.',
          'Lowercase as you go so the comparison is uniform.',
        ],
        hiddenTestCases: [
          { args: [''], expected: true },
          { args: ['0P'], expected: false },
          { args: ['ab@a'], expected: true },
        ],
        solution: `function isPalindrome(s) {
  const isAlnum = (c) => /[a-z0-9]/i.test(c);
  let left = 0, right = s.length - 1;
  while (left < right) {
    while (left < right && !isAlnum(s[left])) left++;
    while (left < right && !isAlnum(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}`,
        complexity: 'Time O(n), space O(1). Two pointers converge from the ends; non-alphanumeric characters are skipped in place.',
        approach:
          'Two pointers from both ends. Skip non-alphanumeric characters, compare lowercase characters, move inward. Any mismatch returns false.',
        functionName: 'isPalindrome',
        starterCode: `function isPalindrome(s) {
  // return true if s is a palindrome, ignoring case
  // and non-alphanumeric characters
}`,
        testCases: [
          { args: ['A man, a plan, a canal: Panama'], expected: true },
          { args: ['race a car'], expected: false },
          { args: [' '], expected: true },
        ],
      },
      {
        key: 'two-pointers-11',
        number: 11,
        title: 'Container With Most Water',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/container-with-most-water/',
        prompt:
          'Given n vertical lines at positions 0..n-1 with heights height[i], find two lines that together with the x-axis form a container holding the most water. Return the maximum area.',
        hints: [
          'Area is width times the shorter of the two lines. Which dimension can you improve by moving a pointer?',
          'Start wide: left at 0, right at the end. You already have the maximum possible width.',
          'Moving the taller line inward can never increase the area, because the height is capped by the shorter line and the width only shrinks. So always move the shorter line.',
        ],
        hiddenTestCases: [
          { args: [[1, 2, 1]], expected: 2 },
          { args: [[2, 3, 4, 5, 18, 17, 6]], expected: 17 },
          { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]], expected: 25 },
        ],
        solution: `function maxArea(height) {
  let left = 0, right = height.length - 1, best = 0;
  while (left < right) {
    const area = (right - left) * Math.min(height[left], height[right]);
    best = Math.max(best, area);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return best;
}`,
        complexity: 'Time O(n), space O(1). Start at maximum width and always move the shorter line inward; the shorter line is the bottleneck.',
        approach:
          'Track the max area while moving the shorter of the two lines inward. The shorter line is the bottleneck, so discarding it is always safe.',
        functionName: 'maxArea',
        starterCode: `function maxArea(height) {
  // return the maximum area of water the container can hold
}`,
        testCases: [
          { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
          { args: [[1, 1]], expected: 1 },
          { args: [[4, 3, 2, 1, 4]], expected: 16 },
        ],
      },
      {
        key: 'two-pointers-15',
        number: 15,
        title: '3Sum',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/3sum/',
        prompt:
          'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. The solution set must not contain duplicate triplets.',
        hints: [
          'Sort first. Then fix one element and the problem becomes Two Sum on the rest.',
          'With the array sorted, the two-sum part is a two-pointer scan. That turns O(n^3) into O(n^2).',
          'Duplicates are the trap: skip equal values for the fixed element and for both pointers after finding a triplet.',
        ],
        hiddenTestCases: [
          { args: [[-2, 0, 1, 1, 2]], expected: [[-2, 0, 2], [-2, 1, 1]] },
          { args: [[1, 2, 3]], expected: [] },
          { args: [[-1, 0, 1, 2, -1, -4, -2, -3, 3, 0, 4]], expected: [[-4, 0, 4], [-4, 1, 3], [-3, -1, 4], [-3, 0, 3], [-3, 1, 2], [-2, -1, 3], [-2, 0, 2], [-1, -1, 2], [-1, 0, 1]] },
        ],
        solution: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        out.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return out;
}`,
        complexity: 'Time O(n^2) after an O(n log n) sort, space O(1) besides the output. Fix one element, two-pointer scan the rest, and skip duplicates at every level.',
        approach:
          'Sort the array. For each index i, two-pointer scan the suffix for a pair summing to -nums[i], skipping duplicates at every level.',
        functionName: 'threeSum',
        starterCode: `function threeSum(nums) {
  // return all unique triplets that sum to 0
}`,
        unordered: true,
        testCases: [
          { args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
          { args: [[0, 1, 1]], expected: [] },
          { args: [[0, 0, 0]], expected: [[0, 0, 0]] },
        ],
      },
    ],
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    tagline: 'A window that grows and shrinks.',
    difficulty: 'Easy to start',
    summary:
      'Keep a window [left, right] and a running summary of what is inside it. Expand the right edge, and whenever the window breaks the rule, shrink the left edge until it is valid again. Every element enters and leaves once: O(n).',
    lesson: {
      idea: [
        'Many subarray problems ask for the longest, shortest, or best window satisfying a condition. The naive approach re-examines every subarray: O(n^2).',
        'A sliding window never re-examines anything. The right pointer only moves forward, the left pointer only moves forward, and a running summary (a sum, a count map, a frequency table) is updated incrementally.',
        'The key question for every window problem is: when the window becomes invalid, what do I do? Shrink from the left until it is valid again. That single rule covers most of the pattern.',
      ],
      whenToUse: [
        'The problem asks about a contiguous subarray or substring.',
        'There is a constraint on the window: at most K distinct characters, sum below a target, no repeats.',
        'A brute-force O(n^2) check of every subarray would work but is too slow.',
      ],
      template: `// Variable-size window: longest valid subarray
let left = 0;
const freq = new Map();
for (let right = 0; right < s.length; right++) {
  add(s[right]);
  while (!isValid()) {
    remove(s[left]);
    left++;
  }
  best = Math.max(best, right - left + 1);
}

// Fixed-size window: best window of size k
let sum = 0;
for (let i = 0; i < nums.length; i++) {
  sum += nums[i];
  if (i >= k) sum -= nums[i - k];
  if (i >= k - 1) best = Math.max(best, sum);
}`,
    },
    workedExample: {
      title: 'Worked example: Longest Substring Without Repeating Characters (LC 3)',
      problem:
        'Given a string, find the length of the longest substring without repeating characters.',
      steps: [
        'Expand right one character at a time, tracking the last index where each character was seen.',
        'On "abcabcbb": the window grows a, ab, abc. At the second a (index 3), the window is invalid because a is already inside it.',
        'Instead of restarting, jump left past the previous a: left moves to 4. The window is now "bca" and the scan continues. Nothing is ever re-scanned.',
        'The answer is the largest window size seen: 3. The whole string is processed in a single pass.',
      ],
      code: `function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= left) {
      left = lastSeen.get(ch) + 1; // jump past the repeat
    }
    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
    },
    problems: [
      {
        key: 'sliding-window-643',
        number: 643,
        title: 'Maximum Average Subarray I',
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/maximum-average-subarray-i/',
        prompt:
          'Given an integer array nums of length n and an integer k, find the contiguous subarray of length k with the maximum average value and return that value.',
        hints: [
          'The window size is fixed at k, so this is the simpler fixed-size variant.',
          'You do not need to re-sum each window from scratch. What changes when the window slides by one?',
          'Add the incoming element, subtract the outgoing one, and track the best sum.',
        ],
        hiddenTestCases: [
          { args: [[-1], 1], expected: -1 },
          { args: [[0, 0, 0, 0], 2], expected: 0 },
          { args: [[7, 4, 5, 8, 8, 3, 9, 8, 7, 6], 3], expected: 8 },
        ],
        solution: `function findMaxAverage(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    best = Math.max(best, sum);
  }
  return best / k;
}`,
        complexity: 'Time O(n), space O(1). Fixed-size window: slide by adding the incoming element and subtracting the outgoing one.',
        approach:
          'Running sum over a fixed window of size k: slide by adding nums[i] and subtracting nums[i-k], tracking the maximum sum, then divide by k.',
        functionName: 'findMaxAverage',
        starterCode: `function findMaxAverage(nums, k) {
  // return the maximum average of any subarray of length k
}`,
        testCases: [
          { args: [[1, 12, -5, -6, 50, 3], 4], expected: 12.75 },
          { args: [[5], 1], expected: 5 },
          { args: [[0, 1, 1, 3, 3], 4], expected: 2 },
        ],
      },
      {
        key: 'sliding-window-3',
        number: 3,
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        prompt:
          'Given a string s, find the length of the longest substring without repeating characters.',
        hints: [
          'The window must contain no duplicate characters. When a repeat appears, what has to happen to the left edge?',
          'A map from character to its last index lets you jump the left edge instead of creeping it forward one by one.',
          'Only jump left forward, never backward: left = max(left, lastIndex + 1).',
        ],
        hiddenTestCases: [
          { args: [''], expected: 0 },
          { args: ['dvdf'], expected: 3 },
          { args: ['anviaj'], expected: 5 },
        ],
        solution: `function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= left) {
      left = lastSeen.get(ch) + 1;
    }
    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
        complexity: 'Time O(n), space O(min(n, alphabet)). Each character is visited once; the left edge only jumps forward past repeats.',
        approach:
          'Expand right, remembering each character\'s last index. On a repeat inside the window, jump left past the previous occurrence. Track the max window size.',
        functionName: 'lengthOfLongestSubstring',
        starterCode: `function lengthOfLongestSubstring(s) {
  // return the length of the longest substring
  // without repeating characters
}`,
        testCases: [
          { args: ['abcabcbb'], expected: 3 },
          { args: ['bbbbb'], expected: 1 },
          { args: ['pwwkew'], expected: 3 },
        ],
      },
      {
        key: 'sliding-window-567',
        number: 567,
        title: 'Permutation in String',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/permutation-in-string/',
        prompt:
          'Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise. A permutation is a rearrangement of all the characters of s1.',
        hints: [
          'A permutation of s1 is just a window of length s1.length with exactly the same character counts.',
          'Count the characters of s1 once, then slide a fixed-size window over s2 and compare counts.',
          'Comparing two 26-length count arrays at every step is fine, or keep a "matches" counter and update it incrementally.',
        ],
        hiddenTestCases: [
          { args: ['ab', 'ab'], expected: true },
          { args: ['abcd', 'abc'], expected: false },
          { args: ['abc', 'bbbca'], expected: true },
        ],
        solution: `function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;
  const counts = new Array(26).fill(0);
  const a = 'a'.charCodeAt(0);
  for (const ch of s1) counts[ch.charCodeAt(0) - a]++;
  for (let i = 0; i < s2.length; i++) {
    counts[s2.charCodeAt(i) - a]--;
    if (i >= s1.length) counts[s2.charCodeAt(i - s1.length) - a]++;
    if (i >= s1.length - 1 && counts.every((c) => c === 0)) return true;
  }
  return false;
}`,
        complexity: 'Time O(n), space O(1). Fixed-size window with 26 letter counts; the window matches when every count is back to zero.',
        approach:
          'Fixed-size window of length s1.length over s2 with frequency counts. The window is a match when its counts equal s1\'s counts.',
        functionName: 'checkInclusion',
        starterCode: `function checkInclusion(s1, s2) {
  // return true if s2 contains a permutation of s1
}`,
        testCases: [
          { args: ['ab', 'eidbaooo'], expected: true },
          { args: ['ab', 'eidboaoo'], expected: false },
          { args: ['adc', 'dcda'], expected: true },
        ],
      },
      {
        key: 'sliding-window-76',
        number: 76,
        title: 'Minimum Window Substring',
        difficulty: 'Hard',
        url: 'https://leetcode.com/problems/minimum-window-substring/',
        prompt:
          'Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string.',
        hints: [
          'This is a variable-size window: expand right until the window contains all of t, then shrink left while it still does.',
          'Track how many distinct characters are satisfied, not the whole string. A "formed" counter keeps the check O(1).',
          'Record the best window every time you shrink, before the window stops being valid.',
        ],
        hiddenTestCases: [
          { args: ['aa', 'aa'], expected: 'aa' },
          { args: ['bba', 'ab'], expected: 'ba' },
          { args: ['abc', 'cba'], expected: 'abc' },
        ],
        solution: `function minWindow(s, t) {
  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);
  let missing = t.length, left = 0, best = '';
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (need.has(ch)) {
      if (need.get(ch) > 0) missing--;
      need.set(ch, need.get(ch) - 1);
    }
    while (missing === 0) {
      if (!best || right - left + 1 < best.length) best = s.slice(left, right + 1);
      const out = s[left];
      if (need.has(out)) {
        need.set(out, need.get(out) + 1);
        if (need.get(out) > 0) missing++;
      }
      left++;
    }
  }
  return best;
}`,
        complexity: 'Time O(|s| + |t|), space O(1) for the alphabet-sized count map. Expand until all of t is covered, then shrink while it stays covered.',
        approach:
          'Count the characters t needs. Expand right, counting matches; once all are covered, shrink left as far as possible while staying valid, recording the smallest window seen.',
        functionName: 'minWindow',
        starterCode: `function minWindow(s, t) {
  // return the minimum window substring of s
  // containing all characters of t
}`,
        testCases: [
          { args: ['ADOBECODEBANC', 'ABC'], expected: 'BANC' },
          { args: ['a', 'a'], expected: 'a' },
          { args: ['a', 'aa'], expected: '' },
        ],
      },
    ],
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    tagline: 'Halve the search space.',
    difficulty: 'Easy to start',
    summary:
      'On a sorted array, check the middle and discard half. The real power of the pattern is that it works on any monotonic predicate: if a value works, every larger value works too, so you can binary-search the answer itself.',
    lesson: {
      idea: [
        'Linear search asks "is it here?" n times. Binary search asks "is it in this half?" and discards half the candidates with each answer. That turns O(n) into O(log n).',
        'The pattern only needs one thing: a way to look at a midpoint and decide which side the answer is on. Sorted arrays give that for free, but so do many other problems.',
        'The most useful generalization is "binary search on the answer": when you can test whether a candidate answer is feasible in O(n), and feasibility is monotonic, the smallest feasible answer is a binary search away.',
      ],
      whenToUse: [
        'The input is sorted, or rotated in a way that still has order in one half.',
        'You need the first or last position where some condition becomes true.',
        'You can phrase the problem as "find the smallest X such that feasible(X)" and feasibility is monotonic.',
      ],
      template: `// Classic search
let lo = 0, hi = nums.length - 1;
while (lo <= hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (nums[mid] === target) return mid;
  if (nums[mid] < target) lo = mid + 1;
  else hi = mid - 1;
}
return -1;

// Lower bound: first index with nums[i] >= target
let lo = 0, hi = nums.length;
while (lo < hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (nums[mid] < target) lo = mid + 1;
  else hi = mid;
}
return lo;`,
    },
    workedExample: {
      title: 'Worked example: Find Minimum in Rotated Sorted Array (LC 153)',
      problem:
        'A sorted array was rotated at an unknown pivot. Find its minimum element.',
      steps: [
        'In a rotated array, one half is always sorted. Compare nums[mid] with nums[hi]: if nums[mid] > nums[hi], the minimum is in the right half, because the drop (the pivot) must be to the right of mid.',
        'Otherwise the minimum is at mid or to its left, so move hi to mid.',
        'On [4, 5, 6, 7, 0, 1, 2]: mid is 7, which is greater than hi (2), so the answer is right of mid. The window becomes [0, 1, 2].',
        'The loop ends when lo and hi meet. That element is the minimum, found in O(log n) without ever seeing the pivot directly.',
      ],
      code: `function findMin(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}`,
    },
    problems: [
      {
        key: 'binary-search-704',
        number: 704,
        title: 'Binary Search',
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/binary-search/',
        prompt:
          'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.',
        hints: [
          'Compare the target with the middle element. What does the comparison tell you about where the target can be?',
          'The classic loop condition is lo <= hi. What happens if you use lo < hi instead?',
          'Use Math.floor((lo + hi) / 2) for the midpoint.',
        ],
        hiddenTestCases: [
          { args: [[-1, 0, 3, 5, 9, 12], 12], expected: 5 },
          { args: [[5], -5], expected: -1 },
          { args: [[1, 2, 3, 4, 5, 6, 7, 8], 8], expected: 7 },
        ],
        solution: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
        complexity: 'Time O(log n), space O(1). Each comparison discards half of the remaining search space.',
        approach:
          'Classic binary search: while lo <= hi, check mid. If nums[mid] is the target return it; otherwise discard the half that cannot contain it.',
        functionName: 'search',
        starterCode: `function search(nums, target) {
  // return the index of target, or -1 if absent
}`,
        testCases: [
          { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
          { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
          { args: [[5], 5], expected: 0 },
        ],
      },
      {
        key: 'binary-search-33',
        number: 33,
        title: 'Search in Rotated Sorted Array',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
        prompt:
          'There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k. Given the array nums after the rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums. You must write an algorithm with O(log n) runtime complexity.',
        hints: [
          'At every midpoint, one half of the array is sorted. Figure out which half that is first.',
          'If the left half is sorted (nums[lo] <= nums[mid]), the target is in it exactly when it lies between nums[lo] and nums[mid].',
          'Otherwise the right half is sorted, and the same range check applies there.',
        ],
        hiddenTestCases: [
          { args: [[1, 3], 3], expected: 1 },
          { args: [[3, 1], 1], expected: 1 },
          { args: [[5, 1, 3], 3], expected: 2 },
        ],
        solution: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
        complexity: 'Time O(log n), space O(1). At every midpoint one half is sorted; check whether the target falls inside that half and discard the other.',
        approach:
          'At each step, identify the sorted half and check whether the target falls inside its range. Discard the other half. O(log n).',
        functionName: 'search',
        starterCode: `function search(nums, target) {
  // return the index of target in the rotated array,
  // or -1 if absent
}`,
        testCases: [
          { args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
          { args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
          { args: [[1], 0], expected: -1 },
        ],
      },
      {
        key: 'binary-search-153',
        number: 153,
        title: 'Find Minimum in Rotated Sorted Array',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
        prompt:
          'Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums of unique elements, return the minimum element of this array.',
        hints: [
          'Compare the middle element with the rightmost element. What does nums[mid] > nums[hi] tell you?',
          'If nums[mid] is greater than nums[hi], the pivot (and the minimum) must be to the right of mid.',
          'Otherwise the minimum is at mid or to its left, so hi can move to mid.',
        ],
        hiddenTestCases: [
          { args: [[1, 2, 3, 4, 5]], expected: 1 },
          { args: [[2, 1]], expected: 1 },
          { args: [[5, 1, 2, 3, 4]], expected: 1 },
        ],
        solution: `function findMin(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}`,
        complexity: 'Time O(log n), space O(1). Comparing mid with hi tells you which half holds the pivot; the loop ends on the minimum.',
        approach:
          'Binary search on the pivot: while lo < hi, if nums[mid] > nums[hi] move lo to mid + 1, else move hi to mid. Return nums[lo].',
        functionName: 'findMin',
        starterCode: `function findMin(nums) {
  // return the minimum element of the rotated array
}`,
        testCases: [
          { args: [[3, 4, 5, 1, 2]], expected: 1 },
          { args: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 },
          { args: [[11, 13, 15, 17]], expected: 11 },
        ],
      },
      {
        key: 'binary-search-875',
        number: 875,
        title: 'Koko Eating Bananas',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/koko-eating-bananas/',
        prompt:
          'Koko loves to eat bananas. There are n piles of bananas, the ith pile has piles[i] bananas. The guards have gone and will come back in h hours. Koko can decide her bananas-per-hour eating speed k. Each hour, she chooses some pile and eats k bananas from that pile. If the pile has less than k bananas, she eats all of them and will not eat any more bananas during this hour. Return the minimum integer k such that she can eat all the bananas within h hours.',
        hints: [
          'This is binary search on the answer: the speed k is what you are searching for, not an array index.',
          'If Koko can finish at speed k, she can finish at any faster speed. Feasibility is monotonic, so binary search applies.',
          'For a candidate speed, the hours needed are the sum of ceil(pile / speed) over all piles.',
        ],
        hiddenTestCases: [
          { args: [[1, 1, 1, 1], 4], expected: 1 },
          { args: [[1000000000], 2], expected: 500000000 },
          { args: [[312884470], 968709470], expected: 1 },
        ],
        solution: `function minEatingSpeed(piles, h) {
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let hours = 0;
    for (const p of piles) hours += Math.ceil(p / mid);
    if (hours <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
        complexity: 'Time O(n log m) where m is the largest pile, space O(1). Binary search on the answer: feasibility (finishing in h hours) is monotonic in speed.',
        approach:
          'Binary search k in [1, max(piles)]. For each candidate, compute total hours as the sum of ceil(pile / k); if it fits in h, try slower, otherwise faster.',
        functionName: 'minEatingSpeed',
        starterCode: `function minEatingSpeed(piles, h) {
  // return the minimum eating speed that finishes
  // all piles within h hours
}`,
        testCases: [
          { args: [[3, 6, 7, 11], 8], expected: 4 },
          { args: [[30, 11, 23, 4, 20], 5], expected: 30 },
          { args: [[30, 11, 23, 4, 20], 6], expected: 23 },
        ],
      },
    ],
  },
  {
    id: 'hash-map',
    name: 'Hash Map',
    tagline: 'Trade space for time.',
    difficulty: 'Easy to start',
    summary:
      'A map turns an O(n) lookup into O(1). Store what you have seen, and check what you need. Frequency counting, grouping by a key, and complement lookups are all the same move.',
    lesson: {
      idea: [
        'Most "find the pair" or "count the occurrences" problems are slow because finding something costs a scan. A hash map pays a little memory to make every lookup instant.',
        'The canonical move is the complement check: for each element x, ask the map whether the thing you need (target - x, a matching key, a previous prefix) has been seen. If yes, you are done; if no, store x and continue.',
        'Grouping is the same idea in reverse: instead of looking something up, use a computed key (a sorted string, a count signature) so that equal items land in the same bucket.',
      ],
      whenToUse: [
        'You need to know whether you have seen a value before, or how many times.',
        'You are matching pairs, complements, or anagrams.',
        'You need to group items by some property of the item itself.',
      ],
      template: `// Complement lookup (Two Sum)
const seen = new Map();
for (let i = 0; i < nums.length; i++) {
  const need = target - nums[i];
  if (seen.has(need)) return [seen.get(need), i];
  seen.set(nums[i], i);
}

// Frequency counting
const freq = new Map();
for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1);

// Grouping by key
const groups = new Map();
for (const s of strs) {
  const key = [...s].sort().join('');
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(s);
}`,
    },
    workedExample: {
      title: 'Worked example: Two Sum (LC 1)',
      problem:
        'Given an array, return the indices of the two numbers that add up to a target.',
      steps: [
        'The naive approach checks every pair: O(n^2). The map approach checks each element once.',
        'Walk the array left to right. For each value, compute what you need: need = target - value.',
        'On [2, 7, 11, 15], target 9: at 2, need is 7. Not seen, so store 2 at index 0. At 7, need is 2, which is in the map at index 0. Return [0, 1].',
        'The map holds the past; the current element asks the past a question. That is the whole pattern.',
      ],
      code: `function twoSum(nums, target) {
  const seen = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [-1, -1];
}`,
    },
    problems: [
      {
        key: 'hash-map-1',
        number: 1,
        title: 'Two Sum',
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/two-sum/',
        prompt:
          'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
        hints: [
          'For each number, what other number would complete the target?',
          'A map from value to index lets you check for that complement in O(1).',
          'Store each number after checking, so you never reuse the same element.',
        ],
        hiddenTestCases: [
          { args: [[0, 4, 3, 0], 0], expected: [0, 3] },
          { args: [[-3, 4, 3, 90], 0], expected: [0, 2] },
          { args: [[1, 2, 3], 5], expected: [1, 2] },
        ],
        solution: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [-1, -1];
}`,
        complexity: 'Time O(n), space O(n). One pass: for each value, ask the map whether its complement has been seen.',
        approach:
          'Single pass with a map from value to index. For each number, look up target - number; if present, return both indices.',
        functionName: 'twoSum',
        starterCode: `function twoSum(nums, target) {
  // return the indices of the two numbers that add to target
}`,
        testCases: [
          { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
          { args: [[3, 2, 4], 6], expected: [1, 2] },
          { args: [[3, 3], 6], expected: [0, 1] },
        ],
      },
      {
        key: 'hash-map-49',
        number: 49,
        title: 'Group Anagrams',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/group-anagrams/',
        prompt:
          'Given an array of strings strs, group the anagrams together. You can return the answer in any order. An anagram is a word formed by rearranging the letters of a different word.',
        hints: [
          'Anagrams share something identical. What is the same for "eat", "tea", and "ate"?',
          'Sort the letters of each word: anagrams produce the same sorted string. That sorted string is a perfect map key.',
          'Group by that key, then return the groups.',
        ],
        hiddenTestCases: [
          { args: [['a', 'b', 'c']], expected: [['a'], ['b'], ['c']] },
          { args: [['ddddddddddg', 'dgggggggggg']], expected: [['ddddddddddg'], ['dgggggggggg']] },
          { args: [['', 'b', '']], expected: [['', ''], ['b']] },
        ],
        solution: `function groupAnagrams(strs) {
  const groups = new Map();
  for (const s of strs) {
    const key = [...s].sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return [...groups.values()];
}`,
        complexity: 'Time O(n k log k) for n strings of length k, space O(n k). Anagrams share the same sorted form, which is the map key.',
        approach:
          'Use the sorted form of each word as a map key and collect words into groups. Return the map values.',
        functionName: 'groupAnagrams',
        starterCode: `function groupAnagrams(strs) {
  // return the anagrams grouped together
}`,
        unordered: true,
        testCases: [
          { args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']] },
          { args: [['']], expected: [['']] },
          { args: [['a']], expected: [['a']] },
        ],
      },
      {
        key: 'hash-map-347',
        number: 347,
        title: 'Top K Frequent Elements',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/top-k-frequent-elements/',
        prompt:
          'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
        hints: [
          'First, count frequencies. A map gets you there in one pass.',
          'The classic follow-up is bucket sort: an element with frequency f goes into bucket f.',
          'Collect from the highest bucket downward until you have k elements.',
        ],
        hiddenTestCases: [
          { args: [[4, 1, -1, 2, -1, 2, 3], 2], expected: [-1, 2] },
          { args: [[3, 0, 1, 0], 1], expected: [0] },
          { args: [[5, 5, 5, 5], 1], expected: [5] },
        ],
        solution: `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [n, f] of freq) buckets[f].push(n);
  const out = [];
  for (let f = buckets.length - 1; f >= 0 && out.length < k; f--) {
    out.push(...buckets[f]);
  }
  return out.slice(0, k);
}`,
        complexity: 'Time O(n), space O(n). Count frequencies, bucket elements by frequency, then collect from the top bucket down.',
        approach:
          'Count frequencies with a map, bucket elements by frequency, then collect from the top bucket down until k elements are gathered.',
        functionName: 'topKFrequent',
        starterCode: `function topKFrequent(nums, k) {
  // return the k most frequent elements
}`,
        unordered: true,
        testCases: [
          { args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
          { args: [[1], 1], expected: [1] },
          { args: [[1, 2], 2], expected: [1, 2] },
        ],
      },
      {
        key: 'hash-map-128',
        number: 128,
        title: 'Longest Consecutive Sequence',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/longest-consecutive-sequence/',
        prompt:
          'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.',
        hints: [
          'A set gives O(1) membership checks. The trick is knowing where a sequence starts.',
          'A number starts a sequence only if the number before it is NOT in the set.',
          'From each start, walk forward counting consecutive numbers. Each number is visited at most twice overall.',
        ],
        hiddenTestCases: [
          { args: [[1, 2, 0, 1]], expected: 3 },
          { args: [[9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]], expected: 7 },
          { args: [[-2, -1, 0, 1, 2]], expected: 5 },
        ],
        solution: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const n of set) {
    if (set.has(n - 1)) continue;
    let len = 1;
    while (set.has(n + len)) len++;
    best = Math.max(best, len);
  }
  return best;
}`,
        complexity: 'Time O(n), space O(n). Only start counting at a sequence start (no predecessor in the set), so each number is visited at most twice.',
        approach:
          'Put all numbers in a set. For each number that has no predecessor in the set, walk forward counting the run. Track the longest run.',
        functionName: 'longestConsecutive',
        starterCode: `function longestConsecutive(nums) {
  // return the length of the longest consecutive
  // elements sequence
}`,
        testCases: [
          { args: [[100, 4, 200, 1, 3, 2]], expected: 4 },
          { args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
          { args: [[]], expected: 0 },
        ],
      },
    ],
  },
  {
    id: 'stack',
    name: 'Stack',
    tagline: 'Last in, first out.',
    difficulty: 'Medium',
    summary:
      'A stack remembers the most recent unmatched thing. That makes it the right tool for nesting, matching pairs, and "next greater element" problems, where you pop while the current element dominates everything below it.',
    lesson: {
      idea: [
        'Some problems are about the most recent thing that has not been resolved yet: an open bracket waiting for its close, a temperature waiting for a warmer day, an element waiting for a larger one.',
        'A stack is exactly that memory. Push things as you meet them; when the current item resolves the top of the stack, pop and record the answer.',
        'The monotonic stack is the advanced form: keep the stack in increasing (or decreasing) order by popping everything the current element dominates. Each element is pushed and popped at most once, so the whole scan is O(n).',
      ],
      whenToUse: [
        'You are matching pairs: brackets, tags, parentheses.',
        'You need the "next greater" or "next smaller" element for each position.',
        'The problem involves undoing, backtracking, or nested structure.',
      ],
      template: `// Matching pairs
const stack = [];
for (const ch of s) {
  if (isOpen(ch)) stack.push(ch);
  else if (stack.pop() !== match(ch)) return false;
}
return stack.length === 0;

// Monotonic stack: next greater element
const stack = []; // indices, values increasing
for (let i = 0; i < nums.length; i++) {
  while (stack.length && nums[stack.at(-1)] < nums[i]) {
    const j = stack.pop();
    answer[j] = i - j; // nums[i] resolves nums[j]
  }
  stack.push(i);
}`,
    },
    workedExample: {
      title: 'Worked example: Daily Temperatures (LC 739)',
      problem:
        'Given daily temperatures, return for each day how many days you have to wait until a warmer temperature. If there is no future warmer day, 0.',
      steps: [
        'Walk the days left to right, keeping a stack of indices whose warmer day has not been found yet. The stack stays in decreasing temperature order.',
        'On [73, 74, 75, 71, 69, 72, 76, 73]: 73 waits for 74 (1 day). 74 waits for 75 (1 day). 75 waits... 71 and 69 are cooler, so they pile on the stack. Then 72 resolves both 69 (1 day) and 71 (2 days). Then 76 resolves 72 (1 day) and 75 (4 days).',
        'Each index is pushed once and popped once. The answer is the distance between the day and the day that popped it.',
        'The pattern to remember: the stack holds the unresolved past, and the present resolves it.',
      ],
      code: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = []; // indices, decreasing temperatures
  for (let i = 0; i < n; i++) {
    while (stack.length &&
           temperatures[stack.at(-1)] < temperatures[i]) {
      const j = stack.pop();
      answer[j] = i - j;
    }
    stack.push(i);
  }
  return answer;
}`,
    },
    problems: [
      {
        key: 'stack-20',
        number: 20,
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/valid-parentheses/',
        prompt:
          'Given a string s containing just the characters ( ) { } [ ], determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets, and open brackets are closed in the correct order.',
        hints: [
          'An opening bracket is a promise that a matching close will come later. What remembers promises?',
          'When you see a closing bracket, it must match the most recent unmatched opening bracket.',
          'At the end, every promise must be fulfilled: the stack must be empty.',
        ],
        hiddenTestCases: [
          { args: [''], expected: true },
          { args: ['([)]'], expected: false },
          { args: ['{[]}'], expected: true },
        ],
        solution: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
    else if (stack.pop() !== pairs[ch]) return false;
  }
  return stack.length === 0;
}`,
        complexity: 'Time O(n), space O(n). The stack holds unmatched openers; every closer must match the most recent one.',
        approach:
          'Push opening brackets. On a closing bracket, pop and check the type matches. The string is valid if the stack ends empty.',
        functionName: 'isValid',
        starterCode: `function isValid(s) {
  // return true if the brackets are valid
}`,
        testCases: [
          { args: ['()'], expected: true },
          { args: ['()[]{}'], expected: true },
          { args: ['(]'], expected: false },
        ],
      },
      {
        key: 'stack-739',
        number: 739,
        title: 'Daily Temperatures',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/daily-temperatures/',
        prompt:
          'Given an array of integers temperatures representing the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.',
        hints: [
          'For each day, you need the next day with a higher temperature. That is a "next greater element" problem.',
          'Keep a stack of indices waiting for a warmer day. When a hotter day arrives, it resolves every cooler day on top of the stack.',
          'The answer for a resolved day is the distance between the two indices.',
        ],
        hiddenTestCases: [
          { args: [[89, 62, 70, 58, 47, 47, 46, 76, 100, 70]], expected: [8, 1, 5, 4, 3, 2, 1, 1, 0, 0] },
          { args: [[55, 54, 53, 52]], expected: [0, 0, 0, 0] },
          { args: [[1, 2, 3]], expected: [1, 1, 0] },
        ],
        solution: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {
      const j = stack.pop();
      answer[j] = i - j;
    }
    stack.push(i);
  }
  return answer;
}`,
        complexity: 'Time O(n), space O(n). Monotonic decreasing stack of indices waiting for a warmer day; each index is pushed and popped once.',
        approach:
          'Monotonic decreasing stack of indices. For each day, pop all cooler days and record the distance, then push the current day.',
        functionName: 'dailyTemperatures',
        starterCode: `function dailyTemperatures(temperatures) {
  // return, for each day, how many days until a warmer one
}`,
        testCases: [
          { args: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
          { args: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] },
          { args: [[30, 60, 90]], expected: [1, 1, 0] },
        ],
      },
      {
        key: 'stack-150',
        number: 150,
        title: 'Evaluate Reverse Polish Notation',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
        prompt:
          'You are given an array of strings tokens that represents an arithmetic expression in Reverse Polish Notation. Evaluate the expression. Return an integer that represents the value of the expression.',
        hints: [
          'In reverse Polish notation, operators come after their operands. What data structure naturally holds operands until an operator arrives?',
          'When you see a number, push it. When you see an operator, pop two numbers, apply it, and push the result.',
          'Division truncates toward zero. In JS, use Math.trunc(a / b).',
        ],
        hiddenTestCases: [
          { args: [['18']], expected: 18 },
          { args: [['3', '11', '+', '5', '-']], expected: 9 },
          { args: [['4', '3', '-']], expected: 1 },
        ],
        solution: `function evalRPN(tokens) {
  const stack = [];
  for (const t of tokens) {
    if (t === '+' || t === '-' || t === '*' || t === '/') {
      const b = stack.pop(), a = stack.pop();
      if (t === '+') stack.push(a + b);
      else if (t === '-') stack.push(a - b);
      else if (t === '*') stack.push(a * b);
      else stack.push(Math.trunc(a / b));
    } else stack.push(Number(t));
  }
  return stack[0];
}`,
        complexity: 'Time O(n), space O(n). Numbers wait on the stack until an operator arrives; division truncates toward zero.',
        approach:
          'Scan the tokens. Push numbers; on an operator, pop two operands, apply the operator, and push the result. The last value on the stack is the answer.',
        functionName: 'evalRPN',
        starterCode: `function evalRPN(tokens) {
  // evaluate the expression in reverse Polish notation
}`,
        testCases: [
          { args: [['2', '1', '+', '3', '*']], expected: 9 },
          { args: [['4', '13', '5', '/', '+']], expected: 6 },
          { args: [['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']], expected: 22 },
        ],
      },
      {
        key: 'stack-394',
        number: 394,
        title: 'Decode String',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/decode-string/',
        prompt:
          'Given an encoded string, return its decoded string. The encoding rule is: k[encoded_string], where the encoded_string inside the square brackets is being repeated exactly k times. You may assume that the input string is always valid, and that the original data does not contain any digits.',
        hints: [
          'Brackets nest, so this is a stack problem. What do you need to remember when you see a "["?',
          'When you hit "[", push the current count and the string built so far, then start fresh inside the brackets.',
          'When you hit "]", pop the count and the previous string, and append the repeated inner string.',
        ],
        hiddenTestCases: [
          { args: ['abc3[cd]xyz'], expected: 'abccdcdcdxyz' },
          { args: ['100[leetcode]'], expected: 'leetcode'.repeat(100) },
          { args: ['3[b2[ca]]'], expected: 'bcacabcacabcaca' },
        ],
        solution: `function decodeString(s) {
  const stack = [];
  let num = 0, cur = '';
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') num = num * 10 + Number(ch);
    else if (ch === '[') { stack.push([num, cur]); num = 0; cur = ''; }
    else if (ch === ']') {
      const [n, prev] = stack.pop();
      cur = prev + cur.repeat(n);
    } else cur += ch;
  }
  return cur;
}`,
        complexity: 'Time O(n) in the size of the decoded output, space O(n) for the stack. On \'[\' push the count and the string built so far; on \']\' pop and repeat.',
        approach:
          'Two stacks (or one stack of pairs): on "[", push the current count and accumulated string; on "]", pop and repeat the inner string by the count.',
        functionName: 'decodeString',
        starterCode: `function decodeString(s) {
  // return the decoded string
}`,
        testCases: [
          { args: ['3[a]2[bc]'], expected: 'aaabcbc' },
          { args: ['3[a2[c]]'], expected: 'accaccacc' },
          { args: ['2[abc]3[cd]ef'], expected: 'abcabccdcdcdef' },
        ],
      },
    ],
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    tagline: 'Solve it once, reuse the answer.',
    difficulty: 'Hard to start',
    summary:
      'Define dp[i] as the answer for the first i elements, find the recurrence that builds dp[i] from smaller answers, set the base cases, and iterate. If a problem has overlapping subproblems and optimal substructure, DP turns exponential brute force into a table.',
    lesson: {
      idea: [
        'Brute force on these problems re-solves the same subproblem thousands of times. DP notices the repetition and writes each answer down once.',
        'The whole technique is three decisions: what does dp[i] mean, how does dp[i] follow from earlier entries (the recurrence), and what are the base cases.',
        'Start by writing the recurrence in words before touching code. "To climb to step i, I must have come from step i-1 or step i-2" is the entire solution to Climbing Stairs; the code is just bookkeeping.',
      ],
      whenToUse: [
        'The problem asks for a count, a minimum, a maximum, or a yes/no over sequences or choices.',
        'The answer for a large input is built from answers for smaller inputs.',
        'A recursive brute force would re-solve the same states many times.',
      ],
      template: `// 1D DP: dp[i] = answer for the first i elements
const dp = new Array(n + 1).fill(0);
dp[0] = baseCase0;
dp[1] = baseCase1;
for (let i = 2; i <= n; i++) {
  dp[i] = combine(dp[i - 1], dp[i - 2]); // the recurrence
}
return dp[n];

// Space optimization: only the last two states matter
let prev2 = baseCase0, prev1 = baseCase1;
for (let i = 2; i <= n; i++) {
  const cur = combine(prev1, prev2);
  prev2 = prev1;
  prev1 = cur;
}
return prev1;`,
    },
    workedExample: {
      title: 'Worked example: Climbing Stairs (LC 70)',
      problem:
        'You are climbing a staircase of n steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
      steps: [
        'Define dp[i] as the number of ways to reach step i. To stand on step i, you must have come from step i-1 (one step) or step i-2 (two steps).',
        'So dp[i] = dp[i-1] + dp[i-2]. That is the Fibonacci recurrence, and the base cases are dp[0] = 1 (one way to stand still) and dp[1] = 1.',
        'For n = 5: dp = [1, 1, 2, 3, 5, 8]. The answer is 8.',
        'Notice you only ever need the previous two values. The O(n) table collapses to two variables, which is the standard space optimization for 1D DP.',
      ],
      code: `function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1, prev1 = 2; // dp[1], dp[2]
  for (let i = 3; i <= n; i++) {
    const cur = prev1 + prev2;
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
    },
    problems: [
      {
        key: 'dynamic-programming-70',
        number: 70,
        title: 'Climbing Stairs',
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/climbing-stairs/',
        prompt:
          'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
        hints: [
          'To reach step i, where could you have come from?',
          'Define dp[i] as the number of ways to reach step i. Write the recurrence before writing code.',
          'You only need the previous two values, so two variables are enough.',
        ],
        hiddenTestCases: [
          { args: [1], expected: 1 },
          { args: [10], expected: 89 },
          { args: [30], expected: 1346269 },
        ],
        solution: `function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1, prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const cur = prev1 + prev2;
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
        complexity: 'Time O(n), space O(1). dp[i] = dp[i-1] + dp[i-2]; only the previous two values are ever needed.',
        approach:
          'dp[i] = dp[i-1] + dp[i-2] with dp[1] = 1, dp[2] = 2. Iterate up to n keeping only the last two values.',
        functionName: 'climbStairs',
        starterCode: `function climbStairs(n) {
  // return the number of distinct ways to climb n steps
}`,
        testCases: [
          { args: [2], expected: 2 },
          { args: [3], expected: 3 },
          { args: [5], expected: 8 },
        ],
      },
      {
        key: 'dynamic-programming-198',
        number: 198,
        title: 'House Robber',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/house-robber/',
        prompt:
          'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected and will automatically contact the police if two adjacent houses are broken into on the same night. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.',
        hints: [
          'At each house, you have exactly two choices. What are they, and what does each one leave you?',
          'Define dp[i] as the best you can do considering the first i houses.',
          'Robbing house i means you cannot rob i-1, so you add nums[i] to dp[i-2]. Skipping it keeps dp[i-1].',
        ],
        hiddenTestCases: [
          { args: [[0]], expected: 0 },
          { args: [[2, 1]], expected: 2 },
          { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]], expected: 30 },
        ],
        solution: `function rob(nums) {
  let prev2 = 0, prev1 = 0;
  for (const n of nums) {
    const cur = Math.max(prev1, prev2 + n);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
        complexity: 'Time O(n), space O(1). At each house, rob it (prev2 + n) or skip it (prev1); keep the better of the two.',
        approach:
          'dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Iterate with two variables for O(1) space.',
        functionName: 'rob',
        starterCode: `function rob(nums) {
  // return the maximum amount you can rob
  // without robbing adjacent houses
}`,
        testCases: [
          { args: [[1, 2, 3, 1]], expected: 4 },
          { args: [[2, 7, 9, 3, 1]], expected: 12 },
          { args: [[2, 1, 1, 2]], expected: 4 },
        ],
      },
      {
        key: 'dynamic-programming-322',
        number: 322,
        title: 'Coin Change',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/coin-change/',
        prompt:
          'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.',
        hints: [
          'Define dp[a] as the fewest coins needed to make amount a. What is dp[0]?',
          'To make amount a, your last coin is some coin c, and the rest is amount a - c.',
          'If no coin fits, dp[a] stays at infinity. The answer is dp[amount], or -1 if it is still infinity.',
        ],
        hiddenTestCases: [
          { args: [[186, 419, 83, 408], 6249], expected: 20 },
          { args: [[1], 1], expected: 1 },
          { args: [[2, 5, 10], 3], expected: -1 },
        ],
        solution: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
        complexity: 'Time O(amount x coins), space O(amount). dp[a] is the fewest coins for amount a; the last coin is some c, the rest is a - c.',
        approach:
          'dp[a] = 1 + min(dp[a - c]) over all coins c <= a, with dp[0] = 0. Fill the table from 0 to amount.',
        functionName: 'coinChange',
        starterCode: `function coinChange(coins, amount) {
  // return the fewest coins to make amount, or -1
}`,
        testCases: [
          { args: [[1, 2, 5], 11], expected: 3 },
          { args: [[2], 3], expected: -1 },
          { args: [[1], 0], expected: 0 },
        ],
      },
      {
        key: 'dynamic-programming-300',
        number: 300,
        title: 'Longest Increasing Subsequence',
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/longest-increasing-subsequence/',
        prompt:
          'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
        hints: [
          'Define dp[i] as the length of the longest increasing subsequence ending at index i.',
          'For each i, look back at every j < i. If nums[j] < nums[i], you can extend the subsequence ending at j.',
          'The answer is the maximum dp[i] over all i, not necessarily dp[n-1].',
        ],
        hiddenTestCases: [
          { args: [[1, 3, 6, 7, 9, 4, 10, 5, 6]], expected: 6 },
          { args: [[0]], expected: 1 },
          { args: [[1, 2, 3, 4, 5]], expected: 5 },
        ],
        solution: `function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
  const dp = new Array(nums.length).fill(1);
  let best = 1;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
    best = Math.max(best, dp[i]);
  }
  return best;
}`,
        complexity: 'Time O(n^2), space O(n). dp[i] is the longest increasing subsequence ending at i; an O(n log n) patience-sorting solution exists as a follow-up.',
        approach:
          'dp[i] = 1 + max(dp[j]) for all j < i with nums[j] < nums[i]. O(n^2) time, O(n) space. (An O(n log n) patience-sorting solution exists as a follow-up.)',
        functionName: 'lengthOfLIS',
        starterCode: `function lengthOfLIS(nums) {
  // return the length of the longest strictly
  // increasing subsequence
}`,
        testCases: [
          { args: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 },
          { args: [[0, 1, 0, 3, 2, 3]], expected: 4 },
          { args: [[7, 7, 7, 7, 7, 7, 7]], expected: 1 },
        ],
      },
    ],
  },
];


export const ALL_PROBLEMS = PATTERNS.flatMap((p) =>
  p.problems.map((prob) => ({ ...prob, patternId: p.id, patternName: p.name }))
);

export function getPattern(id) {
  return PATTERNS.find((p) => p.id === id);
}

export function getProblem(patternId, problemKey) {
  const pattern = getPattern(patternId);
  if (!pattern) return null;
  const problem = pattern.problems.find((p) => p.key === problemKey);
  return problem ? { ...problem, pattern } : null;
}
