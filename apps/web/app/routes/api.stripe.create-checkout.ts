import { type ActionFunctionArgs, json } from "@remix-run/node"
import { z } from "zod"
import { stripe } from "~/services.server/stripe"

export const stripeCheckoutSchema = z.object({
  priceId: z.string(),
  slug: z.string(),
  mode: z.enum(["subscription", "payment"]),
})

export type StripeCheckoutSchema = z.infer<typeof stripeCheckoutSchema>

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.json()
  const parsedData = stripeCheckoutSchema.parse(data)
  const { priceId, slug, mode } = parsedData

  const checkout = await stripe.checkout.sessions.create({
    mode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/submit/thanks?subscribed=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/submit/${slug}?cancelled=true`,
    allow_promotion_codes: true,
    automatic_tax: { enabled: true },
    tax_id_collection: { enabled: true },
    invoice_creation: mode === "payment" ? { enabled: true } : undefined,
    subscription_data: mode === "subscription" ? { metadata: { slug } } : undefined,
    payment_intent_data: mode === "payment" ? { metadata: { slug } } : undefined,
  })

  if (!checkout.url) {
    throw new Error("Unable to create a new Stripe Checkout Session.")
  }

  // Return a success response
  return json({ url: checkout.url })
}
