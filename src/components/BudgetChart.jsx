import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './BudgetChart.css';

const WIDTH = 900;
const HEIGHT = 700;
const RADIUS = Math.min(WIDTH, HEIGHT) / 2 - 80;
const DRILL_DURATION = 480;
const TWO_PI = Math.PI * 2;

const BudgetChart = ({ data, title, drillDownData = {} }) => {
  const svgRef = useRef();
  const drillRef = useRef({ history: [], labelHistory: [], animating: false, drillBack: null });
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    drillRef.current.history = [];
    drillRef.current.labelHistory = [];
    drillRef.current.animating = false;
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

    // Zoom
    const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', event => {
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

      const maxChars = 18;
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

      const paths = arcs.append('path')
        .attr('stroke', 'var(--bg)')
        .attr('stroke-width', 2)
        .attr('fill', (d, i) => color(i))
        .style('cursor', d => drillDownData[d.data.name] ? 'pointer' : 'default')
        .on('mouseenter', function(event, d) {
          if (drillRef.current.animating) return;
          if (drillDownData[d.data.name]) {
            d3.select(this).attr('stroke', 'white').attr('stroke-width', 3);
          }
          setTooltip({
            name: d.data.name,
            value: d.data.value.toLocaleString(),
            percent: ((d.data.value / total) * 100).toFixed(1),
            x: event.pageX,
            y: event.pageY,
            drillable: !!drillDownData[d.data.name],
          });
        })
        .on('mousemove', event => {
          setTooltip(p => p ? { ...p, x: event.pageX, y: event.pageY } : null);
        })
        .on('mouseleave', function(event, d) {
          d3.select(this).attr('stroke', 'var(--bg)').attr('stroke-width', 2);
          setTooltip(null);
        })
        .on('click', function(event, d) {
          if (drillRef.current.animating || !drillDownData[d.data.name]) return;
          drillIn(d, this, chartData, depth);
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
            return name.length > 20 ? name.substring(0, 17) + '...' : name;
          }
          return '';
        })
        .transition().delay(labelDelay).duration(labelFade).attr('opacity', 1);
    }

    async function drillIn(clickedD, clickedEl, parentData, depth) {
      drillRef.current.animating = true;
      setTooltip(null);

      const t = d3.transition().duration(DRILL_DURATION).ease(d3.easeCubicInOut);

      // Fade out non-clicked arcs in place
      g.selectAll('.arc').each(function(d) {
        if (d === clickedD) return;
        const grp = d3.select(this);
        grp.select('path').transition(t).attr('opacity', 0);
        grp.selectAll('text').transition(t).attr('opacity', 0);
      });

      // Expand clicked arc to fill the full circle
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

      drillRef.current.history.push(parentData);
      drillRef.current.labelHistory.push(drillRef.current.currentLabel || 'All Funds');
      setBreadcrumb(prev => [...prev, clickedD.data.name]);

      drawArcs(drillDownData[clickedD.data.name], { animateIn: false, depth: depth + 1, label: clickedD.data.name });
      setTimeout(() => { drillRef.current.animating = false; }, DRILL_DURATION + 60);
    }

    drillRef.current.drillBack = async function() {
      if (drillRef.current.animating || drillRef.current.history.length === 0) return;
      drillRef.current.animating = true;
      setTooltip(null);

      const t = d3.transition().duration(DRILL_DURATION * 0.65).ease(d3.easeCubicInOut);

      // Contract all current arcs toward 12 o'clock
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
      setBreadcrumb(prev => prev.slice(0, -1));

      drawArcs(parentData, { animateIn: true, depth, label: parentLabel });
      setTimeout(() => { drillRef.current.animating = false; }, DRILL_DURATION + 60);
    };

    drawArcs(data, { label: 'All Funds' });

  }, [data, drillDownData]);

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <h2>{title}</h2>
      <div className="chart-container">
        <svg ref={svgRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} />
        <div className="zoom-hint">
          {breadcrumb.length === 0
            ? 'Click a fund to drill down · Scroll to zoom · Double-click to reset zoom'
            : `Viewing: ${breadcrumb[breadcrumb.length - 1]} · Click center to return`}
            <br />
            <a target="_blank" href="https://jenkintownboro.com/budgets/">Source</a>
        </div>
        {tooltip && (
          <div
            className="tooltip"
            style={{
              position: 'fixed',
              left: tooltip.x + 12,
              top: tooltip.y + 12,
              pointerEvents: 'none',
              zIndex: 1000,
            }}
          >
            <div className="tooltip-name">
              {tooltip.name}
              {tooltip.drillable && <span className="tooltip-drill"> ↓ click to expand</span>}
            </div>
            <div className="tooltip-value">${tooltip.value}</div>
            <div className="tooltip-percent">{tooltip.percent}%</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetChart;
