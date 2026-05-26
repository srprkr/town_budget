import { describe, it, expect } from 'vitest';
import { fmtValue, fmtAxis } from './format';

describe('fmtValue', () => {
  it('formats zero', () => expect(fmtValue(0)).toBe('$0'));
  it('formats small positive integers', () => expect(fmtValue(500)).toBe('$500'));
  it('formats thousands', () => expect(fmtValue(1500)).toBe('$1.5K'));
  it('formats exact thousands', () => expect(fmtValue(1000)).toBe('$1K'));
  it('formats millions', () => expect(fmtValue(1_500_000)).toBe('$1.5M'));
  it('formats negative thousands', () => expect(fmtValue(-2500)).toBe('-$2.5K'));
  it('formats negative millions', () => expect(fmtValue(-3_200_000)).toBe('-$3.2M'));
  it('boundary: 999 stays as integer', () => expect(fmtValue(999)).toBe('$999'));
  it('boundary: 1000 becomes K', () => expect(fmtValue(1000)).toBe('$1K'));
  it('boundary: 999999 stays as K', () => expect(fmtValue(999_999)).toBe('$1000K'));
  it('boundary: 1000000 becomes M', () => expect(fmtValue(1_000_000)).toBe('$1M'));
});

describe('fmtAxis', () => {
  it('formats zero with dollar sign', () => expect(fmtAxis(0)).toBe('$0'));
  it('formats thousands rounded', () => expect(fmtAxis(1500)).toBe('$2K'));
  it('formats millions with one decimal', () => expect(fmtAxis(1_500_000)).toBe('$1.5M'));
  it('formats negative thousands', () => expect(fmtAxis(-2000)).toBe('-$2K'));
  it('formats small values', () => expect(fmtAxis(500)).toBe('$500'));
});
