import { getErrorMessage } from "@curiousleaf/utils"
import type { ActionFunctionArgs } from "@remix-run/node"
import type Stripe from "stripe"
import { prisma } from "~/services.server/prisma"
import { stripe } from "~/services.server/stripe"

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

        // TODO: Send submission email to user and inform admin

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

        await prisma.tool.update({
          where: { slug: metadata?.tool },
          data: { isFeatured: subscription.status === "active" },
        })

        if (event.type === "customer.subscription.created") {
          // TODO: Send admin email about new featured listing
        }

        if (event.type === "customer.subscription.deleted") {
          // TODO: Send admin email about deleted featured listing
        }

        break
      }
    }
  } catch (error) {
    console.log(error)
    return new Response("Webhook handler failed. Check the logs.", { status: 400 })
  }

  return new Response(JSON.stringify({ received: true }))
}
