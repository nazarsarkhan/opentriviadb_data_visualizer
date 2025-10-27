import { useState } from "react";

export const ALL_CATEGORY = "All";

export function useFilters(initial = { category: ALL_CATEGORY, difficulty: "All", query: "" }) {
  const [filters, setFilters] = useState(initial);

  const setCategory = (v) => setFilters((f) => ({ ...f, category: v }));
  const reset = () => setFilters(initial);

  const isAllCategory = filters.category === ALL_CATEGORY;

  return { filters, setCategory, reset, isAllCategory };
}
