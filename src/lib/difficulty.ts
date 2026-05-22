/**
 * Difficulty inference.
 *
 * Questions in questions.ts are plain strings with no difficulty metadata,
 * so we infer a rating from the topic + keywords. This is a heuristic — good
 * enough to drive the filter, meant to be refined later (e.g. via the admin
 * upload, once questions carry an explicit `difficulty` field).
 */

export type Difficulty = "easy" | "medium" | "hard";

export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  easy: "#10b981",
  medium: "#f59e0b",
  hard: "#ef4444",
};

// rough baseline per topic (0 ≈ easy, 1 ≈ medium, 2 ≈ hard)
const TOPIC_BASE: Record<string, number> = {
  basics: 0,
  arrays: 1,
  strings: 1,
  recursion: 1,
  streams: 1,
  design: 2,
  stack: 1,
};

const HARD_KEYWORDS = [
  "kadane", "dynamic programming", "longest palindrom", "longest substring",
  "longest common", "floyd", "tortoise", "cycle detection",
  "dutch national flag", "0s, 1s, and 2s", "minimize the maximum",
  "tower of hanoi", "power set", "all subsets", "all permutations",
  "permutations of a string", "all permutations of a string",
  "group anagram", "anagram", "maximum product subarray",
  "maximum subarray", "subarray sum", "trapping", "sliding window",
  "isomorphic", "n+1 integers", "rotation of another", "strstr",
  "merge two sorted", "triplet", "leaders in an array",
  "contribution technique", "backspace string", "adjacent duplicates",
];

const EASY_KEYWORDS = [
  "hello, world", "hello world", "even or odd", "leap year",
  "largest of three", "multiplication table", "ascii value",
  "vowel or a consonant", "swap two numbers", "sum, difference",
  "count the number of elements", "find the sum of all elements",
  "find the maximum element", "find the minimum element",
  "convert a list of strings to uppercase", "find the last element",
  "print numbers from 1 to n", "print numbers from n to 1",
];

const cache = new Map<string, Difficulty>();

export function inferDifficulty(topicId: string, text: string): Difficulty {
  const key = `${topicId}::${text}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const t = text.toLowerCase();
  let score = TOPIC_BASE[topicId] ?? 1;
  if (HARD_KEYWORDS.some((k) => t.includes(k))) score += 1.5;
  if (EASY_KEYWORDS.some((k) => t.includes(k))) score -= 1.5;
  if (text.length > 600) score += 0.5; // long, multi-part prompts skew harder

  const result: Difficulty = score <= 0.5 ? "easy" : score >= 1.8 ? "hard" : "medium";
  cache.set(key, result);
  return result;
}
