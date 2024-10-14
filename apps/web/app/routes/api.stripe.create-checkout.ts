import { type ActionFunctionArgs, json } from "@remix-run/node"
import { z } from "zod"
import { stripe } from "~/services.server/stripe"

export const stripeCheckoutSchema = z.object({
  priceId: z.string(),
  tool: z.string(),
  mode: z.enum(["subscription", "payment"]),
})

export type StripeCheckoutSchema = z.infer<typeof stripeCheckoutSchema>

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.json()
  const { priceId, tool, mode } = stripeCheckoutSchema.parse(data)

  const checkout = await stripe.checkout.sessions.create({
    mode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/submit/${tool}/thanks`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/submit/${tool}?cancelled=true`,
    allow_promotion_codes: true,
    automatic_tax: { enabled: true },
    tax_id_collection: { enabled: true },
    invoice_creation: mode === "payment" ? { enabled: true } : undefined,
    metadata: mode === "payment" ? { tool } : undefined,
    subscription_data: mode === "subscription" ? { metadata: { tool } } : undefined,
  })

  if (!checkout.url) {
    throw new Error("Unable to create a new Stripe Checkout Session.")
  }

  // Return a success response
  return json({ url: checkout.url })
}
