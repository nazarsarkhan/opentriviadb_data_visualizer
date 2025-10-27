import { fetcher } from "../../utils/helpers.js";

export async function fetchQuizQuestions(amount = 50, category, signal) {
  const params = new URLSearchParams({ amount, encode: "url3986" });
  if (category) params.append("category", category);

  const data = await fetcher(`https://opentdb.com/api.php?${params}`, { signal });

  const safeDecode = (s) => {
    try {
      return decodeURIComponent(s || "");
    } catch {
      return s || "";
    }
  };

  const results = (data?.results ?? []).map((r) => ({
    ...r,
    category: safeDecode(r.category),
    question: safeDecode(r.question),
  }));

  return { ...data, results };
}