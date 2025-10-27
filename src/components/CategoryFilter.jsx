import { memo } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/CategoryFilter.module.css";

function CategoryFilter({ categories = [], selected = "All", onChange, allLabel = "All" }) {
  return (
    <section className="card" aria-label="Category quick filter">
      <h2>Categories</h2>
      <div className={styles.wrapper}>
        <button
          type="button"
          className={`${styles.chip} ${selected === allLabel ? styles.active : ""}`}
          onClick={() => onChange?.(allLabel)}
          aria-pressed={selected === allLabel}
        >
          {allLabel}
        </button>

        {categories
          .filter((c) => c && c !== allLabel)
          .map((category) => {
            const active = selected === category;
            return (
              <button
                key={category}
                type="button"
                className={`${styles.chip} ${active ? styles.active : ""}`}
                onClick={() => onChange?.(category)}
                aria-pressed={active}
              >
                <span className={styles.text}>{category}</span>
              </button>
            );
          })}
      </div>
    </section>
  );
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  selected: PropTypes.string,
  onChange: PropTypes.func,
  allLabel: PropTypes.string,
};

export default (CategoryFilter);
