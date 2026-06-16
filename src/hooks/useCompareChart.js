import { useEffect } from 'react';
import * as d3 from 'd3';
import { fmtValue, fmtAxis } from '../utils/format';
import { COMPARE_CATEGORIES } from '../data/auditData';
import { getTooltipNote } from '../utils/tooltipNotes';

const GREEN = '#22c55e';
const RED = '#ef4444';
const BUDGET_OPACITY = 0.42;
const W = 800;

// Category view dimensions
const C_MAR = { top: 24, right: 46, bottom: 62, left: 152 };
const C_H = 500;
const C_IW = W - C_MAR.left - C_MAR.right;
const C_IH = C_H - C_MAR.top - C_MAR.bottom;

// Total view dimensions
const T_MAR = { top: 22, right: 16, bottom: 58, left: 152 };
const T_H = 210;
const T_IW = W - T_MAR.left - T_MAR.right;
const T_IH = T_H - T_MAR.top - T_MAR.bottom;

export function useCompareChart({ svgRef, actuals, budget, mode = 'category', setTooltip, year, showBudget = true }) {
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    if (mode === 'total') drawTotal(svg, actuals, budget, setTooltip, year, showBudget);
    else drawCategory(svg, actuals, budget, setTooltip, year, showBudget);
  }, [svgRef, actuals, budget, mode, setTooltip, year, showBudget]);
}

