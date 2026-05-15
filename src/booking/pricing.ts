/**
 * Booking checkout math and room rates (USD). Domain logic shared by the
 * Stripe checkout API and the booking modal — change pricing rules only here.
 */

export const SPOT_RATE_USD = {
  dual: 4200,
  triple: 3950,
  quad: 3750,
} as const;

export type RoomSpotType = keyof typeof SPOT_RATE_USD;

export type RoomSpotCounts = Record<RoomSpotType, number>;

export type CheckoutPaymentMethod = 'stripe' | 'bank_transfer';

export type InstallmentPlan = 'two' | 'three';

const CARD_FEE_RATE = 0.029;
const CARD_FIXED_FEE_CENTS = 30;
const ACH_FEE_RATE = 0.008;
const ACH_MAX_FEE_CENTS = 500;

export const BOOKING_ROOM_OPTIONS: readonly {
  type: RoomSpotType;
  capacity: number;
  description: string;
}[] = [
  {
    type: 'quad',
    capacity: 4,
    description: 'Shared room with 3 other people',
  },
  {
    type: 'triple',
    capacity: 3,
    description: 'Shared room with 2 other people',
  },
  {
    type: 'dual',
    capacity: 2,
    description: 'Shared room with 1 other person',
  },
] as const;

function clampNonNegativeInt(n: unknown): number {
  const x = typeof n === 'number' ? n : Number(n);
  if (!Number.isFinite(x) || x < 0) return 0;
  return Math.floor(x);
}

/** Coerce API / form payload into safe spot counts. */
export function normalizeRoomSpots(input: Partial<Record<RoomSpotType, unknown>> | undefined): RoomSpotCounts {
  return {
    dual: clampNonNegativeInt(input?.dual),
    triple: clampNonNegativeInt(input?.triple),
    quad: clampNonNegativeInt(input?.quad),
  };
}

export function spotCountTotal(spots: RoomSpotCounts): number {
  return spots.dual + spots.triple + spots.quad;
}

/** Full package total in cents (Stripe smallest USD unit). */
export function totalPackageCents(spots: Partial<RoomSpotCounts> | undefined): number {
  const s = normalizeRoomSpots(spots);
  return (
    s.dual * SPOT_RATE_USD.dual +
    s.triple * SPOT_RATE_USD.triple +
    s.quad * SPOT_RATE_USD.quad
  ) * 100;
}

/** 50% deposit of package total, in cents. */
export function depositCentsFromPackageTotal(totalPackageCents: number): number {
  return Math.round(totalPackageCents * 0.5);
}

export function remainingBalanceCents(totalPackageCents: number, depositCents: number): number {
  return totalPackageCents - depositCents;
}

/** Three equal parts in cents; remainder 1–2¢ on later installments. */
export function splitPackageIntoThreeEqualParts(totalCents: number): [number, number, number] {
  const base = Math.floor(totalCents / 3);
  const rem = totalCents - base * 3;
  if (rem === 0) return [base, base, base];
  if (rem === 1) return [base, base, base + 1];
  return [base, base + 1, base + 1];
}

export function stripeProcessingFeeCents(
  depositSubtotalCents: number,
  paymentMethod: CheckoutPaymentMethod
): number {
  if (paymentMethod === 'bank_transfer') {
    return Math.min(Math.round(depositSubtotalCents * ACH_FEE_RATE), ACH_MAX_FEE_CENTS);
  }
  return Math.round(depositSubtotalCents * CARD_FEE_RATE) + CARD_FIXED_FEE_CENTS;
}

export function computeCheckoutAmounts(
  spots: Partial<RoomSpotCounts> | undefined,
  paymentMethod: CheckoutPaymentMethod,
  options?: { installmentPlan?: InstallmentPlan }
): {
  spots: RoomSpotCounts;
  totalPackageCents: number;
  depositCents: number;
  balanceCents: number;
  processingFeeCents: number;
  totalChargeCents: number;
  installmentPlan: InstallmentPlan;
  futureInstallmentAmountsCents: number[];
} {
  const installmentPlan = options?.installmentPlan === 'three' ? 'three' : 'two';
  const normalized = normalizeRoomSpots(spots);
  const pkg = totalPackageCents(normalized);

  if (installmentPlan === 'three') {
    const [first, second, third] = splitPackageIntoThreeEqualParts(pkg);
    const balanceCents = second + third;
    const fee = stripeProcessingFeeCents(first, paymentMethod);
    return {
      spots: normalized,
      totalPackageCents: pkg,
      depositCents: first,
      balanceCents,
      processingFeeCents: fee,
      totalChargeCents: first + fee,
      installmentPlan: 'three',
      futureInstallmentAmountsCents: [second, third],
    };
  }

  const dep = depositCentsFromPackageTotal(pkg);
  const bal = remainingBalanceCents(pkg, dep);
  const fee = stripeProcessingFeeCents(dep, paymentMethod);
  return {
    spots: normalized,
    totalPackageCents: pkg,
    depositCents: dep,
    balanceCents: bal,
    processingFeeCents: fee,
    totalChargeCents: dep + fee,
    installmentPlan: 'two',
    futureInstallmentAmountsCents: [bal],
  };
}

export function priceUsdLabel(priceUsd: number): string {
  return `$${priceUsd.toLocaleString('en-US')}`;
}

export function spotRateUsd(room: RoomSpotType): number {
  return SPOT_RATE_USD[room];
}

/** Dollars from integer cents (for display). */
export function dollarsFromCents(cents: number): number {
  return cents / 100;
}

export function formatUsd(dollars: number, fractionDigits: 0 | 2 = 2): string {
  return `$${dollars.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

export function formatCentsAsUsd(cents: number, fractionDigits: 0 | 2 = 2): string {
  return formatUsd(dollarsFromCents(cents), fractionDigits);
}
