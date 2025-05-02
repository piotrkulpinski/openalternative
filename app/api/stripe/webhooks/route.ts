import { AdType } from "@prisma/client"
import { revalidateTag } from "next/cache"
import { after } from "next/server"
import type Stripe from "stripe"
import { z } from "zod"
import { env } from "~/env"
import { notifyAdminOfPremiumTool, notifySubmitterOfPremiumTool } from "~/lib/notifications"
import { db } from "~/services/db"
import { stripe } from "~/services/stripe"

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
        const { mode, metadata, custom_fields: fields, customer_details: user } = event.data.object

        if (mode !== "payment") {
          break
        }

        // Handle tool expedited payment
        if (metadata?.tool) {
          const tool = await db.tool.findUniqueOrThrow({
            where: { slug: metadata.tool },
          })

          // Revalidate the tools
          revalidateTag("tools")

          // Notify the submitter of the premium tool
          after(async () => await notifySubmitterOfPremiumTool(tool))

          // Notify the admin of the premium tool
          after(async () => await notifyAdminOfPremiumTool(tool))
        }

        // Handle sponsoring/ads payment
        if (metadata?.ads) {
          const adsSchema = z.array(
            z.object({
              type: z.nativeEnum(AdType),
              startsAt: z.coerce.number().transform(date => new Date(date)),
              endsAt: z.coerce.number().transform(date => new Date(date)),
            }),
          )

          for (const ad of adsSchema.parse(JSON.parse(metadata.ads))) {
            await db.ad.create({
              data: {
                email: user?.email ?? "",
                name: fields?.find(({ key }) => key === "name")?.text?.value || "",
                description: fields?.find(({ key }) => key === "description")?.text?.value ?? "",
                websiteUrl: fields?.find(({ key }) => key === "website")?.text?.value || "",
                ...ad,
              },
            })

            // Revalidate the ads
            revalidateTag("ads")
          }
        }

        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object
        const metadata = subscription.metadata

        if (!metadata?.tool) {
          break
        }

        const tool = await db.tool.update({
          where: { slug: metadata?.tool },
          data: { isFeatured: subscription.status === "active" },
        })

        // Revalidate the tools
        revalidateTag("tools")

        if (event.type === "customer.subscription.created") {
          // Notify the submitter of the premium tool
          after(async () => await notifySubmitterOfPremiumTool(tool))

          // Notify the admin of the premium tool
          after(async () => await notifyAdminOfPremiumTool(tool))
        }

        if (event.type === "customer.subscription.deleted") {
          // TODO: Send admin email about deleted featured listing
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
