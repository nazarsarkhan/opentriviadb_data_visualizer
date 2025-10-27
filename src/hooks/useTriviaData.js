import { useCallback, useEffect, useState } from "react";
import { fetchQuizQuestions } from "../services/opentdb/index.js";

export function useTriviaData({ amount = 50 } = {}) {
  const [questions, setQuestions] = useState([]);
  const [warning, setWarning] = useState("");
  const [status, setStatus] = useState("loading");
  const loading = status === "loading";

  const load = useCallback(
    async (signal) => {
      setWarning("");
      setStatus("loading");
      try {
        const payload = await fetchQuizQuestions(amount, undefined, signal);
        const results = payload?.results ?? [];
        setQuestions(
          results.map(({ category, difficulty, question }) => ({
            category,
            difficulty,
            question,
          }))
        );
        setStatus("ready");
      } catch (err) {
        if (err?.name === "AbortError") return;
        console.error("Failed to load trivia questions:", err);
        setWarning("Failed to load trivia questions. Please try again.");
        setQuestions([]);
        setStatus("ready");
      }
    },
    [amount]
  );

  const retry = useCallback(() => {
    const ac = new AbortController();
    load(ac.signal);
  }, [load]);

  useEffect(() => {
    const ac = new AbortController();
    load(ac.signal);
    return () => ac.abort();
  }, [load]);

  return { questions, loading, warning, retry, status };
}
