"use server"

import { getUrlHostname } from "@curiousleaf/utils"
import { AdType, type Prisma } from "@prisma/client"
import { revalidateTag } from "next/cache"
import { z } from "zod"
import { createServerAction } from "zsa"
import { env } from "~/env"
import { uploadFavicon } from "~/lib/media"
import { adDetailsSchema } from "~/server/web/shared/schema"
import { db } from "~/services/db"
import { stripe } from "~/services/stripe"
import { tryCatch } from "~/utils/helpers"

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
      success_url: `${env.NEXT_PUBLIC_SITE_URL}/submit/${tool}/success`,
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
    const adData = ads.map(({ type, metadata }) => ({
      type,
      startsAt: metadata.startDate,
      endsAt: metadata.endDate,
    }))

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
      metadata: { ads: JSON.stringify(adData) },
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      invoice_creation: { enabled: true },
      success_url: `${env.NEXT_PUBLIC_SITE_URL}/advertise/success?sessionId={CHECKOUT_SESSION_ID}`,
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
    const adData = [{ type, alternatives: alternatives.map(({ slug }) => slug) }]

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
      subscription_data: { metadata: { ads: JSON.stringify(adData) } },
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      success_url: `${env.NEXT_PUBLIC_SITE_URL}/advertise/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/advertise/alternatives?cancelled=true`,
    })

    if (!checkout.url) {
      throw new Error("Unable to create a new Stripe Checkout Session.")
    }

    // Return the checkout session url
    return checkout.url
  })

export const createAdFromCheckout = createServerAction()
  .input(
    adDetailsSchema.extend({
      sessionId: z.string(),
    }),
  )
  .handler(async ({ input: { sessionId, ...adDetails } }) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const email = session.customer_details?.email ?? ""
    const ads: Omit<Omit<Prisma.AdCreateInput, "email">, keyof typeof adDetails>[] = []

    if (session.status !== "complete") {
      throw new Error("Checkout session is not complete")
    }

    // Upload favicon
    const websiteUrl = getUrlHostname(adDetails.websiteUrl)
    const { data: faviconUrl } = await tryCatch(uploadFavicon(websiteUrl, `ads/${websiteUrl}`))

    // Check if ads already exist for specific sessionId
    const existingAds = await db.ad.findMany({
      where: { sessionId },
    })

    // If ads already exist, update them
    if (existingAds.length) {
      await db.ad.updateMany({
        where: { sessionId },
        data: { ...adDetails, faviconUrl },
      })

      // Revalidate the cache
      revalidateTag("ads")
      revalidateTag("alternatives")

      return { success: true }
    }

    switch (session.mode) {
      // Handle one-time payment ads
      case "payment": {
        if (!session.metadata?.ads) {
          throw new Error("Invalid session for ad creation")
        }

        const adsSchema = z.array(
          z.object({
            type: z.nativeEnum(AdType),
            startsAt: z.coerce.number().transform(date => new Date(date)),
            endsAt: z.coerce.number().transform(date => new Date(date)),
          }),
        )

        // Parse the ads from the session metadata
        const parsedAds = adsSchema.parse(JSON.parse(session.metadata.ads))

        // Add ads to create later
        ads.push(...parsedAds)

        break
      }

      // Handle subscription-based ads
      case "subscription": {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

        if (!subscription.metadata?.ads) {
          throw new Error("Invalid session for ad creation")
        }

        const adsSchema = z.array(
          z.object({
            type: z.nativeEnum(AdType),
            alternatives: z.array(z.string()),
          }),
        )

        // Parse the ads from the session metadata
        const parsedAds = adsSchema.parse(JSON.parse(subscription.metadata.ads))

        // Add ads to create later
        ads.push(
          ...parsedAds.map(({ type, alternatives }) => ({
            type,
            subscriptionId: subscription.id,
            startsAt: new Date(),
            endsAt: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
            alternatives: { connect: alternatives.map(slug => ({ slug })) },
          })),
        )

        break
      }

      default: {
        throw new Error("Invalid session for ad creation")
      }
    }

    // Create ads in a transaction
    await db.$transaction(
      ads.map(ad => db.ad.create({ data: { ...ad, ...adDetails, email, faviconUrl, sessionId } })),
    )

    // Revalidate the cache
    revalidateTag("ads")
    revalidateTag("alternatives")

    return { success: true }
  })
