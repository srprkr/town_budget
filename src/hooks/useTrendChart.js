import { useEffect } from 'react';
import * as d3 from 'd3';
import { TREND_YEARS } from '../data/trends';

const MARGIN = { top: 50, right: 40, bottom: 100, left: 85 };
const W = 800;
const H = 400;
const IW = W - MARGIN.left - MARGIN.right;
const IH = H - MARGIN.top - MARGIN.bottom;

// Years labeled "Actual*" (year-end projections, not final audit figures)
const YEAR_SUBS = { 2025: 'Actual*' };

const fmtValue = v => {
  if (v >= 1e6) return `$${+(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `$${+(v / 1e3).toFixed(1)}K`;
  return `$${v.toLocaleString()}`;
};

const fmtAxis = v => {
  if (v === 0) return '$0';
  if (v >= 1e6) return `$${+(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${+(v / 1e3).toFixed(0)}K`;
  return `$${v}`;
};

export function useTrendChart({ svgRef, values }) {
  useEffect(() => {
    if (!values || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    const xScale = d3.scalePoint()
      .domain(TREND_YEARS)
      .range([0, IW])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(values) * 1.2])
      .range([IH, 0])
      .nice();

    // Gridlines
    g.append('g')
      .call(
        d3.axisLeft(yScale).tickSize(-IW).tickFormat('').ticks(5)
      )
      .call(sel => {
        sel.select('.domain').remove();
        sel.selectAll('line').attr('stroke', 'var(--border)').attr('stroke-dasharray', '4,4');
      });

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(fmtAxis))
      .call(sel => {
        sel.select('.domain').remove();
        sel.selectAll('line').remove();
        sel.selectAll('text').attr('fill', 'var(--text-muted, #888)').attr('font-size', '12px');
      });

    const pts = TREND_YEARS.map((yr, i) => ({
      yr,
      v: values[i],
      x: xScale(yr),
      y: yScale(values[i]),
    }));

    const line = d3.line().x(d => d.x).y(d => d.y);
    const area = d3.area().x(d => d.x).y0(IH).y1(d => d.y);

    // All points except last = historical (solid); last two = planned (dashed)
    const solidPts = pts.slice(0, pts.length - 1);
    const dashedPts = pts.slice(pts.length - 2);

    // Shaded fill under historical segment
    g.append('path')
      .datum(solidPts)
      .attr('d', area)
      .attr('fill', 'var(--accent)')
      .attr('opacity', 0.08);

    // Solid line: historical
    g.append('path')
      .datum(solidPts)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 2.5)
      .attr('stroke-linecap', 'round');

    // Dashed line: planned (last segment only)
    g.append('path')
      .datum(dashedPts)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '6,5')
      .attr('stroke-linecap', 'round');

    // Pct change labels on each segment midpoint
    const changes = pts.slice(1).map((pt, i) => ({
      x: (pts[i].x + pt.x) / 2,
      y: (pts[i].y + pt.y) / 2,
      pct: (pt.v - pts[i].v) / pts[i].v,
    }));
    g.selectAll('.chg')
      .data(changes)
      .enter()
      .append('text')
      .attr('class', 'chg')
      .attr('x', d => d.x)
      .attr('y', d => d.y - 12)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-muted, #888)')
      .attr('font-size', '11px')
      .text(d => (d.pct >= 0 ? '+' : '') + (d.pct * 100).toFixed(1) + '%');

    // Dots
    g.selectAll('.dot')
      .data(pts)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 5)
      .attr('fill', 'var(--accent)')
      .attr('stroke', 'var(--bg)')
      .attr('stroke-width', 2.5);

    // Value labels above dots
    g.selectAll('.val-lbl')
      .data(pts)
      .enter()
      .append('text')
      .attr('class', 'val-lbl')
      .attr('x', d => d.x)
      .attr('y', d => d.y - 14)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text)')
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .text(d => fmtValue(d.v));

    // X-axis labels
    const xMeta = TREND_YEARS.map(yr => ({ yr, sub: YEAR_SUBS[yr] ?? 'Budget' }));
    const xG = g.selectAll('.x-lbl')
      .data(xMeta)
      .enter()
      .append('g')
      .attr('class', 'x-lbl')
      .attr('transform', d => `translate(${xScale(d.yr)},${IH + 18})`);

    xG.append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text)')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text(d => d.yr);

    xG.append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-muted, #888)')
      .attr('font-size', '11px')
      .attr('dy', '1.4em')
      .text(d => d.sub);

    // Legend
    const lgG = g.append('g').attr('transform', `translate(${IW - 160},${IH + 58})`);

    lgG.append('line')
      .attr('x1', 0).attr('x2', 22).attr('y1', 0).attr('y2', 0)
      .attr('stroke', 'var(--accent)').attr('stroke-width', 2.5).attr('stroke-linecap', 'round');
    lgG.append('text').attr('x', 28).attr('y', 4)
      .attr('fill', 'var(--text-muted, #888)').attr('font-size', '11px').text('Historical');

    lgG.append('line')
      .attr('x1', 88).attr('x2', 110).attr('y1', 0).attr('y2', 0)
      .attr('stroke', 'var(--accent)').attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '6,5').attr('stroke-linecap', 'round');
    lgG.append('text').attr('x', 116).attr('y', 4)
      .attr('fill', 'var(--text-muted, #888)').attr('font-size', '11px').text('Planned');

    // Footnote
    g.append('text')
      .attr('x', 0)
      .attr('y', IH + 82)
      .attr('fill', 'var(--text-muted, #888)')
      .attr('font-size', '10px')
      .attr('font-style', 'italic')
      .text('* 2025 figures are year-end projections from the 2026 budget document');

  }, [values]);
}
