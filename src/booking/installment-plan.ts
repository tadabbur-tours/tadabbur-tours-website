import { isThreeInstallmentCoupon } from '@/booking/installment-coupon';
import { packageSupportsThreeInstallmentOffer } from '@/booking/installment-policy';
import type { InstallmentPlan } from '@/booking/pricing';

/**
 * Authoritative rule: three installments only for the January extended package
 * and a valid server-configured coupon. Everything else stays on two payments.
 */
export function resolveCheckoutInstallmentPlan(
  packageId: unknown,
  couponCode: unknown
): InstallmentPlan {
  if (!packageSupportsThreeInstallmentOffer(typeof packageId === 'string' ? packageId : '')) {
    return 'two';
  }
  return isThreeInstallmentCoupon(couponCode) ? 'three' : 'two';
}
