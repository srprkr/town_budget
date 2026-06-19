import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChartHint from './ChartHint';

describe('ChartHint', () => {
  it('shows drill-down hint when breadcrumb is empty', () => {
    render(<ChartHint breadcrumb={[]} source="borough" year={2026} />);
    expect(screen.getByText(/Click a fund to drill down/)).toBeInTheDocument();
  });

  it('shows breadcrumb name when drilled in', () => {
    render(<ChartHint breadcrumb={['General Fund']} source="borough" year={2026} />);
    expect(screen.getByText(/Viewing: General Fund/)).toBeInTheDocument();
    expect(screen.getByText(/Click center to return/)).toBeInTheDocument();
  });

  it('shows custom hintLine when provided', () => {
    render(<ChartHint breadcrumb={[]} source="borough" year={2026} hintLine="Custom hint" />);
    expect(screen.getByText('Custom hint')).toBeInTheDocument();
    expect(screen.queryByText(/Click a fund/)).not.toBeInTheDocument();
  });

  it('shows noDetail message for 2016', () => {
    render(<ChartHint breadcrumb={[]} source="borough" year={2016} noDetail />);
    expect(screen.getByText(/Fund detail not available for 2016/)).toBeInTheDocument();
  });

  it('shows borough source link for borough source', () => {
    render(<ChartHint breadcrumb={[]} source="borough" year={2026} />);
    expect(screen.getByText('Borough source')).toBeInTheDocument();
    expect(screen.queryByText('School district source')).not.toBeInTheDocument();
  });

  it('shows school source link for school source with known year', () => {
    render(<ChartHint breadcrumb={[]} source="school" year={2026} />);
    expect(screen.getByText('School district source')).toBeInTheDocument();
    expect(screen.queryByText('Borough source')).not.toBeInTheDocument();
  });

  it('shows both source links for all source with known school year', () => {
    render(<ChartHint breadcrumb={[]} source="all" year={2026} />);
    expect(screen.getByText('Borough source')).toBeInTheDocument();
    expect(screen.getByText('School district source')).toBeInTheDocument();
  });

  it('shows DCED audit link for actual source', () => {
    render(<ChartHint breadcrumb={[]} source="actual" year={2025} />);
    expect(screen.getByText('DCED Annual Audit')).toBeInTheDocument();
    expect(screen.queryByText('Borough source')).not.toBeInTheDocument();
  });
});
