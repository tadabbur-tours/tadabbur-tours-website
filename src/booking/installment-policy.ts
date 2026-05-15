/**
 * Which packages may offer the special three-installment (⅓ + ⅓ + ⅓) plan with a server-issued code.
 * Keep in sync with `PACKAGES` in `src/config/site.ts`.
 */
export const JANUARY_EXTENDED_TRIP_PACKAGE_ID = 'january-extended' as const;

export function packageSupportsThreeInstallmentOffer(packageId: string | undefined): boolean {
  return packageId === JANUARY_EXTENDED_TRIP_PACKAGE_ID;
}
