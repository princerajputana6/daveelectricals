import Stripe from "stripe";

let cached: Stripe | null = null;

/** Server-side Stripe client. Never import this into client components. */
export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set in environment variables (.env.local).",
    );
  }
  cached = new Stripe(key);
  return cached;
}

/** Publishable key — safe to expose to the browser. */
export const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
