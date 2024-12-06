import { AdType } from "@prisma/client"
import { revalidateTag } from "next/cache"
import type Stripe from "stripe"
import { z } from "zod"
import { env } from "~/env"
import { inngest } from "~/services/inngest"
import { prisma } from "~/services/prisma"
import { stripe } from "~/services/stripe"

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature") as string
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
          const tool = await prisma.tool.findUniqueOrThrow({
            where: { slug: metadata.tool },
          })

          // Send an event to the Inngest pipeline
          await inngest.send({ name: "tool.expedited", data: { slug: tool.slug } })
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
            await prisma.ad.create({
              data: {
                email: user?.email ?? "",
                name: fields?.find(({ key }) => key === "name")?.text?.value || "",
                description: fields?.find(({ key }) => key === "description")?.text?.value ?? "",
                website: fields?.find(({ key }) => key === "website")?.text?.value || "",
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

        const tool = await prisma.tool.update({
          where: { slug: metadata?.tool },
          data: { isFeatured: subscription.status === "active" },
        })

        if (event.type === "customer.subscription.created") {
          // Send an event to the Inngest pipeline
          await inngest.send({ name: "tool.featured", data: { slug: tool.slug } })
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
