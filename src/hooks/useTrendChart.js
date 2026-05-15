import { useEffect } from 'react';
import * as d3 from 'd3';
import { TREND_YEARS } from '../data/trends';

const MARGIN = { top: 50, right: 40, bottom: 100, left: 85 };
const W = 800;
const H = 400;
const IW = W - MARGIN.left - MARGIN.right;
const IH = H - MARGIN.top - MARGIN.bottom;

const GREEN = '#22c55e';
const RED   = '#ef4444';

const fmtValue = v => {
  const abs = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (abs >= 1e6) return `${sign}$${+(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}$${+(abs / 1e3).toFixed(1)}K`;
  return `${sign}$${abs.toLocaleString()}`;
};

const fmtAxis = v => {
  if (v === 0) return '$0';
  const abs = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (abs >= 1e6) return `${sign}$${+(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}$${+(abs / 1e3).toFixed(0)}K`;
  return `${sign}$${abs}`;
};

export function useTrendChart({ svgRef, values, actuals = {} }) {
  useEffect(() => {
    if (!values || !svgRef.current) return;

    const YEAR_SUBS = Object.fromEntries(Object.keys(actuals).map(yr => [+yr, 'Actual']));

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const allVals = [...values.filter(v => v != null), ...Object.values(actuals)];
    const maxVal = d3.max(allVals) ?? 0;
    const minVal = d3.min(allVals) ?? 0;
    const hasNegative = minVal < 0;

    const defs = svg.append('defs');
    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    const xScale = d3.scalePoint()
      .domain(TREND_YEARS)
      .range([0, IW])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([hasNegative ? minVal * 1.2 : 0, maxVal * 1.2])
      .range([IH, 0])
      .nice();

    // Gridlines
    g.append('g')
      .call(d3.axisLeft(yScale).tickSize(-IW).tickFormat('').ticks(5))
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

    const pts = TREND_YEARS.map((yr, i) => {
      const v = actuals[yr] ?? values[i];
      if (v == null) return null;
      return { yr, v, x: xScale(yr), y: yScale(v), isActual: yr in actuals };
    }).filter(Boolean);

    const line = d3.line().x(d => d.x).y(d => d.y);

    const solidPts  = pts.filter(d => d.yr <= 2024);
    const dashedPts = pts.filter(d => d.yr >= 2024);

    if (hasNegative) {
      const zeroY = yScale(0);
      const uid = `tc${Math.random().toString(36).slice(2, 7)}`;

      defs.append('clipPath').attr('id', `${uid}a`)
        .append('rect').attr('x', 0).attr('y', 0).attr('width', IW).attr('height', zeroY);
      defs.append('clipPath').attr('id', `${uid}b`)
        .append('rect').attr('x', 0).attr('y', zeroY).attr('width', IW).attr('height', IH - zeroY + 1);

      // Zero reference line
      g.append('line')
        .attr('x1', 0).attr('x2', IW).attr('y1', zeroY).attr('y2', zeroY)
        .attr('stroke', 'var(--text-muted, #888)').attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,3');

      const baseArea = d3.area().x(d => d.x).y0(zeroY).y1(d => d.y);

      [[`${uid}a`, GREEN], [`${uid}b`, RED]].forEach(([clipId, color]) => {
        g.append('path').datum(solidPts)
          .attr('d', baseArea).attr('fill', color).attr('opacity', 0.12)
          .attr('clip-path', `url(#${clipId})`);

        g.append('path').datum(solidPts)
          .attr('d', line).attr('fill', 'none').attr('stroke', color)
          .attr('stroke-width', 2.5).attr('stroke-linecap', 'round')
          .attr('clip-path', `url(#${clipId})`);

        g.append('path').datum(dashedPts)
          .attr('d', line).attr('fill', 'none').attr('stroke', color)
          .attr('stroke-width', 2.5).attr('stroke-dasharray', '6,5').attr('stroke-linecap', 'round')
          .attr('clip-path', `url(#${clipId})`);
      });
    } else {
      const area = d3.area().x(d => d.x).y0(IH).y1(d => d.y);

      g.append('path').datum(solidPts).attr('d', area)
        .attr('fill', 'var(--accent)').attr('opacity', 0.08);

      g.append('path').datum(solidPts).attr('d', line)
        .attr('fill', 'none').attr('stroke', 'var(--accent)')
        .attr('stroke-width', 2.5).attr('stroke-linecap', 'round');

      g.append('path').datum(dashedPts).attr('d', line)
        .attr('fill', 'none').attr('stroke', 'var(--accent)')
        .attr('stroke-width', 2.5).attr('stroke-dasharray', '6,5').attr('stroke-linecap', 'round');
    }

    // Pct change labels (skip for balance charts — sign changes make % misleading)
    if (!hasNegative) {
      const changes = pts.slice(1).map((pt, i) => ({
        x: (pts[i].x + pt.x) / 2,
        y: (pts[i].y + pt.y) / 2,
        pct: (pt.v - pts[i].v) / pts[i].v,
      }));
      g.selectAll('.chg')
        .data(changes).enter().append('text')
        .attr('class', 'chg')
        .attr('x', d => d.x).attr('y', d => d.y - 12)
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--text-muted, #888)').attr('font-size', '11px')
        .text(d => (d.pct >= 0 ? '+' : '') + (d.pct * 100).toFixed(1) + '%');
    }

    // Dots
    g.selectAll('.dot')
      .data(pts).enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => d.x).attr('cy', d => d.y).attr('r', 5)
      .attr('fill', hasNegative ? d => (d.v >= 0 ? GREEN : RED) : 'var(--accent)')
      .attr('stroke', 'var(--bg)').attr('stroke-width', 2.5);

    // Value labels above dots
    g.selectAll('.val-lbl')
      .data(pts).enter().append('text')
      .attr('class', 'val-lbl')
      .attr('x', d => d.x).attr('y', d => d.y - 14)
      .attr('text-anchor', 'middle')
      .attr('fill', hasNegative ? d => (d.v >= 0 ? GREEN : RED) : 'var(--text)')
      .attr('font-size', '13px').attr('font-weight', '600')
      .text(d => fmtValue(d.v));

    // X-axis labels
    const xMeta = TREND_YEARS.map(yr => ({ yr, sub: YEAR_SUBS[yr] ?? 'Budget' }));
    const xG = g.selectAll('.x-lbl')
      .data(xMeta).enter().append('g')
      .attr('class', 'x-lbl')
      .attr('transform', d => `translate(${xScale(d.yr)},${IH + 18})`);

    xG.append('text')
      .attr('text-anchor', 'middle').attr('fill', 'var(--text)')
      .attr('font-size', '14px').attr('font-weight', '600').text(d => d.yr);

    xG.append('text')
      .attr('text-anchor', 'middle').attr('fill', 'var(--text-muted, #888)')
      .attr('font-size', '11px').attr('dy', '1.4em').text(d => d.sub);

    // Legend
    const lgG = g.append('g').attr('transform', `translate(${IW - 160},${IH + 58})`);

    if (hasNegative) {
      lgG.append('rect').attr('x', 0).attr('y', -5).attr('width', 14).attr('height', 14).attr('rx', 2)
        .attr('fill', GREEN).attr('opacity', 0.75);
      lgG.append('text').attr('x', 20).attr('y', 5)
        .attr('fill', 'var(--text-muted, #888)').attr('font-size', '11px').text('Surplus');

      lgG.append('rect').attr('x', 80).attr('y', -5).attr('width', 14).attr('height', 14).attr('rx', 2)
        .attr('fill', RED).attr('opacity', 0.75);
      lgG.append('text').attr('x', 100).attr('y', 5)
        .attr('fill', 'var(--text-muted, #888)').attr('font-size', '11px').text('Deficit');
    } else {
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
    }

  }, [values, actuals]);
}
