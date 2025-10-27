import PropTypes from "prop-types";

function CategorySelect({ label = "Category", value, options = [], onChange }) {
  return (
    <div className="toolbar__group">
      <label htmlFor="category-select">{label}:</label>
      <select
        id="category-select"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

CategorySelect.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

export default CategorySelect;
