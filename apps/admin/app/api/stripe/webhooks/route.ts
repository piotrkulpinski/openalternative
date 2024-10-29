import type Stripe from "stripe"
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
        const checkoutSession = event.data.object
        const metadata = checkoutSession.metadata

        if (!metadata?.tool || checkoutSession.mode !== "payment") {
          break
        }

        const tool = await prisma.tool.findUniqueOrThrow({
          where: { slug: metadata.tool },
        })

        // Send an event to the Inngest pipeline
        await inngest.send({ name: "tool.expedited", data: { slug: tool.slug } })

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
