import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './BudgetChart.css';

const BudgetChart = ({ data, title, onSegmentClick }) => {
  const svgRef = useRef();
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const width = 900;
    const height = 700;
    const radius = Math.min(width, height) / 2 - 80;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(radius * 0.6).outerRadius(radius);
    const labelArc = d3.arc().innerRadius(radius * 0.75).outerRadius(radius * 0.75);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const arcs = g.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i))
      .attr('stroke', 'var(--bg)')
      .attr('stroke-width', 2)
      .attr('class', d => d.data.name === 'General Fund' ? 'general-fund' : '')
      .on('mouseenter', function(event, d) {
        const total = d3.sum(data, item => item.value);
        const percent = ((d.data.value / total) * 100).toFixed(1);
        const formatted = d.data.value.toLocaleString();
        setTooltip({
          name: d.data.name,
          value: formatted,
          percent: percent,
          x: event.pageX,
          y: event.pageY
        });
      })
      .on('mouseleave', () => setTooltip(null))
      .on('click', (event, d) => {
        if (d.data.name === 'General Fund' && onSegmentClick) {
          onSegmentClick(d.data);
        }
      });

    // Labels directly on the chart
    arcs.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '13px')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none')
      .text(d => {
        const total = d3.sum(data, item => item.value);
        const percent = ((d.data.value / total) * 100).toFixed(1);
        return percent > 1.5 ? `${percent}%` : '';
      });

    // Add fund name labels for larger segments
    arcs.append('text')
      .attr('transform', d => {
        const centroid = labelArc.centroid(d);
        return `translate(${centroid})`;
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '11px')
      .attr('fill', 'white')
      .attr('font-weight', '500')
      .attr('pointer-events', 'none')
      .attr('dy', '1.2em')
      .text(d => {
        const total = d3.sum(data, item => item.value);
        const percent = ((d.data.value / total) * 100).toFixed(1);
        if (percent > 5) {
          const name = d.data.name;
          return name.length > 20 ? name.substring(0, 17) + '...' : name;
        }
        return '';
      });

    // Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.translate(width / 2, height / 2));
      });

    svg.call(zoom);

    // Reset zoom on double-click
    svg.on('dblclick.zoom', function() {
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity.translate(width / 2, height / 2)
      );
    });

  }, [data, onSegmentClick]);

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <h2>{title}</h2>
      <div className="chart-container">
        <svg ref={svgRef} width={900} height={700}></svg>
        <div className="zoom-hint">Scroll to zoom • Double-click to reset • Click General Fund to drill down</div>
        {tooltip && (
          <div
            className="tooltip"
            style={{
              position: 'fixed',
              left: tooltip.x + 10,
              top: tooltip.y + 10,
              pointerEvents: 'none',
              zIndex: 1000,
            }}
          >
            <div className="tooltip-name">{tooltip.name}</div>
            <div className="tooltip-value">${tooltip.value}</div>
            <div className="tooltip-percent">{tooltip.percent}%</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetChart;
