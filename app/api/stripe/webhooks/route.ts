import { getUrlHostname } from "@curiousleaf/utils"
import { AdType } from "@prisma/client"
import { addYears } from "date-fns"
import { revalidateTag } from "next/cache"
import { after } from "next/server"
import type Stripe from "stripe"
import { z } from "zod"
import { env } from "~/env"
import { uploadFavicon } from "~/lib/media"
import { notifyAdminOfPremiumTool, notifySubmitterOfPremiumTool } from "~/lib/notifications"
import { db } from "~/services/db"
import { stripe } from "~/services/stripe"

/**
 * Get the custom fields from the checkout session
 * @param customFields - The custom fields from the checkout session
 * @returns The custom fields
 */
const getAdCustomFields = (customFields: Stripe.Checkout.Session.CustomField[]) => {
  return {
    name: customFields?.find(({ key }) => key === "name")?.text?.value || "",
    description: customFields?.find(({ key }) => key === "description")?.text?.value ?? "",
    websiteUrl: customFields?.find(({ key }) => key === "website")?.text?.value || "",
  }
}

/**
 * Get the favicon URL for the ad
 * @param url - The URL of the ad
 * @returns The favicon URL
 */
const getAdFaviconUrl = async (url: string) => {
  return await uploadFavicon(url, `ads/${getUrlHostname(url)}`)
}

/**
 * Handle the Stripe webhook
 * @param req - The request
 * @returns The response
 */
export const POST = async (req: Request) => {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") as string
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET
  let event: Stripe.Event

  try {
    if (!signature || !webhookSecret) {
      return new Response("Webhook secret not found.", { status: 400 })
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        const { metadata, custom_fields } = session
        const email = session.customer_details?.email ?? ""

        switch (session.mode) {
          case "payment": {
            // Handle tool expedited payment
            if (metadata?.tool) {
              const tool = await db.tool.findUniqueOrThrow({
                where: { slug: metadata.tool },
              })

              // Notify the submitter of the premium tool
              after(async () => await notifySubmitterOfPremiumTool(tool))

              // Notify the admin of the premium tool
              after(async () => await notifyAdminOfPremiumTool(tool))
            }

            // Handle sponsoring/ads payment
            if (metadata?.ads) {
              const ads = JSON.parse(metadata.ads)

              const adsSchema = z.array(
                z.object({
                  type: z.nativeEnum(AdType),
                  startsAt: z.coerce.number().transform(date => new Date(date)),
                  endsAt: z.coerce.number().transform(date => new Date(date)),
                }),
              )

              for (const ad of adsSchema.parse(ads)) {
                const customFields = getAdCustomFields(custom_fields)
                const faviconUrl = await getAdFaviconUrl(customFields.websiteUrl)

                await db.ad.create({
                  data: { email, faviconUrl, ...customFields, ...ad },
                })

                // Revalidate the ads
                revalidateTag("ads")
              }
            }

            break
          }

          case "subscription": {
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

            // Handle tool featured listing
            if (subscription.metadata?.tool) {
              const tool = await db.tool.update({
                where: { slug: subscription.metadata.tool },
                data: { isFeatured: true },
              })

              // Revalidate the cache
              revalidateTag("tools")

              // Notify the submitter of the premium tool
              after(async () => await notifySubmitterOfPremiumTool(tool))

              // Notify the admin of the premium tool
              after(async () => await notifyAdminOfPremiumTool(tool))
            }

            // Handle ads
            if (subscription.metadata?.ads) {
              const ads = JSON.parse(subscription.metadata.ads)

              const adsSchema = z.array(
                z.object({
                  type: z.nativeEnum(AdType),
                  alternatives: z.array(z.string()),
                }),
              )

              for (const { type, alternatives } of adsSchema.parse(ads)) {
                const customFields = getAdCustomFields(custom_fields)
                const faviconUrl = await getAdFaviconUrl(customFields.websiteUrl)
                const subscriptionId = subscription.id
                const startsAt = new Date()
                const endsAt = addYears(startsAt, 10)

                await db.ad.create({
                  data: {
                    email,
                    faviconUrl,
                    subscriptionId,
                    startsAt,
                    endsAt,
                    type,
                    ...customFields,
                    alternatives: { connect: alternatives.map(slug => ({ slug })) },
                  },
                })

                // Revalidate the cache
                revalidateTag("ads")
                revalidateTag("alternatives")
              }
            }

            break
          }
        }

        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object
        const metadata = subscription.metadata

        // Handle tool featured listing
        if (metadata?.tool) {
          await db.tool.update({
            where: { slug: metadata?.tool },
            data: { isFeatured: false },
          })

          // Revalidate the cache
          revalidateTag("tools")
        }

        // Handle alternative ads
        if (metadata?.ads) {
          // Delete all ads for the subscription
          await db.ad.deleteMany({ where: { subscriptionId: subscription.id } })

          // Revalidate the cache
          revalidateTag("ads")
          revalidateTag("alternatives")
        }

        break
      }
    }
  } catch (error) {
    console.log(error)

    return new Response("Webhook handler failed", { status: 400 })
  }

  return new Response(JSON.stringify({ received: true }))
}
