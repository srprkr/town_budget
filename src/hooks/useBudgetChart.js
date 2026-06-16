import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const WIDTH = 900;
const HEIGHT = 700;
const RADIUS = Math.min(WIDTH, HEIGHT) / 2 - 80;
const DRILL_DURATION = 480;
const TWO_PI = Math.PI * 2;
const LONG_PRESS_MS = 400;
const TOOLTIP_HIDE_MS = 2500;
const CENTER_LABEL_MAX = 18;
const ARC_LABEL_MAX = 20;

const EMPTY_DRILL = {};

const BENEFITS_ANOMALY_YEARS = new Set([2022, 2023]);

export function useBudgetChart({ svgRef, data, drillDownData: drillDownProp, onSegmentClick, onDrillIn, onBack, year }) {
  const drillDownData = drillDownProp ?? EMPTY_DRILL;
  const onSegmentClickRef = useRef(onSegmentClick);
  const onDrillInRef = useRef(onDrillIn);
  const onBackRef = useRef(onBack);
  const drillDownDataRef = useRef(drillDownData);
  const yearRef = useRef(year);
  useLayoutEffect(() => {
    onSegmentClickRef.current = onSegmentClick;
    onDrillInRef.current = onDrillIn;
    onBackRef.current = onBack;
    drillDownDataRef.current = drillDownData;
    yearRef.current = year;
  });
  const suppressRedrawRef = useRef(false);
  const drillRef = useRef({ history: [], labelHistory: [], animating: false, drillBack: null, drilledFund: null });
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;
    if (suppressRedrawRef.current) {
      suppressRedrawRef.current = false;
      return;
    }

    const resumeFund = drillRef.current.drilledFund;
    drillRef.current.history = [];
    drillRef.current.labelHistory = [];
    drillRef.current.animating = false;
    drillRef.current.drilledFund = null;
    setBreadcrumb([]);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${WIDTH / 2},${HEIGHT / 2})`);
    const pie = d3.pie().value(d => d.value).sort(null);
    const arc = d3.arc().innerRadius(RADIUS * 0.6).outerRadius(RADIUS);
    const labelArc = d3.arc().innerRadius(RADIUS * 0.78).outerRadius(RADIUS * 0.78);
    const colorScales = [
      d3.scaleOrdinal(d3.schemeCategory10),
      d3.scaleOrdinal(d3.schemeSet2),
    ];

    // Filter out single-finger touch so taps reach click handlers
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .filter(event =>
        event.type === 'wheel' ||
        (event.touches?.length >= 2) ||
        (event.type !== 'touchstart' && event.type !== 'touchmove' && event.type !== 'touchend')
      )
      .on('zoom', event => {
        g.attr('transform', event.transform.translate(WIDTH / 2, HEIGHT / 2));
      });
    svg.call(zoom);
    svg.on('dblclick.zoom', () => {
      svg.transition().duration(600).call(
        zoom.transform,
        d3.zoomIdentity.translate(WIDTH / 2, HEIGHT / 2)
      );
    });

    function drawCenter(label, total, drillable) {
      g.selectAll('.center-el').remove();

      const innerR = RADIUS * 0.58;

      if (drillable) {
        g.append('circle')
          .attr('class', 'center-el')
          .attr('r', innerR)
          .attr('fill', 'transparent')
          .style('cursor', 'pointer')
          .on('click', () => drillRef.current.drillBack?.());
      }

      const labelY = drillable ? -24 : -14;
      const totalY = drillable ? 2 : 14;

      const maxChars = CENTER_LABEL_MAX;
      const displayLabel = label.length > maxChars ? label.substring(0, maxChars - 1) + '…' : label;

      g.append('text')
        .attr('class', 'center-el')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('y', labelY)
        .attr('font-size', '13px')
        .attr('fill', 'var(--text-muted, #aaa)')
        .attr('font-weight', '500')
        .attr('pointer-events', 'none')
        .text(displayLabel);

      g.append('text')
        .attr('class', 'center-el')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('y', totalY)
        .attr('font-size', '17px')
        .attr('fill', 'var(--text, #fff)')
        .attr('font-weight', 'bold')
        .attr('pointer-events', 'none')
        .text('$' + total.toLocaleString());

      if (drillable) {
        g.append('text')
          .attr('class', 'center-el')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('y', 26)
          .attr('font-size', '11px')
          .attr('fill', 'var(--text-muted, #aaa)')
          .attr('pointer-events', 'none')
          .text('click to go back');
      }
    }

    function tooltipNote(name) {
      if (name === 'Employee Benefits' && BENEFITS_ANOMALY_YEARS.has(yearRef.current)) {
        return 'Includes pension fund activity (fiduciary) in the DCED totals, inflating this figure vs. other years.';
      }
      return null;
    }

    let touchTimer = null;
    let hideTimer = null;

    function drawArcs(chartData, opts = {}) {
      const { animateIn = false, depth = 0, label = 'All Funds' } = opts;
      const color = colorScales[Math.min(depth, colorScales.length - 1)];
      const total = d3.sum(chartData, d => d.value);
      const pieData = pie(chartData.filter(d => d.value > 0));

      g.selectAll('.arc').remove();

      drawCenter(label, total, depth > 0);

      drillRef.current.currentLabel = label;

      const arcs = g.selectAll('.arc')
        .data(pieData)
        .enter()
        .append('g')
        .attr('class', 'arc');

      // Use ref so cursor/actionable check is always current, not stale from effect closure
      const isActionable = d => !!(drillDownDataRef.current[d.data.name] || onSegmentClickRef.current);

      const paths = arcs.append('path')
        .attr('stroke', 'var(--bg)')
        .attr('stroke-width', 2)
        .attr('fill', (d, i) => color(i))
        .style('cursor', 'default')
        .on('mouseenter', function(event, d) {
          if (drillRef.current.animating) return;
          if (isActionable(d)) {
            d3.select(this).style('cursor', 'pointer');
            d3.select(this.parentNode).raise();
            d3.select(this).attr('stroke', 'white').attr('stroke-width', 3);
          }
          const rect = svgRef.current.getBoundingClientRect();
          setTooltip({
            name: d.data.name,
            value: d.data.value.toLocaleString(),
            percent: ((d.data.value / total) * 100).toFixed(1),
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            drillable: isActionable(d),
            note: tooltipNote(d.data.name),
          });
        })
        .on('mousemove', event => {
          const rect = svgRef.current.getBoundingClientRect();
          setTooltip(p => p ? { ...p, x: event.clientX - rect.left, y: event.clientY - rect.top } : null);
        })
        .on('mouseleave', function() {
          d3.select(this).style('cursor', 'default').attr('stroke', 'var(--bg)').attr('stroke-width', 2);
          setTooltip(null);
        })
        .on('touchstart', function(event, d) {
          if (drillRef.current.animating) return;
          clearTimeout(touchTimer);
          clearTimeout(hideTimer);
          setTooltip(null);
          drillRef.current.longPressed = false;
          const touch = event.changedTouches[0];
          touchTimer = setTimeout(() => {
            touchTimer = null;
            drillRef.current.longPressed = true;
            d3.select(this.parentNode).raise();
            const rect = svgRef.current.getBoundingClientRect();
            setTooltip({
              name: d.data.name,
              value: d.data.value.toLocaleString(),
              percent: ((d.data.value / total) * 100).toFixed(1),
              x: touch.clientX - rect.left,
              y: touch.clientY - rect.top,
              drillable: isActionable(d),
              note: tooltipNote(d.data.name),
            });
            hideTimer = setTimeout(() => setTooltip(null), TOOLTIP_HIDE_MS);
          }, LONG_PRESS_MS);
        })
        .on('touchmove', function() {
          clearTimeout(touchTimer);
          touchTimer = null;
          drillRef.current.longPressed = false;
        })
        .on('touchend', function() {
          clearTimeout(touchTimer);
          touchTimer = null;
        })
        .on('click', function(event, d) {
          if (drillRef.current.longPressed) { drillRef.current.longPressed = false; return; }
          // Use drillDownDataRef so this is never stale after a suppressed redraw
          if (drillDownDataRef.current[d.data.name]) {
            if (drillRef.current.animating) return;
            drillIn(d, this, chartData, depth);
          } else if (onSegmentClickRef.current) {
            onSegmentClickRef.current(d.data.name);
          }
        });

      if (animateIn) {
        paths.attr('d', d => arc({ ...d, endAngle: d.startAngle }));
        paths.transition()
          .duration(DRILL_DURATION)
          .ease(d3.easeCubicOut)
          .attrTween('d', d => {
            const interp = d3.interpolateObject(
              { startAngle: d.startAngle, endAngle: d.startAngle },
              { startAngle: d.startAngle, endAngle: d.endAngle }
            );
            return t => arc({ ...d, ...interp(t) });
          });
      } else {
        paths.attr('d', arc);
      }

      const labelDelay = animateIn ? DRILL_DURATION * 0.55 : 0;
      const labelFade = animateIn ? DRILL_DURATION * 0.45 : 0;

      arcs.append('text')
        .attr('transform', d => `translate(${labelArc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '13px')
        .attr('fill', 'white')
        .attr('font-weight', 'bold')
        .attr('pointer-events', 'none')
        .attr('opacity', animateIn ? 0 : 1)
        .text(d => {
          const pct = (d.data.value / total * 100).toFixed(1);
          return pct > 1.5 ? `${pct}%` : '';
        })
        .transition().delay(labelDelay).duration(labelFade).attr('opacity', 1);

      arcs.append('text')
        .attr('transform', d => `translate(${labelArc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '11px')
        .attr('fill', 'white')
        .attr('font-weight', '500')
        .attr('pointer-events', 'none')
        .attr('dy', '1.2em')
        .attr('opacity', animateIn ? 0 : 1)
        .text(d => {
          const pct = d.data.value / total * 100;
          if (pct > 5) {
            const name = d.data.name;
            return name.length > ARC_LABEL_MAX ? name.substring(0, ARC_LABEL_MAX - 3) + '...' : name;
          }
          return '';
        })
        .transition().delay(labelDelay).duration(labelFade).attr('opacity', 1);
    }

    async function drillIn(clickedD, clickedEl, parentData, depth) {
      drillRef.current.animating = true;
      setTooltip(null);

      const t = d3.transition().duration(DRILL_DURATION).ease(d3.easeCubicInOut);

      g.selectAll('.arc').each(function(d) {
        if (d === clickedD) return;
        const grp = d3.select(this);
        grp.select('path').transition(t).attr('opacity', 0);
        grp.selectAll('text').transition(t).attr('opacity', 0);
      });

      d3.select(clickedEl).transition(t)
        .attrTween('d', d => {
          const interp = d3.interpolateObject(
            { startAngle: d.startAngle, endAngle: d.endAngle },
            { startAngle: 0, endAngle: TWO_PI }
          );
          return t => arc({ ...d, ...interp(t) });
        });
      d3.select(clickedEl.parentNode).selectAll('text').transition(t).attr('opacity', 0);

      try {
        await t.end();
      } catch {
        drillRef.current.animating = false;
        return;
      }

      // Push to history so drillBack can return here
      drillRef.current.history.push(parentData);
      drillRef.current.labelHistory.push(drillRef.current.currentLabel || 'All Funds');
      drillRef.current.drilledFund = clickedD.data.name;
      setBreadcrumb(prev => [...prev, clickedD.data.name]);

      if (onDrillInRef.current) {
        // Cross-source drill (All → Borough/School): draw the fund data at depth 1
        // so the back button appears, then switch the source badge.
        // Use drillDownDataRef so we always have the live drilldown map.
        drawArcs(drillDownDataRef.current[clickedD.data.name], { animateIn: false, depth: 1, label: clickedD.data.name });
        suppressRedrawRef.current = true;
        onDrillInRef.current(clickedD.data.name);
      } else {
        drawArcs(drillDownDataRef.current[clickedD.data.name], { animateIn: false, depth: depth + 1, label: clickedD.data.name });
      }
      setTimeout(() => { drillRef.current.animating = false; }, DRILL_DURATION + 60);
    }

    drillRef.current.drillBack = async function() {
      if (drillRef.current.animating || drillRef.current.history.length === 0) return;
      drillRef.current.animating = true;
      setTooltip(null);

      const t = d3.transition().duration(DRILL_DURATION * 0.65).ease(d3.easeCubicInOut);

      g.selectAll('.arc').each(function() {
        const grp = d3.select(this);
        grp.select('path').transition(t).attr('opacity', 0)
          .attrTween('d', d => {
            const interp = d3.interpolateObject(
              { startAngle: d.startAngle, endAngle: d.endAngle },
              { startAngle: 0, endAngle: 0 }
            );
            return t => arc({ ...d, ...interp(t) });
          });
        grp.selectAll('text').transition(t).attr('opacity', 0);
      });

      try {
        await t.end();
      } catch {
        drillRef.current.animating = false;
        return;
      }

      const parentData = drillRef.current.history.pop();
      const parentLabel = drillRef.current.labelHistory.pop() || 'All Funds';
      const depth = drillRef.current.history.length;
      drillRef.current.drilledFund = depth > 0 ? drillRef.current.labelHistory[depth - 1] : null;
      setBreadcrumb(prev => prev.slice(0, -1));

      if (depth === 0 && onBackRef.current) {
        // Returning to the All view — animate it back then switch the source badge
        drawArcs(parentData, { animateIn: true, depth: 0, label: parentLabel });
        suppressRedrawRef.current = true;
        onBackRef.current();
      } else {
        drawArcs(parentData, { animateIn: true, depth, label: parentLabel });
      }
      setTimeout(() => { drillRef.current.animating = false; }, DRILL_DURATION + 60);
    };

    drawArcs(data, { label: 'All Funds' });

    if (resumeFund && drillDownData[resumeFund]) {
      drillRef.current.history.push(data);
      drillRef.current.labelHistory.push('All Funds');
      drillRef.current.drilledFund = resumeFund;
      setBreadcrumb([resumeFund]);
      drawArcs(drillDownData[resumeFund], { depth: 1, label: resumeFund });
    }

  }, [data, drillDownData, svgRef]);

  return { breadcrumb, tooltip, triggerBack: () => drillRef.current.drillBack?.() };
}
