/**
 * Server-only: comma-separated codes in BOOKING_THREE_INSTALLMENT_COUPONS
 * enable three equal installments instead of the default two (50% + 50%).
 * Package eligibility is enforced separately (see installment-policy / installment-plan).
 */

function normalizedCouponList(): string[] {
  const raw = process.env.BOOKING_THREE_INSTALLMENT_COUPONS ?? '';
  return raw
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
}

export function isThreeInstallmentCoupon(code: unknown): boolean {
  const allowed = normalizedCouponList();
  if (allowed.length === 0) return false;
  if (typeof code !== 'string') return false;
  const trimmed = code.trim();
  if (!trimmed) return false;
  return allowed.includes(trimmed.toUpperCase());
}
