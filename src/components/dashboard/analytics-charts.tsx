"use client";

import React, { useState, useRef } from "react";

interface ChartDataPoint {
  label: string;
  value: number;
}

interface SVGLineChartProps {
  data: ChartDataPoint[];
  color: string;
  gradientId: string;
  height?: number;
  yAxisLabel?: string;
}

export function SVGLineChart({
  data,
  color,
  gradientId,
  height = 240,
  yAxisLabel = "Candidates",
}: SVGLineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const padding = { top: 20, right: 20, bottom: 35, left: 40 };
  const width = 500;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate scales
  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values, 0);
  const effectiveMaxValue = maxValue === 0 ? 5 : Math.ceil(maxValue * 1.1);

  // Generate grid ticks
  const gridTicks = 4;
  const yTicks = Array.from({ length: gridTicks + 1 }, (_, i) => {
    return Math.round((effectiveMaxValue / gridTicks) * i);
  });

  // Calculate coordinates for path points
  const points = data.map((d, index) => {
    const x = padding.left + (index / (data.length - 1 || 1)) * chartWidth;
    const y =
      height -
      padding.bottom -
      (d.value / (effectiveMaxValue || 1)) * chartHeight;
    return { x, y };
  });

  // Construct line path
  let linePath = "";
  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Use bezier curves or straight lines. Straight lines are cleaner for daily data.
      linePath += ` L ${points[i].x} ${points[i].y}`;
    }
  }

  // Construct filled area path
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x
      } ${height - padding.bottom} Z`
      : "";

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Map client X to data index
    const relativeX = (x / rect.width) * width;
    const chartRelativeX = relativeX - padding.left;
    const step = chartWidth / (data.length - 1 || 1);
    const index = Math.max(
      0,
      min(data.length - 1, Math.round(chartRelativeX / step))
    );

    setHoveredIndex(index);
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  function min(a: number, b: number) {
    return a < b ? a : b;
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        className="overflow-visible select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {yTicks.map((tick, i) => {
          const y = height - padding.bottom - (tick / effectiveMaxValue) * chartHeight;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                fill="rgba(255, 255, 255, 0.4)"
                fontSize="10"
                textAnchor="end"
                className="font-mono"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((d, index) => {
          const x = padding.left + (index / (data.length - 1 || 1)) * chartWidth;
          return (
            <text
              key={index}
              x={x}
              y={height - padding.bottom + 18}
              fill="rgba(255, 255, 255, 0.4)"
              fontSize="9"
              textAnchor="middle"
              className="font-mono"
            >
              {d.label}
            </text>
          );
        })}

        {/* Bottom axis line */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={1}
        />

        {/* Filled area */}
        {areaPath && (
          <path d={areaPath} fill={`url(#${gradientId})`} className="pointer-events-none" />
        )}

        {/* Line path */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={2}
            className="pointer-events-none"
          />
        )}

        {/* Interactivity dots */}
        {points.map((pt, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <g key={idx} className="pointer-events-none">
              {isHovered && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={7}
                  fill={color}
                  opacity={0.3}
                  className="animate-ping"
                />
              )}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 4.5 : 2.5}
                fill={isHovered ? "#ffffff" : color}
                stroke={isHovered ? color : "transparent"}
                strokeWidth={1.5}
                className="transition-all duration-150"
              />
            </g>
          );
        })}
      </svg>

      {/* Floating HTML tooltip */}
      {hoveredIndex !== null && data[hoveredIndex] && (
        <div
          className="absolute pointer-events-none z-20 bg-neutral-950/95 border border-white/10 rounded-xl px-3 py-2 text-[11px] shadow-2xl backdrop-blur-md text-foreground flex flex-col gap-0.5 transition-all duration-75"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y - 10,
            transform: "translate(-50%, -100%)",
          }}
        >
          <span className="font-semibold text-muted-foreground">{data[hoveredIndex].label}</span>
          <span className="text-xs font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            {data[hoveredIndex].value} {yAxisLabel}
          </span>
        </div>
      )}
    </div>
  );
}

