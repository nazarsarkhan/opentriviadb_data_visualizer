import { useMemo } from "react";
import { useTriviaData } from "./hooks/useTriviaData.js";
import { useFilters, ALL_CATEGORY } from "./hooks/useFilters.js";
import { groupByCategory, groupByDifficulty } from "./utils/helpers.js";
import CategoryFilter from "./components/CategoryFilter.jsx";
import QuestionList from "./components/QuestionList.jsx";
import Dashboard from "./components/Dashboard.jsx";
import CategorySelect from "./components/CategorySelect.jsx";

function App() {
  const { questions = [], loading, warning, retry, status } = useTriviaData();
  const { filters, setCategory, reset, isAllCategory } = useFilters();

  const categories = useMemo(() => {
    const unique = new Set(questions.map((q) => q.category));
    return [ALL_CATEGORY, ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [questions]);

  const filtered = useMemo(() => {
    return filters.category === ALL_CATEGORY
      ? questions
      : questions.filter((q) => q.category === filters.category);
  }, [questions, filters.category]);

  const byCategory = useMemo(() => groupByCategory(questions), [questions]);
  const byDifficulty = useMemo(() => groupByDifficulty(filtered), [filtered]);

  const totalAll = questions.length;
  const totalFiltered = filtered.length;

  return (
    <div className="app" aria-busy={loading}>
      <header className="app__header">
        <h1>Trivia Insights</h1>
        <p>
          50-question snapshot from{" "}
          <a href="https://opentdb.com" target="_blank" rel="noreferrer">
            Open Trivia DB
          </a>
          . Use the controls to filter by category and explore difficulty distribution.
        </p>
      </header>

      <div className="sr-only" role="status" aria-live="polite">
        {status === "loading" ? "Loading trivia questions…" : `Loaded ${totalAll} items`}
      </div>

      {warning && (
        <div className="card warning" role="alert">
          <p>{warning}</p>
          <button className="btn btn-primary" onClick={retry}>Retry</button>
        </div>
      )}

      {status === "loading" && (
        <div className="card center">Loading trivia questions…</div>
      )}

      {status === "ready" && (
        <>
          <section className="toolbar card" aria-label="Filters">
            <CategorySelect
              label="Category"
              value={filters.category}
              options={categories}
              onChange={setCategory}
            />
            <div className="toolbar__stats">
              <span className="badge">Total: {totalAll}</span>
              <span className="badge">Filtered: {totalFiltered}</span>
            </div>
          </section>

          {totalFiltered === 0 ? (
            <div className="card center">
              <p>No questions for this selection.</p>
              <button className="btn" onClick={reset}>Show all</button>
            </div>
          ) : (
            <>
              <CategoryFilter
                categories={categories}
                selected={filters.category}
                onChange={setCategory}
                allLabel={ALL_CATEGORY}
              />

              <Dashboard
                byCategory={byCategory}
                byDifficulty={byDifficulty}
                selectedCategory={filters.category}
                onSelectCategory={setCategory}
              />

              <QuestionList
                items={filtered}
                categoryLabel={isAllCategory ? "all categories" : filters.category}
                onResetFilter={reset}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
