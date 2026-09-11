export const PLANS = {
  basic: { label: "Basic", priceIqd: 15000, maxDoctors: 1 },
  pro: { label: "Pro", priceIqd: 30000, maxDoctors: 5 },
  business: { label: "Business", priceIqd: 50000, maxDoctors: Infinity },
} as const;

export type PlanKey = keyof typeof PLANS;
