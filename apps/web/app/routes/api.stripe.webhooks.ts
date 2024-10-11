import { getErrorMessage } from "@curiousleaf/utils"
import type { ActionFunctionArgs } from "@remix-run/node"
import type Stripe from "stripe"
import { prisma } from "~/services.server/prisma"
import { stripe } from "~/services.server/stripe"

const relevantEvents = new Set([
  "payment_intent.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
])

export const loader = () => {
  return new Response("Invalid request", { status: 400 })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const payload = await request.text()
  const signature = request.headers.get("stripe-signature")
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? ""

  let event: Stripe.Event

  // Make sure the event is valid
  if (!signature) {
    return new Response("Invalid signature", { status: 403 })
  }

  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret)
  } catch (error) {
    return new Response(getErrorMessage(error), { status: 500 })
  }

  if (!relevantEvents.has(event.type)) {
    return new Response("Webhook not relevant", { status: 200 })
  }

  try {
    switch (event.type) {
      case "payment_intent.created": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const { tool: slug } = paymentIntent.metadata as Stripe.Metadata

        if (slug) {
          console.log("paid", slug)
          // TODO: Send admin email about new expedited listing
        }

        break
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const { tool: slug } = subscription.metadata as Stripe.Metadata

        if (slug) {
          const isFeatured = subscription.status === "active"

          await prisma.tool.update({
            where: { slug },
            data: { isFeatured },
          })
        }

        break
      }

      default:
        throw new Response("Unhandled relevant event!", { status: 500 })
    }
  } catch (error) {
    console.log(error)
    return new Response("Webhook handler failed. Check the logs.", { status: 400 })
  }

  return new Response(JSON.stringify({ received: true }))
}
