import { getErrorMessage } from "@curiousleaf/utils"
import { type ActionFunctionArgs, json } from "@remix-run/node"
import type Stripe from "stripe"
import { z } from "zod"
import { prisma } from "~/services.server/prisma"
import { stripe } from "~/services.server/stripe"

export const action = async ({ request }: ActionFunctionArgs) => {
  const payload = await request.text()
  const signature = request.headers.get("stripe-signature")
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? ""

  let event: Stripe.Event

  // Make sure the event is valid
  if (!signature) {
    throw json(null, { status: 403, statusText: "Invalid signature" })
  }

  try {
    // Constructs and verifies the signature of an Event.
    event = stripe.webhooks.constructEvent(payload, signature, secret)
  } catch (error) {
    throw json(null, { status: 500, statusText: getErrorMessage(error) })
  }

  // Webhook Events.
  switch (event?.type) {
    // This event is sent when a Checkout Session has been successfully completed.
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session

      const schema = z.object({
        email: z.string().email(),
        name: z.string(),
        description: z.string().optional(),
        website: z.string(),
        startsAt: z.coerce.number().transform(date => new Date(date)),
        endsAt: z.coerce.number().transform(date => new Date(date)),
      })

      const data = schema.parse({
        email: session.customer_details?.email,
        name: session.custom_fields?.find(({ key }) => key === "name")?.text?.value,
        description: session.custom_fields?.find(({ key }) => key === "description")?.text?.value,
        website: session.custom_fields?.find(({ key }) => key === "website")?.text?.value,
        startsAt: session.metadata?.startDate,
        endsAt: session.metadata?.endDate,
      })

      // Do something with the session
      await prisma.sponsoring.create({ data })

      return json({}, { status: 200 })
    }
  }

  // Possible status returns: 200 | 404.
  return json({}, { status: 200 })
}
