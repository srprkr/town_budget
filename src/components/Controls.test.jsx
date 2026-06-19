import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Controls from './Controls';
import { TREND_FUNDS } from '../data/trends';
import { AUDIT_YEARS } from '../data/auditData';

const defaultProps = {
  view: 'budget',
  onViewChange: vi.fn(),
  year: 2026,
  type: 'revenue',
  source: 'borough',
  onYearChange: vi.fn(),
  onTypeChange: vi.fn(),
  onSourceChange: vi.fn(),
  fund: 'General Fund',
  onFundChange: vi.fn(),
  dataMode: 'budget',
  onDataModeChange: vi.fn(),
};

describe('Controls — budget view', () => {
  it('renders Source, Year, and Type rows', () => {
    render(<Controls {...defaultProps} />);
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  it('marks the active year badge', () => {
    render(<Controls {...defaultProps} />);
    const btn = screen.getByRole('button', { name: '2026' });
    expect(btn).toHaveClass('active');
  });

  it('calls onYearChange when a different year is clicked', () => {
    const onYearChange = vi.fn();
    render(<Controls {...defaultProps} onYearChange={onYearChange} />);
    fireEvent.click(screen.getByRole('button', { name: '2025' }));
    expect(onYearChange).toHaveBeenCalledWith(2025);
  });
});

describe('Controls — budget view data mode', () => {
  it('renders Data row with Budget and Actual badges', () => {
    render(<Controls {...defaultProps} />);
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Budget' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Actual' })).toBeInTheDocument();
  });

  it('marks Budget badge active when dataMode is budget', () => {
    render(<Controls {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Budget' })).toHaveClass('active');
    expect(screen.getByRole('button', { name: 'Actual' })).not.toHaveClass('active');
  });

  it('calls onDataModeChange when Actual is clicked', () => {
    const onDataModeChange = vi.fn();
    render(<Controls {...defaultProps} onDataModeChange={onDataModeChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Actual' }));
    expect(onDataModeChange).toHaveBeenCalledWith('actual');
  });

  it('hides Source and Type rows in actual mode', () => {
    render(<Controls {...defaultProps} dataMode="actual" />);
    expect(screen.queryByText('Source')).not.toBeInTheDocument();
    expect(screen.queryByText('Type')).not.toBeInTheDocument();
  });

  it('shows audit years in actual mode', () => {
    render(<Controls {...defaultProps} dataMode="actual" year={2025} />);
    expect(screen.getByRole('button', { name: '2025' })).toHaveClass('active');
  });

  it('shows expand/collapse for audit years in actual mode', () => {
    render(<Controls {...defaultProps} dataMode="actual" year={2025} />);
    const moreBtn = screen.getByText(/Show .* More/);
    expect(moreBtn).toBeInTheDocument();
    fireEvent.click(moreBtn);
    AUDIT_YEARS.forEach(y => {
      expect(screen.getByRole('button', { name: String(y) })).toBeInTheDocument();
    });
  });
});

describe('Controls — compare view', () => {
  const compareProps = { ...defaultProps, view: 'compare', year: 2025 };

  it('renders Year row only', () => {
    render(<Controls {...compareProps} />);
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.queryByText('Source')).not.toBeInTheDocument();
    expect(screen.queryByText('Type')).not.toBeInTheDocument();
    expect(screen.queryByText('Data')).not.toBeInTheDocument();
  });

  it('shows audit years with expand/collapse', () => {
    render(<Controls {...compareProps} />);
    expect(screen.getByText(/Show .* More/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Show .* More/));
    AUDIT_YEARS.forEach(y => {
      expect(screen.getByRole('button', { name: String(y) })).toBeInTheDocument();
    });
  });

  it('resets to first audit year when collapsing past visible range', () => {
    const onYearChange = vi.fn();
    render(<Controls {...compareProps} year={AUDIT_YEARS[AUDIT_YEARS.length - 1]} onYearChange={onYearChange} />);
    fireEvent.click(screen.getByText(/Show .* More/));
    fireEvent.click(screen.getByText('Show Less'));
    expect(onYearChange).toHaveBeenCalledWith(AUDIT_YEARS[0]);
  });
});

describe('Controls — trends view', () => {
  const trendProps = { ...defaultProps, view: 'trends' };

  it('renders Fund and Type rows', () => {
    render(<Controls {...trendProps} />);
    expect(screen.getByText('Fund')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  it('shows the first 8 funds plus All by default', () => {
    render(<Controls {...trendProps} />);
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    TREND_FUNDS.slice(0, 8).forEach(f => {
      expect(screen.getByRole('button', { name: f })).toBeInTheDocument();
    });
  });

  it('expands to show all funds when Show More is clicked', () => {
    render(<Controls {...trendProps} />);
    fireEvent.click(screen.getByText(/Show .* More/));
    TREND_FUNDS.forEach(f => {
      expect(screen.getByRole('button', { name: f })).toBeInTheDocument();
    });
  });

  it('collapses back when Show Less is clicked', () => {
    render(<Controls {...trendProps} />);
    fireEvent.click(screen.getByText(/Show .* More/));
    fireEvent.click(screen.getByText('Show Less'));
    expect(screen.queryByRole('button', { name: TREND_FUNDS[8] })).not.toBeInTheDocument();
  });
});
