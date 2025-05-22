"use server"

import { AdType } from "@prisma/client"
import type Stripe from "stripe"
import { z } from "zod"
import { createServerAction } from "zsa"
import { env } from "~/env"
import { stripe } from "~/services/stripe"

const adCheckoutCustomFields = [
  {
    key: "name",
    label: { type: "custom", custom: "Company Name" },
    type: "text",
  },
  {
    key: "description",
    label: { type: "custom", custom: "Description" },
    type: "text",
    optional: true,
  },
  {
    key: "website",
    label: { type: "custom", custom: "Website URL" },
    type: "text",
  },
] satisfies Stripe.Checkout.SessionCreateParams.CustomField[]

export const createStripeToolCheckout = createServerAction()
  .input(
    z.object({
      priceId: z.string(),
      tool: z.string(),
      mode: z.enum(["subscription", "payment"]),
      coupon: z.string().optional(),
    }),
  )
  .handler(async ({ input: { priceId, tool, mode, coupon } }) => {
    const checkout = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${env.NEXT_PUBLIC_SITE_URL}/submit/${tool}?success=true`,
      cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/submit/${tool}?cancelled=true`,
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      invoice_creation: mode === "payment" ? { enabled: true } : undefined,
      metadata: mode === "payment" ? { tool } : undefined,
      subscription_data: mode === "subscription" ? { metadata: { tool } } : undefined,
      allow_promotion_codes: coupon ? undefined : true,
      discounts: coupon ? [{ coupon }] : undefined,
    })

    if (!checkout.url) {
      throw new Error("Unable to create a new Stripe Checkout Session.")
    }

    // Return the checkout session url
    return checkout.url
  })

export const createStripeAdsCheckout = createServerAction()
  .input(
    z.array(
      z.object({
        type: z.nativeEnum(AdType),
        price: z.coerce.number(),
        duration: z.coerce.number(),
        metadata: z.object({
          startDate: z.coerce.number(),
          endDate: z.coerce.number(),
        }),
      }),
    ),
  )
  .handler(async ({ input: ads }) => {
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_creation: "if_required",
      line_items: ads.map(({ type, price, duration }) => ({
        price_data: {
          product_data: { name: `${type} Ad` },
          unit_amount: Math.round(price * 100),
          currency: "usd",
        },
        quantity: duration,
      })),
      custom_fields: adCheckoutCustomFields,
      metadata: {
        ads: JSON.stringify(
          ads.map(({ type, metadata }) => ({
            type,
            startsAt: metadata.startDate,
            endsAt: metadata.endDate,
          })),
        ),
      },
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      invoice_creation: { enabled: true },
      success_url: `${env.NEXT_PUBLIC_SITE_URL}/advertise?subscribed=true`,
      cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/advertise?cancelled=true`,
    })

    if (!checkout.url) {
      throw new Error("Unable to create a new Stripe Checkout Session.")
    }

    // Return the checkout session url
    return checkout.url
  })

export const createStripeAlternativeAdsCheckout = createServerAction()
  .input(
    z.object({
      type: z.nativeEnum(AdType),
      alternatives: z.array(z.object({ slug: z.string(), name: z.string(), price: z.number() })),
    }),
  )
  .handler(async ({ input: { type, alternatives } }) => {
    const ads = [{ type, alternatives: alternatives.map(({ slug }) => slug) }]

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: alternatives.map(({ name, price }) => ({
        price_data: {
          product_data: { name },
          unit_amount: Math.round(price * 100),
          currency: "usd",
          recurring: { interval: "month" },
        },
        quantity: 1,
      })),
      custom_fields: adCheckoutCustomFields,
      subscription_data: { metadata: { ads: JSON.stringify(ads) } },
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      success_url: `${env.NEXT_PUBLIC_SITE_URL}/advertise/alternatives?success=true`,
      cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/advertise/alternatives?cancelled=true`,
    })

    if (!checkout.url) {
      throw new Error("Unable to create a new Stripe Checkout Session.")
    }

    // Return the checkout session url
    return checkout.url
  })
