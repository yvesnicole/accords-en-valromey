// src/data/pricing.ts
// Source unique des tarifs de billetterie — plus de hardcoding dans les pages

export interface PricingTier {
  key: 'single' | 'pass2' | 'pass3';
  fullPrice: number;
  reducedPrice: number;
  includesKeys: string[];
  count: number;
  highlighted: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    key: 'single',
    fullPrice: 24,
    reducedPrice: 21,
    includesKeys: ['concert', 'program', 'cocktail'],
    count: 1,
    highlighted: false,
  },
  {
    key: 'pass2',
    fullPrice: 45,
    reducedPrice: 39,
    includesKeys: ['concerts', 'programs', 'cocktails'],
    count: 2,
    highlighted: true,
  },
  {
    key: 'pass3',
    fullPrice: 63,
    reducedPrice: 54,
    includesKeys: ['concerts', 'programs', 'cocktails'],
    count: 3,
    highlighted: false,
  },
];

export interface PricingDisplay {
  name: string;
  fullPrice: string;
  reducedPrice: string;
  includes: string[];
  highlighted: boolean;
}

/**
 * Format pricing tiers for display with translated labels.
 * @param locale - 'fr' or 'en'
 * @param t - translation function from useTranslations(locale)
 */
export function getPricing(
  locale: 'fr' | 'en',
  t: (key: string) => string,
): PricingDisplay[] {
  return pricingTiers.map((tier) => {
    const nameKey = `tickets.${tier.key}` as string;
    const priceSuffix = locale === 'fr' ? ' €' : '€';
    return {
      name: t(nameKey),
      fullPrice: `${tier.fullPrice}${priceSuffix}`,
      reducedPrice: `${tier.reducedPrice}${priceSuffix}`,
      includes: tier.includesKeys.map((k) => t(`tickets.${k}`)),
      highlighted: tier.highlighted,
    };
  });
}
