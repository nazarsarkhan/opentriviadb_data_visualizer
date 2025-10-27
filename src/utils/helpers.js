export const DIFFICULTY_ORDER = ["easy", "medium", "hard"];

export const DIFF_COLORS = Object.freeze({
  easy: "#22c55e",
  medium: "#eab308",
  hard: "#ef4444",
});

export async function fetcher(url, { timeout = 10000, ...opts } = {}) {
  const res = await fetch(url, { ...opts, signal: AbortSignal.timeout(timeout) });
  if (!res.ok) throw new Error(`Request failed with ${res.status}`);
  return res.json();
}

export function groupByCategory(data = []) {
  const counts = new Map();
  for (const item of data) {
    const cat = item?.category;
    if (!cat) continue;
    counts.set(cat, (counts.get(cat) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function groupByDifficulty(data = [], order = DIFFICULTY_ORDER) {
  const counts = Object.fromEntries(order.map((d) => [d, 0]));
  for (const item of data) {
    const key = String(item?.difficulty ?? "").toLowerCase();
    if (key in counts) counts[key] += 1;
  }
  return order.map((key) => ({
    key,
    name: key[0].toUpperCase() + key.slice(1),
    value: counts[key],
  }));
}
