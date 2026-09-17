export const FEE_RATE = 0.015;
export const PRIORITY_FEE_RATE = 0.02;
export const FALLBACK_RATE = 12.87;

export function calculateFee(amount: number, isPriority = false): number {
  return amount * (isPriority ? PRIORITY_FEE_RATE : FEE_RATE);
}

export function calculateNetAmount(amount: number, fee: number): number {
  return amount - fee;
}

export function calculateTargetAmount(netAmount: number, cnyToRubRate: number): number {
  return netAmount * (1 / cnyToRubRate);
}

export function calculateSettlement(
  amount: number,
  cnyToRubRate: number,
  isPriority = false
): { fee: number; netAmount: number; targetAmount: number; rate: number } {
  const fee = calculateFee(amount, isPriority);
  const netAmount = calculateNetAmount(amount, fee);
  const rate = 1 / cnyToRubRate;
  const targetAmount = calculateTargetAmount(netAmount, cnyToRubRate);
  return { fee, netAmount, targetAmount, rate };
}