function makeTooltipHandlers(setTooltip, getData, year) {
  if (!setTooltip) return {};
  return {
    mouseenter(event, d) {
      const { cat, budgetVal, actualVal } = getData(d);
      const rect = event.currentTarget.closest('svg').getBoundingClientRect();
      setTooltip({
        cat,
        budgetVal,
        actualVal,
        note: getTooltipNote(cat, year),
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    },
    mousemove(event) {
      const rect = event.currentTarget.closest('svg').getBoundingClientRect();
      setTooltip(p => p ? { ...p, x: event.clientX - rect.left, y: event.clientY - rect.top } : null);
    },
    mouseleave() {
      setTooltip(null);
    },
  };
}

function drawCategory(svg, actuals, budget, setTooltip, year, showBudget) {
  const g = svg.append('g').attr('transform', `translate(${C_MAR.left},${C_MAR.top})`);

  const yScale = d3.scaleBand()
    .domain(COMPARE_CATEGORIES)
    .range([0, C_IH])
    .paddingInner(0.18)
    .paddingOuter(0.1);

  const subDomain = showBudget ? ['budget', 'actual'] : ['actual'];
  const ySubScale = d3.scaleBand()
    .domain(subDomain)
    .range([0, yScale.bandwidth()])
    .padding(0.08);

  const allVals = COMPARE_CATEGORIES.flatMap(cat => [
    ...(showBudget ? [budget[cat] ?? 0] : []),
    actuals[cat] ?? 0,
  ]);
  const maxVal = d3.max(allVals) ?? 1;

  const xScale = d3.scaleLinear()
    .domain([0, maxVal])
    .range([0, C_IW])
    .nice();

  g.append('g')
    .attr('transform', `translate(0,${C_IH})`)
    .call(d3.axisBottom(xScale).tickSize(-C_IH).tickFormat('').ticks(5))
    .call(sel => {
      sel.select('.domain').remove();
      sel.selectAll('line').attr('stroke', 'var(--border)').attr('stroke-dasharray', '4,4');
    });

  g.append('g')
    .attr('transform', `translate(0,${C_IH})`)
    .call(d3.axisBottom(xScale).ticks(5).tickFormat(fmtAxis))
    .call(sel => {
      sel.select('.domain').remove();
      sel.selectAll('line').remove();
      sel.selectAll('text').attr('fill', 'var(--text-muted, #888)').attr('font-size', '12px');
    });

  g.append('g')
    .call(d3.axisLeft(yScale).tickSize(0))
    .call(sel => {
      sel.select('.domain').remove();
      sel.selectAll('text').attr('fill', 'var(--text)').attr('font-size', '12px').attr('dx', '-8');
    });

  const handlers = makeTooltipHandlers(setTooltip, d => ({
    cat: d,
    budgetVal: budget[d] ?? 0,
    actualVal: actuals[d] ?? 0,
  }), year);

  const groups = g.selectAll('.bar-group')
    .data(COMPARE_CATEGORIES)
    .enter().append('g')
    .attr('class', 'bar-group')
    .attr('transform', d => `translate(0,${yScale(d)})`)
    .style('cursor', setTooltip ? 'default' : null)
    .on('mouseenter', handlers.mouseenter ?? null)
    .on('mousemove', handlers.mousemove ?? null)
    .on('mouseleave', handlers.mouseleave ?? null);

  if (showBudget) {
    groups.append('rect')
      .attr('y', ySubScale('budget'))
      .attr('width', d => xScale(budget[d] ?? 0))
      .attr('height', ySubScale.bandwidth())
      .attr('fill', 'var(--accent)')
      .attr('opacity', BUDGET_OPACITY)
      .attr('rx', 2);

    groups.append('text')
      .attr('x', d => xScale(budget[d] ?? 0) + 5)
      .attr('y', ySubScale('budget') + ySubScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('fill', 'var(--text-muted, #888)')
      .attr('font-size', '11px')
      .text(d => fmtValue(budget[d] ?? 0));
  }

  groups.append('rect')
    .attr('y', ySubScale('actual'))
    .attr('width', d => xScale(actuals[d] ?? 0))
    .attr('height', ySubScale.bandwidth())
    .attr('fill', GREEN)
    .attr('rx', 2);

  groups.append('text')
    .attr('x', d => xScale(actuals[d] ?? 0) + 5)
    .attr('y', ySubScale('actual') + ySubScale.bandwidth() / 2)
    .attr('dy', '0.35em')
    .attr('fill', 'var(--text)')
    .attr('font-size', '11px')
    .attr('font-weight', '600')
    .text(d => fmtValue(actuals[d] ?? 0));

  const lgG = g.append('g').attr('transform', `translate(${C_IW / 2 - (showBudget ? 108 : 60)},${C_IH + 36})`);
  if (showBudget) {
    lgG.append('rect').attr('width', 13).attr('height', 13).attr('rx', 2)
      .attr('fill', 'var(--accent)').attr('opacity', BUDGET_OPACITY);
    lgG.append('text').attr('x', 19).attr('y', 6.5).attr('dominant-baseline', 'middle')
      .attr('fill', 'var(--text-muted, #888)').attr('font-size', '11px').text('Budgeted');
    lgG.append('rect').attr('x', 90).attr('width', 13).attr('height', 13).attr('rx', 2).attr('fill', GREEN);
    lgG.append('text').attr('x', 109).attr('y', 6.5).attr('dominant-baseline', 'middle')
      .attr('fill', 'var(--text-muted, #888)').attr('font-size', '11px').text('Audited Actual');
  } else {
    lgG.append('rect').attr('width', 13).attr('height', 13).attr('rx', 2).attr('fill', GREEN);
    lgG.append('text').attr('x', 19).attr('y', 6.5).attr('dominant-baseline', 'middle')
      .attr('fill', 'var(--text-muted, #888)').attr('font-size', '11px').text('Audited Actual');
  }
}

function drawTotal(svg, actuals, budget, setTooltip, year, showBudget) {
  const budgetTotal = COMPARE_CATEGORIES.reduce((s, c) => s + (budget[c] ?? 0), 0);
  const actualTotal = COMPARE_CATEGORIES.reduce((s, c) => s + (actuals[c] ?? 0), 0);
  const diff = actualTotal - budgetTotal;
  const maxVal = showBudget ? Math.max(budgetTotal, actualTotal) : actualTotal;

  const g = svg.append('g').attr('transform', `translate(${T_MAR.left},${T_MAR.top})`);

  const xScale = d3.scaleLinear().domain([0, maxVal]).range([0, T_IW]).nice();

  const yDomain = showBudget ? ['budget', 'actual'] : ['actual'];
  const yScale = d3.scaleBand()
    .domain(yDomain)
    .range([0, T_IH])
    .padding(0.3);

  // Gridlines
  g.append('g')
    .attr('transform', `translate(0,${T_IH})`)
    .call(d3.axisBottom(xScale).tickSize(-T_IH).tickFormat('').ticks(5))
    .call(sel => {
      sel.select('.domain').remove();
      sel.selectAll('line').attr('stroke', 'var(--border)').attr('stroke-dasharray', '4,4');
    });

  // X axis
  g.append('g')
    .attr('transform', `translate(0,${T_IH})`)
    .call(d3.axisBottom(xScale).ticks(5).tickFormat(fmtAxis))
    .call(sel => {
      sel.select('.domain').remove();
      sel.selectAll('line').remove();
      sel.selectAll('text').attr('fill', 'var(--text-muted, #888)').attr('font-size', '12px');
    });

  const totalHandlers = makeTooltipHandlers(setTooltip, d => ({
    cat: d === 'budget' ? 'Budgeted Total' : 'Audited Total',
    budgetVal: budgetTotal,
    actualVal: actualTotal,
  }), year);

  if (showBudget) {
    g.append('text')
      .attr('x', -10).attr('y', yScale('budget') + yScale.bandwidth() / 2)
      .attr('text-anchor', 'end').attr('dominant-baseline', 'middle')
      .attr('fill', 'var(--accent)').attr('font-size', '13px').attr('font-weight', '600')
      .text('Budgeted');

    g.append('rect')
      .attr('y', yScale('budget'))
      .attr('width', xScale(budgetTotal))
      .attr('height', yScale.bandwidth())
      .attr('fill', 'var(--accent)')
      .attr('opacity', BUDGET_OPACITY)
      .attr('rx', 3)
      .on('mouseenter', totalHandlers.mouseenter ? e => totalHandlers.mouseenter(e, 'budget') : null)
      .on('mousemove', totalHandlers.mousemove ?? null)
      .on('mouseleave', totalHandlers.mouseleave ?? null);

    g.append('text')
      .attr('x', xScale(budgetTotal) + 6)
      .attr('y', yScale('budget') + yScale.bandwidth() / 2)
      .attr('dominant-baseline', 'middle')
      .attr('fill', 'var(--text-muted, #888)')
      .attr('font-size', '13px')
      .text(fmtValue(budgetTotal));

    g.append('text')
      .attr('x', T_IW / 2)
      .attr('y', T_IH + 36)
      .attr('text-anchor', 'middle')
      .attr('fill', diff > 0 ? RED : GREEN)
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .text(`${diff >= 0 ? '+' : ''}${fmtValue(diff)} vs. budget`);
  }

  g.append('text')
    .attr('x', -10).attr('y', yScale('actual') + yScale.bandwidth() / 2)
    .attr('text-anchor', 'end').attr('dominant-baseline', 'middle')
    .attr('fill', GREEN).attr('font-size', '13px').attr('font-weight', '600')
    .text('Audited');

  g.append('rect')
    .attr('y', yScale('actual'))
    .attr('width', xScale(actualTotal))
    .attr('height', yScale.bandwidth())
    .attr('fill', GREEN)
    .attr('rx', 3)
    .on('mouseenter', totalHandlers.mouseenter ? e => totalHandlers.mouseenter(e, 'actual') : null)
    .on('mousemove', totalHandlers.mousemove ?? null)
    .on('mouseleave', totalHandlers.mouseleave ?? null);

  g.append('text')
    .attr('x', xScale(actualTotal) + 6)
    .attr('y', yScale('actual') + yScale.bandwidth() / 2)
    .attr('dominant-baseline', 'middle')
    .attr('fill', 'var(--text)')
    .attr('font-size', '13px')
    .attr('font-weight', '600')
    .text(fmtValue(actualTotal));
}
