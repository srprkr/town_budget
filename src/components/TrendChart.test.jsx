import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TrendChart from './TrendChart';

// D3 SVG rendering doesn't work in jsdom — stub the hook so we test the component wrapper only
vi.mock('../hooks/useTrendChart', () => ({ useTrendChart: () => {} }));

describe('TrendChart', () => {
  const values = [null, null, null, null, null, 100, 200, 300, 400, 500];

  it('renders the fund and revenue type in the title', () => {
    render(<TrendChart values={values} fund="General Fund" type="revenue" />);
    expect(screen.getByText(/General Fund/)).toBeInTheDocument();
    expect(screen.getByText(/Revenue/)).toBeInTheDocument();
  });

  it('renders expenditures label for expenditure type', () => {
    render(<TrendChart values={values} fund="Sewer Fund" type="expenditure" />);
    expect(screen.getByText(/Expenditures/)).toBeInTheDocument();
  });

  it('renders Surplus / Deficit label for balance type', () => {
    render(<TrendChart values={values} fund="General Fund" type="balance" />);
    expect(screen.getByText(/Surplus \/ Deficit/)).toBeInTheDocument();
  });

  it('renders the zoom hint', () => {
    render(<TrendChart values={values} fund="General Fund" type="revenue" />);
    expect(screen.getByText(/Scroll to zoom/)).toBeInTheDocument();
  });

  it('renders an svg element', () => {
    const { container } = render(<TrendChart values={values} fund="General Fund" type="revenue" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
