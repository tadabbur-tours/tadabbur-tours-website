import { NextRequest, NextResponse } from 'next/server';
import { isThreeInstallmentCoupon } from '@/booking/installment-coupon';
import { packageSupportsThreeInstallmentOffer } from '@/booking/installment-policy';

export type ValidateInstallmentCouponResponse = {
  eligiblePackage: boolean;
  threeInstallments: boolean;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code = typeof body?.code === 'string' ? body.code : '';
    const packageId = typeof body?.packageId === 'string' ? body.packageId : '';

    const eligiblePackage = packageSupportsThreeInstallmentOffer(packageId);
    const threeInstallments = eligiblePackage && isThreeInstallmentCoupon(code);

    return NextResponse.json({ eligiblePackage, threeInstallments } satisfies ValidateInstallmentCouponResponse);
  } catch {
    return NextResponse.json({
      eligiblePackage: false,
      threeInstallments: false,
    } satisfies ValidateInstallmentCouponResponse);
  }
}
