import { useEffect, useMemo, useRef, useState, memo } from "react";
import PropTypes from "prop-types";
import styles from "../../../styles/CategoryBarChart.module.css";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
  ReferenceArea,
  Text,
} from "recharts";

function CategoryBarChart({
  data = [],
  ariaLabel = "Questions by category",
  onSelectCategory,
  limitCompact = Number.POSITIVE_INFINITY,
  compactBreakpoint = 768,
  barColor = "#3b82f6",
  backgroundColor = "rgba(59,130,246,0.12)",
}) {
  const wrapRef = useRef(null);
  const [containerW, setContainerW] = useState(1024);
  const [hoverLabel, setHoverLabel] = useState(null);

  useEffect(() => {
    if (!wrapRef.current || typeof ResizeObserver === "undefined") return;
    let t;
    const ro = new ResizeObserver(([entry]) => {
      clearTimeout(t);
      t = setTimeout(() => setContainerW(entry.contentRect.width), 60);
    });
    ro.observe(wrapRef.current);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, []);

  const isCompact = containerW <= compactBreakpoint;

  const displayData = useMemo(() => {
    const sorted = (Array.isArray(data) ? data : [])
      .filter((d) => d && typeof d.name === "string")
      .map((d) => ({ ...d, value: Number(d.value) || 0 }))
      .sort((a, b) => b.value - a.value);

    return isCompact && Number.isFinite(limitCompact) && sorted.length > limitCompact
      ? sorted.slice(0, limitCompact)
      : sorted;
  }, [data, isCompact, limitCompact]);

  const isTruncated = useMemo(
    () => isCompact && Number.isFinite(limitCompact) && data.length > displayData.length,
    [isCompact, limitCompact, data.length, displayData.length]
  );

  const cfg = useMemo(
    () => ({
      titleFont: isCompact ? 18 : 22,
      axisFont: isCompact ? 12 : 13,
      barSize: isCompact ? 22 : 16,
      barHeight: isCompact ? 48 : 36,
      minHeight: isCompact ? 360 : 320,
    }),
    [isCompact]
  );

  const maxValue = useMemo(
    () => Math.max(0, ...displayData.map((d) => d.value)),
    [displayData]
  );

  const axisWidth = useMemo(() => {
    const share = isCompact ? 0.5 : 0.42;
    const min = 150;
    const max = Math.floor(containerW * 0.6);
    return Math.min(Math.max(min, Math.floor(containerW * share)), max);
  }, [containerW, isCompact]);

  const tickPadding = isCompact ? 10 : 14;

  const chartHeight = useMemo(
    () => Math.max(cfg.minHeight, displayData.length * cfg.barHeight + 56),
    [cfg.minHeight, cfg.barHeight, displayData.length]
  );

  const Tick = (props) => {
    const { y, payload } = props;
    const label = payload?.value ?? "";
    const click = () => onSelectCategory?.(label);
    return (
      <g transform={`translate(0, ${y})`} className={styles.pointer} onClick={click}>
        <Text
          x={axisWidth - tickPadding}
          y={0}
          width={axisWidth - tickPadding}
          textAnchor="end"
          verticalAnchor="middle"
          fontSize={cfg.axisFont}
          fontWeight={600}
          fill="var(--text)"
          breakAll={false}
        >
          {label}
        </Text>
      </g>
    );
  };

  return (
    <div className="card" aria-label={ariaLabel}>
      <h2 style={{ fontSize: cfg.titleFont, marginBottom: 8 }}>Questions by category</h2>

      <div ref={wrapRef} className={styles.chart} style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%" role="img" aria-label={ariaLabel}>
          <BarChart
            data={displayData}
            layout="vertical"
            margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
            barCategoryGap={isCompact ? 26 : 16}
            barSize={cfg.barSize}
            onMouseMove={(s) => setHoverLabel(s?.activeLabel ?? null)}
            onMouseLeave={() => setHoverLabel(null)}
            onClick={(s) => {
              const lbl = s?.activeLabel;
              if (lbl) onSelectCategory?.(lbl);
            }}
          >
            {hoverLabel && (
              <ReferenceArea
                className={styles.pointer}
                y1={hoverLabel}
                y2={hoverLabel}
                ifOverflow="extendDomain"
                fill="rgba(59,130,246,0.12)"
                stroke="none"
              />
            )}

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              allowDecimals={false}
              domain={[0, Math.max(5, Math.ceil(maxValue * 1.25))]}
              tick={{ fill: "var(--text)", fontSize: cfg.axisFont, fontWeight: 600 }}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={axisWidth}
              tickMargin={tickPadding}
              tickLine={false}
              interval={0}
              tick={Tick}
            />

            <Bar
              dataKey="value"
              fill={barColor}
              background={{ fill: backgroundColor }}
              radius={[6, 6, 6, 6]}
              isAnimationActive={false}
              className={styles.pointer}
            >
              <LabelList
                dataKey="value"
                position="right"
                offset={10}
                fill="var(--text)"
                fontSize={cfg.axisFont}
              />
            </Bar>

            {!isCompact && (
              <Tooltip
                wrapperStyle={{ maxWidth: "calc(100vw - 24px)", zIndex: 10 }}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  borderRadius: 8,
                  fontWeight: 600,
                }}
                formatter={(v) => [v, "Questions"]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="muted">
        Click a bar to focus on that category.
        {isTruncated && ` Showing top ${limitCompact} categories on mobile.`}
      </p>
    </div>
  );
}

CategoryBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, value: PropTypes.number })),
  ariaLabel: PropTypes.string,
  onSelectCategory: PropTypes.func,
  limitCompact: PropTypes.number,
  compactBreakpoint: PropTypes.number,
  barColor: PropTypes.string,
  backgroundColor: PropTypes.string,
};

export default (CategoryBarChart);
