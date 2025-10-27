import { memo, useMemo } from "react";
import PropTypes from "prop-types";
import styles from "../../../styles/DifficultyPieChart.module.css";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { DIFF_COLORS } from "../../utils/helpers.js";

const ORDER = ["easy", "medium", "hard"];

function DifficultyPieChart({
  data = [],
  selectedCategory = "All",
  ariaLabel = "Difficulty distribution",
  chartHeight = 260,
  legendRowHeight = 24,
  titleLines = 2,
  titleLineHeight = 1.25,
}) {
  const normalized = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data
      .map((d) => ({
        key: String(d.key ?? d.name ?? "").toLowerCase(),
        name: d.name ?? String(d.key ?? "").replace(/^./, (c) => c.toUpperCase()),
        value: Number(d.value) || 0,
      }))
      .filter((d) => d.value > 0)
      .sort((a, b) => ORDER.indexOf(a.key) - ORDER.indexOf(b.key));
  }, [data]);

  const hasData = normalized.length > 0;
  const renderData = hasData ? normalized : [{ key: "none", name: "No data", value: 1 }];
  const titleMinBlockSize = `calc(${titleLines} * ${titleLineHeight}em)`;

  return (
    <div className="card" aria-label={ariaLabel}>
      <h2 className={styles.title} style={{ lineHeight: titleLineHeight, minBlockSize: titleMinBlockSize }}>
        Difficulty distribution {selectedCategory === "All" ? "(all categories)" : `(${selectedCategory})`}
      </h2>

      <div className={styles.chartWrapper}>
        <div className={styles.chart} style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%" role="img" aria-label={ariaLabel}>
            <PieChart margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
              <Pie
                data={renderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                isAnimationActive={false}
                labelLine={false}
                label={false}
                stroke="none"
              >
                {renderData.map((entry) => (
                  <Cell
                    key={entry.key}
                    fill={
                      DIFF_COLORS[entry.key] ??
                      DIFF_COLORS[entry.name.toLowerCase()] ??
                      "rgba(255,255,255,0.25)"
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, name) => [`${Math.round(v)}`, name]}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 8,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.18)",
                }}
                itemStyle={{ color: "#fff", fontWeight: 600 }}
                labelStyle={{ color: "#fff", fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.inlineLabels} style={{ height: legendRowHeight }}>
          {hasData ? (
            normalized.map((item) => {
              const color =
                DIFF_COLORS[item.key] ??
                DIFF_COLORS[item.name.toLowerCase()] ??
                "rgba(255,255,255,0.45)";
              return (
                <span key={item.key} className={styles.inlineLabel}>
                  <span className={styles.swatch} style={{ background: color }} />
                  <span className={styles.labelText}>{item.name}: {item.value}</span>
                </span>
              );
            })
          ) : (
            <span className={styles.inlineLabel}>
              <span className={styles.swatch} />
              <span className={styles.labelText}>No data</span>
            </span>
          )}
        </div>
      </div>

      <p className="muted">
        {hasData ? "This chart respects the active category filter." : "No difficulty data available for this selection."}
      </p>
    </div>
  );
}

DifficultyPieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      name: PropTypes.string,
      value: PropTypes.number,
    })
  ),
  selectedCategory: PropTypes.string,
  ariaLabel: PropTypes.string,
  chartHeight: PropTypes.number,
  legendRowHeight: PropTypes.number,
  titleLines: PropTypes.number,
  titleLineHeight: PropTypes.number,
};

export default (DifficultyPieChart);
