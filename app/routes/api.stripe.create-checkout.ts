import { ActionFunctionArgs, TypedResponse, json } from "@remix-run/node";
import { createStripeCheckoutSession, stripeCheckoutSchema } from "~/services.server/stripe";

export type ActionState = { type: "error"; error: string } | { type: "success"; url: string | null }

export async function action({ request }: ActionFunctionArgs): Promise<TypedResponse<ActionState>> {
  try {
    const data = await request.json()
    const parsedData = stripeCheckoutSchema.parse(data)
    const url = await createStripeCheckoutSession(parsedData)

    // Return a success response
    return json({ type: "success", url })
  } catch (error) {
    console.log(error)
    return json({ type: "error", error: "An unknown error occurred. Please try again." })
  }
}
