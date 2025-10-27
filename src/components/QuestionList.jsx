import { useState, memo } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/QuestionList.module.css";

const DIFF_CLASS = {
  easy: `${styles.pill} ${styles.pillEasy}`,
  medium: `${styles.pill} ${styles.pillMedium}`,
  hard: `${styles.pill} ${styles.pillHard}`,
};

function QuestionList({ items = [], categoryLabel, onResetFilter, pageSize = 10 }) {
  const [showAll, setShowAll] = useState(false);
  const hasQuestions = items.length > 0;

  if (!hasQuestions) {
    return (
      <section className="card" aria-label="Questions list">
        <h2>Questions ({categoryLabel})</h2>
        <p className="muted">No questions available for this category.</p>
        {onResetFilter && (
          <button className="btn" type="button" onClick={onResetFilter}>
            Reset filter
          </button>
        )}
      </section>
    );
  }

  const hasMore = items.length > pageSize;
  const visibleItems = showAll ? items : items.slice(0, pageSize);

  return (
    <section className="card" aria-label="Questions list">
      <h2>
        Questions ({categoryLabel}) — {visibleItems.length} of {items.length}
      </h2>

      <ul className={styles.list}>
        {visibleItems.map(({ question, difficulty }, i) => (
          <li key={`${question}-${i}`} className={styles.item}>
            <span className={DIFF_CLASS[difficulty] ?? styles.pill}>{difficulty}</span>
            <span className={styles.q}>{question}</span>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className={styles.actions}>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
          >
            {showAll ? `Show first ${pageSize}` : `Show all (${items.length})`}
          </button>
        </div>
      )}
    </section>
  );
}

QuestionList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string,
      difficulty: PropTypes.string,
      question: PropTypes.string,
    })
  ),
  categoryLabel: PropTypes.string,
  onResetFilter: PropTypes.func,
  pageSize: PropTypes.number,
};

export default (QuestionList);
