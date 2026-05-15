const ChartTooltip = ({ tooltip }) => {
  if (!tooltip) return null;
  return (
    <div
      className="tooltip"
      style={{
        position: 'absolute',
        left: tooltip.x + 12,
        top: tooltip.y + 12,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <div className="tooltip-name">{tooltip.name}</div>
      <div className="tooltip-value">${tooltip.value}</div>
      <div className="tooltip-percent">{tooltip.percent}%</div>
    </div>
  );
};

export default ChartTooltip;
