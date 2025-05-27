import { revalidateTag } from "next/cache"
import { after } from "next/server"
import type Stripe from "stripe"
import { env } from "~/env"
import { notifyAdminOfPremiumTool, notifySubmitterOfPremiumTool } from "~/lib/notifications"
import { db } from "~/services/db"
import { stripe } from "~/services/stripe"

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
        const { metadata } = session

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

        // TODO: THIS IS NOT WORKING  because the metadata is set on the checkout session, not the subscription
        // Handle alternative ads
        if (metadata?.ads) {
          // Update the ad for the subscription
          await db.ad.update({
            where: { subscriptionId: subscription.id },
            data: { endsAt: new Date(), alternatives: { set: [] } },
          })

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
