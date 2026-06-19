import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TrendChart from './TrendChart';

// D3 SVG rendering doesn't work in jsdom — stub the hook so we test the component wrapper only
vi.mock('../hooks/useTrendChart', () => ({ useTrendChart: () => {} }));

describe('TrendChart', () => {
  const values = [null, null, null, null, null, 100, 200, 300, 400, 500];

  it('renders the fund and revenue type in the title', () => {
    const { container } = render(<TrendChart values={values} fund="General Fund" type="revenue" />);
    const title = container.querySelector('.trend-title');
    expect(title).toBeInTheDocument();
    expect(title.textContent).toMatch(/General Fund.*Revenue/);
  });

  it('renders expenditures label for expenditure type', () => {
    const { container } = render(<TrendChart values={values} fund="Sewer Fund" type="expenditure" />);
    const title = container.querySelector('.trend-title');
    expect(title.textContent).toMatch(/Sewer Fund.*Expenditures/);
  });

  it('renders Surplus / Deficit label for balance type', () => {
    const { container } = render(<TrendChart values={values} fund="General Fund" type="balance" />);
    const title = container.querySelector('.trend-title');
    expect(title.textContent).toMatch(/Surplus \/ Deficit/);
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
