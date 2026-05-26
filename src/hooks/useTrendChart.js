import { useEffect } from 'react';
import * as d3 from 'd3';
import { TREND_YEARS } from '../data/trends';
import { fmtValue, fmtAxis } from '../utils/format';

const MARGIN = { top: 50, right: 40, bottom: 100, left: 85 };
const W = 800;
const H = 400;
const IW = W - MARGIN.left - MARGIN.right;
const IH = H - MARGIN.top - MARGIN.bottom;

const GREEN = '#22c55e';
const RED   = '#ef4444';

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
    const uid = `tc${Math.random().toString(36).slice(2, 7)}`;

    // Clip that constrains content to the horizontal plot bounds
    defs.append('clipPath').attr('id', `${uid}p`)
      .append('rect').attr('x', 0).attr('y', -MARGIN.top).attr('width', IW).attr('height', H);

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    const xScale = d3.scalePoint()
      .domain(TREND_YEARS)
      .range([0, IW])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([hasNegative ? minVal * 1.2 : 0, maxVal * 1.2])
      .range([IH, 0])
      .nice();

    // Clips for above/below zero in balance charts — defined after yScale so .nice() is applied
    let zeroYVal;
    if (hasNegative) {
      zeroYVal = yScale(0);
      defs.append('clipPath').attr('id', `${uid}a`)
        .append('rect').attr('x', -IW).attr('y', 0).attr('width', IW * 3).attr('height', zeroYVal);
      defs.append('clipPath').attr('id', `${uid}b`)
        .append('rect').attr('x', -IW).attr('y', zeroYVal).attr('width', IW * 3).attr('height', IH - zeroYVal + 1);
    }

    // Static: gridlines
    g.append('g')
      .call(d3.axisLeft(yScale).tickSize(-IW).tickFormat('').ticks(5))
      .call(sel => {
        sel.select('.domain').remove();
        sel.selectAll('line').attr('stroke', 'var(--border)').attr('stroke-dasharray', '4,4');
      });

    // Static: Y axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(fmtAxis))
      .call(sel => {
        sel.select('.domain').remove();
        sel.selectAll('line').remove();
        sel.selectAll('text').attr('fill', 'var(--text-muted, #888)').attr('font-size', '12px');
      });

    // Dynamic: everything x-position-dependent lives here (clipped horizontally)
    const plot = g.append('g').attr('clip-path', `url(#${uid}p)`);

    // Static: legend
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
      lgG.append('line').attr('x1', 0).attr('x2', 22).attr('y1', 0).attr('y2', 0)
        .attr('stroke', 'var(--accent)').attr('stroke-width', 2.5).attr('stroke-linecap', 'round');
      lgG.append('text').attr('x', 28).attr('y', 4)
        .attr('fill', 'var(--text-muted, #888)').attr('font-size', '11px').text('Historical');
      lgG.append('line').attr('x1', 88).attr('x2', 110).attr('y1', 0).attr('y2', 0)
        .attr('stroke', 'var(--accent)').attr('stroke-width', 2.5)
        .attr('stroke-dasharray', '6,5').attr('stroke-linecap', 'round');
      lgG.append('text').attr('x', 116).attr('y', 4)
        .attr('fill', 'var(--text-muted, #888)').attr('font-size', '11px').text('Planned');
    }

    function drawPlot(xS) {
      plot.selectAll('*').remove();

      const pts = TREND_YEARS.map((yr, i) => {
        const v = actuals[yr] ?? values[i];
        if (v == null) return null;
        return { yr, v, x: xS(yr), y: yScale(v), isActual: yr in actuals };
      }).filter(Boolean);

      const solidPts  = pts.filter(d => d.yr <= 2024);
      const dashedPts = pts.filter(d => d.yr >= 2024);
      const line = d3.line().x(d => d.x).y(d => d.y);

      if (hasNegative) {
        plot.append('line')
          .attr('x1', xS(TREND_YEARS[0]) - 40).attr('x2', xS(TREND_YEARS[TREND_YEARS.length - 1]) + 40)
          .attr('y1', zeroYVal).attr('y2', zeroYVal)
          .attr('stroke', 'var(--text-muted, #888)').attr('stroke-width', 1)
          .attr('stroke-dasharray', '4,3');

        const baseArea = d3.area().x(d => d.x).y0(zeroYVal).y1(d => d.y);

        [[`${uid}a`, GREEN], [`${uid}b`, RED]].forEach(([clipId, color]) => {
          plot.append('path').datum(solidPts)
            .attr('d', baseArea).attr('fill', color).attr('opacity', 0.12)
            .attr('clip-path', `url(#${clipId})`);
          plot.append('path').datum(solidPts)
            .attr('d', line).attr('fill', 'none').attr('stroke', color)
            .attr('stroke-width', 2.5).attr('stroke-linecap', 'round')
            .attr('clip-path', `url(#${clipId})`);
          plot.append('path').datum(dashedPts)
            .attr('d', line).attr('fill', 'none').attr('stroke', color)
            .attr('stroke-width', 2.5).attr('stroke-dasharray', '6,5').attr('stroke-linecap', 'round')
            .attr('clip-path', `url(#${clipId})`);
        });
      } else {
        const area = d3.area().x(d => d.x).y0(IH).y1(d => d.y);
        plot.append('path').datum(solidPts).attr('d', area)
          .attr('fill', 'var(--accent)').attr('opacity', 0.08);
        plot.append('path').datum(solidPts).attr('d', line)
          .attr('fill', 'none').attr('stroke', 'var(--accent)')
          .attr('stroke-width', 2.5).attr('stroke-linecap', 'round');
        plot.append('path').datum(dashedPts).attr('d', line)
          .attr('fill', 'none').attr('stroke', 'var(--accent)')
          .attr('stroke-width', 2.5).attr('stroke-dasharray', '6,5').attr('stroke-linecap', 'round');
      }

      if (!hasNegative) {
        const changes = pts.slice(1).map((pt, i) => ({
          x: (pts[i].x + pt.x) / 2,
          y: (pts[i].y + pt.y) / 2,
          pct: (pt.v - pts[i].v) / pts[i].v,
        }));
        plot.selectAll('.chg')
          .data(changes).enter().append('text')
          .attr('class', 'chg')
          .attr('x', d => d.x).attr('y', d => d.y - 12)
          .attr('text-anchor', 'middle')
          .attr('fill', 'var(--text-muted, #888)').attr('font-size', '11px')
          .text(d => (d.pct >= 0 ? '+' : '') + (d.pct * 100).toFixed(1) + '%');
      }

      plot.selectAll('.dot')
        .data(pts).enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => d.x).attr('cy', d => d.y).attr('r', 5)
        .attr('fill', hasNegative ? d => (d.v >= 0 ? GREEN : RED) : 'var(--accent)')
        .attr('stroke', 'var(--bg)').attr('stroke-width', 2.5);

      plot.selectAll('.val-lbl')
        .data(pts).enter().append('text')
        .attr('class', 'val-lbl')
        .attr('x', d => d.x).attr('y', d => d.y - 14)
        .attr('text-anchor', 'middle')
        .attr('fill', hasNegative ? d => (d.v >= 0 ? GREEN : RED) : 'var(--text)')
        .attr('font-size', '13px').attr('font-weight', '600')
        .text(d => fmtValue(d.v));

      const xMeta = TREND_YEARS.map(yr => ({ yr, sub: YEAR_SUBS[yr] ?? 'Budget' }));
      const xG = plot.selectAll('.x-lbl')
        .data(xMeta).enter().append('g')
        .attr('class', 'x-lbl')
        .attr('transform', d => `translate(${xS(d.yr)},${IH + 18})`);

      xG.append('text')
        .attr('text-anchor', 'middle').attr('fill', 'var(--text)')
        .attr('font-size', '14px').attr('font-weight', '600').text(d => d.yr);

      xG.append('text')
        .attr('text-anchor', 'middle').attr('fill', 'var(--text-muted, #888)')
        .attr('font-size', '11px').attr('dy', '1.4em').text(d => d.sub);
    }

    drawPlot(xScale);

    // Invisible overlay rect captures zoom/pan events inside the plot area
    const overlay = g.append('rect')
      .attr('width', IW).attr('height', IH)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .style('cursor', 'grab');

    const zoomBehavior = d3.zoom()
      .scaleExtent([1, 6])
      .filter(event =>
        event.type === 'wheel' ||
        (event.touches?.length >= 2) ||
        (event.type !== 'touchstart' && event.type !== 'touchmove' && event.type !== 'touchend')
      )
      .on('zoom', event => {
        const t = event.transform;
        const x0 = xScale(TREND_YEARS[0]);
        const xN = xScale(TREND_YEARS[TREND_YEARS.length - 1]);

        // Pan limits: keep years at or beyond their natural k=1 positions.
        // txLo/txHi are always ordered (xN > x0, 1-k <= 0) so no min/max needed.
        const txLo = xN * (1 - t.k);
        const txHi = x0 * (1 - t.k);
        const tx   = Math.max(txLo, Math.min(txHi, t.x));

        if (tx !== t.x) overlay.node().__zoom = d3.zoomIdentity.translate(tx, 0).scale(t.k);

        drawPlot(xScale.copy().range([tx, tx + IW * t.k]));
        overlay.style('cursor', t.k > 1 ? 'grabbing' : 'grab');
      });

    overlay.call(zoomBehavior);
    overlay.on('dblclick.zoom', () => {
      overlay.transition().duration(500).call(zoomBehavior.transform, d3.zoomIdentity);
    });

  }, [values, actuals]);
}
