import { describe, it, expect } from 'vitest';
import {
  FEE_RATE,
  PRIORITY_FEE_RATE,
  FALLBACK_RATE,
  calculateFee,
  calculateNetAmount,
  calculateTargetAmount,
  calculateSettlement,
} from '../settlement';

describe('calculateFee', () => {
  it('applies the standard fee rate', () => {
    expect(calculateFee(1000)).toBeCloseTo(1000 * FEE_RATE);
  });

  it('applies the priority fee rate when requested', () => {
    expect(calculateFee(1000, true)).toBeCloseTo(1000 * PRIORITY_FEE_RATE);
  });

  it('returns 0 for a 0 amount', () => {
    expect(calculateFee(0)).toBe(0);
  });

  it('scales linearly for a large amount', () => {
    expect(calculateFee(10_000_000)).toBeCloseTo(10_000_000 * FEE_RATE);
  });

  it('preserves sign for a negative amount (validation happens elsewhere)', () => {
    expect(calculateFee(-1000)).toBeCloseTo(-1000 * FEE_RATE);
  });
});

describe('calculateNetAmount', () => {
  it('subtracts the fee from the amount', () => {
    expect(calculateNetAmount(1000, 15)).toBe(985);
  });

  it('returns the amount unchanged when fee is 0', () => {
    expect(calculateNetAmount(1000, 0)).toBe(1000);
  });
});

describe('calculateTargetAmount', () => {
  it('converts using the inverse of the CNY->RUB rate', () => {
    const netAmount = 985;
    const cnyToRubRate = FALLBACK_RATE;
    expect(calculateTargetAmount(netAmount, cnyToRubRate)).toBeCloseTo(netAmount / cnyToRubRate);
  });
});

describe('calculateSettlement', () => {
  it('computes a full standard settlement for a normal amount (1000 RUB)', () => {
    const result = calculateSettlement(1000, FALLBACK_RATE);
    const expectedFee = 1000 * FEE_RATE;
    const expectedNet = 1000 - expectedFee;
    expect(result.fee).toBeCloseTo(expectedFee);
    expect(result.netAmount).toBeCloseTo(expectedNet);
    expect(result.rate).toBeCloseTo(1 / FALLBACK_RATE);
    expect(result.targetAmount).toBeCloseTo(expectedNet / FALLBACK_RATE);
  });

  it('computes a settlement for a 0 amount', () => {
    const result = calculateSettlement(0, FALLBACK_RATE);
    expect(result.fee).toBe(0);
    expect(result.netAmount).toBe(0);
    expect(result.targetAmount).toBe(0);
  });

  it('computes a settlement for a negative amount without throwing', () => {
    const result = calculateSettlement(-500, FALLBACK_RATE);
    expect(result.fee).toBeLessThan(0);
    expect(result.netAmount).toBeLessThan(0);
    expect(result.targetAmount).toBeLessThan(0);
  });

  it('computes a settlement for a large amount (10,000,000 RUB)', () => {
    const amount = 10_000_000;
    const result = calculateSettlement(amount, FALLBACK_RATE);
    const expectedFee = amount * FEE_RATE;
    expect(result.fee).toBeCloseTo(expectedFee);
    expect(result.targetAmount).toBeCloseTo((amount - expectedFee) / FALLBACK_RATE);
  });

  it('applies the priority fee rate end to end', () => {
    const amount = 1000;
    const result = calculateSettlement(amount, FALLBACK_RATE, true);
    const expectedFee = amount * PRIORITY_FEE_RATE;
    expect(result.fee).toBeCloseTo(expectedFee);
    expect(result.netAmount).toBeCloseTo(amount - expectedFee);
  });

  it('uses a different exchange rate correctly', () => {
    const result = calculateSettlement(1000, 10);
    expect(result.rate).toBeCloseTo(0.1);
    expect(result.targetAmount).toBeCloseTo(result.netAmount * 0.1);
  });
});
