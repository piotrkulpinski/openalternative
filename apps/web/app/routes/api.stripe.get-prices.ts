import { type ActionFunctionArgs, json } from "@remix-run/node"
import { z } from "zod"
import { stripe } from "~/services.server/stripe"
import { JSON_HEADERS } from "~/utils/constants"

export const stripeGetPricesSchema = z.object({
  productId: z.string(),
})

export type StripeGetPricesSchema = z.infer<typeof stripeGetPricesSchema>

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.json()
  const parsedData = stripeGetPricesSchema.parse(data)

  const prices = await stripe.prices.list({
    active: true,
    product: parsedData.productId,
  })

  return json({ prices: prices.data }, { headers: JSON_HEADERS })
}
