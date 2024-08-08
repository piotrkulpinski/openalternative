import Stripe from "stripe"
import { z } from "zod"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-04-10",
})

export const stripeCheckoutSchema = z.object({
  price: z.coerce.number(),
  quantity: z.coerce.number(),
  metadata: z.object({
    startDate: z.coerce.number(),
    endDate: z.coerce.number(),
  }),
})

export type StripeCheckoutSchema = z.infer<typeof stripeCheckoutSchema>

export const createStripeCheckoutSession = async ({
  price,
  quantity,
  metadata,
}: StripeCheckoutSchema) => {
  const customer = await stripe.customers.create()

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customer.id,
    customer_update: {
      name: "auto",
      address: "auto",
    },
    line_items: [
      {
        price_data: {
          unit_amount: Math.round(price * 100),
          currency: "usd",
          product: process.env.STRIPE_PRODUCT_ID,
        },
        quantity,
      },
    ],
    custom_fields: [
      {
        key: "name",
        label: { type: "custom", custom: "Company Name" },
        type: "text",
      },
      {
        key: "description",
        label: { type: "custom", custom: "Description" },
        type: "text",
        optional: true,
      },
      {
        key: "website",
        label: { type: "custom", custom: "Website URL" },
        type: "text",
      },
    ],
    metadata,
    allow_promotion_codes: true,
    automatic_tax: { enabled: true },
    tax_id_collection: { enabled: true },
    invoice_creation: { enabled: true },
    success_url: `${process.env.VITE_SITE_URL}/?subscribed=true`,
    cancel_url: `${process.env.VITE_SITE_URL}/?cancelled=true`,
  })

  // Returns newly created Checkout Session as URL.
  return session.url
}
