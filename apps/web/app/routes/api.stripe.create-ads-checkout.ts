import { type ActionFunctionArgs, redirect } from "@remix-run/node"
import { z } from "zod"
import { stripe } from "~/services.server/stripe"

export const stripeAdsCheckoutSchema = z.object({
  ads: z.array(
    z.object({
      type: z.enum(["Homepage", "Banner"]),
      price: z.coerce.number(),
      duration: z.coerce.number(),
      metadata: z.object({
        startDate: z.coerce.number(),
        endDate: z.coerce.number(),
      }),
    }),
  ),
})

export type StripeAdsCheckoutSchema = z.infer<typeof stripeAdsCheckoutSchema>

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.json()
  const { ads } = stripeAdsCheckoutSchema.parse(data)
  const customer = await stripe.customers.create()

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customer.id,
    customer_update: {
      name: "auto",
      address: "auto",
    },
    line_items: ads.map(({ type, price, duration }) => ({
      price_data: {
        unit_amount: Math.round(price * 100),
        currency: "usd",
        // product: process.env.STRIPE_PRODUCT_ID,
        product_data: { name: `${type} Advertisement` },
      },
      quantity: duration,
    })),
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
    metadata: {
      ads: JSON.stringify(
        ads.map(({ type, metadata }) => ({
          type,
          startsAt: metadata.startDate,
          endsAt: metadata.endDate,
        })),
      ),
    },
    allow_promotion_codes: true,
    automatic_tax: { enabled: true },
    tax_id_collection: { enabled: true },
    invoice_creation: { enabled: true },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/advertise?subscribed=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/advertise?cancelled=true`,
  })

  if (!checkout.url) {
    throw new Error("Unable to create a new Stripe Checkout Session.")
  }

  return redirect(checkout.url)
}
