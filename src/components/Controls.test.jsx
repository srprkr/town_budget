import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Controls from './Controls';
import { TREND_FUNDS } from '../data/trends';

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

describe('Controls — trends view', () => {
  const trendProps = { ...defaultProps, view: 'trends' };

  it('renders Fund and Type rows', () => {
    render(<Controls {...trendProps} />);
    expect(screen.getByText('Fund')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  it('shows the first 5 funds plus All by default', () => {
    render(<Controls {...trendProps} />);
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    TREND_FUNDS.slice(0, 5).forEach(f => {
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
    expect(screen.queryByRole('button', { name: TREND_FUNDS[5] })).not.toBeInTheDocument();
  });
});