interface SVGBarChartProps {
  data: ChartDataPoint[];
  color: string;
  gradientId: string;
  height?: number;
  yAxisLabel?: string;
}

export function SVGBarChart({
  data,
  color,
  gradientId,
  height = 260,
  yAxisLabel = "Candidates",
}: SVGBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const padding = { top: 20, right: 20, bottom: 45, left: 45 };

  // Fixed bar sizing: the gap between bars is always exactly half the bar
  // width, regardless of how many bars there are. This replaces the old
  // approach of deriving bar width from a dynamic "slot" width, which broke
  // down whenever a min-width floor kicked in for small datasets.
  const barWidth = 32;
  const barGap = barWidth / 2; // 16
  const step = barWidth + barGap; // 48 — total horizontal space per bar

  const chartWidth = data.length * step;
  const width = chartWidth + padding.left + padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values, 0);
  const effectiveMaxValue = maxValue === 0 ? 5 : Math.ceil(maxValue * 1.05);

  const gridTicks = 4;
  const yTicks = Array.from({ length: gridTicks + 1 }, (_, i) => {
    return Math.round((effectiveMaxValue / gridTicks) * i);
  });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
      <div className="relative" style={{ minWidth: `${width}px` }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          className="overflow-visible select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {yTicks.map((tick, i) => {
            const y = height - padding.bottom - (tick / effectiveMaxValue) * chartHeight;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />
                <text
                  x={padding.left - 10}
                  y={y + 3}
                  fill="rgba(255, 255, 255, 0.4)"
                  fontSize="10"
                  textAnchor="end"
                  className="font-mono"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, idx) => {
            const x = padding.left + idx * step + step / 2;
            const barX = x - barWidth / 2;
            const barHeight = (item.value / effectiveMaxValue) * chartHeight;
            const barY = height - padding.bottom - barHeight;
            const isHovered = hoveredIndex === idx;

            // Draw rounded-top bar using custom path
            const r = Math.min(4, barHeight); // radius
            const barPath =
              r > 0
                ? `
              M ${barX},${barY + r}
              a ${r},${r} 0 0 1 ${r},-${r}
              h ${barWidth - 2 * r}
              a ${r},${r} 0 0 1 ${r},${r}
              v ${Math.max(0, barHeight - r)}
              h ${-barWidth}
              Z
            `
                : `
              M ${barX},${barY}
              h ${barWidth}
              v ${Math.max(1, barHeight)}
              h ${-barWidth}
              Z
            `;

            return (
              <g key={idx}>
                {/* Visual bar */}
                <path
                  d={barPath}
                  fill={isHovered ? color : `url(#${gradientId})`}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  opacity={isHovered ? 0.95 : 0.85}
                  filter={isHovered ? "drop-shadow(0 0 4px rgba(255, 255, 255, 0.15))" : undefined}
                />

                {/* X-axis label */}
                <text
                  x={x}
                  y={height - padding.bottom + 18}
                  fill={isHovered ? "#ffffff" : "rgba(255, 255, 255, 0.4)"}
                  fontSize="9.5"
                  textAnchor="middle"
                  className="font-sans font-medium transition-colors duration-150"
                >
                  {/* Truncate label if it's too long */}
                  {item.label.length > 9 ? `${item.label.substring(0, 8)}…` : item.label}
                </text>
              </g>
            );
          })}

          {/* Bottom axis line */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={1}
          />
        </svg>

        {/* Floating HTML tooltip */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div
            className="absolute pointer-events-none z-20 bg-neutral-950/95 border border-white/10 rounded-xl px-3 py-2 text-[11px] shadow-2xl backdrop-blur-md text-foreground flex flex-col gap-0.5 transition-all duration-75"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y - 10,
              transform: "translate(-50%, -100%)",
            }}
          >
            <span className="font-semibold text-muted-foreground">{data[hoveredIndex].label}</span>
            <span className="text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              {data[hoveredIndex].value} {yAxisLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
