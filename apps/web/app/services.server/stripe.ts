import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-09-30.acacia",
})

export const getProductsWithPrices = async (productIds: string[]): Promise<Stripe.Product[]> => {
  try {
    const products = await stripe.products.list({
      active: true,
      ids: productIds,
    })

    const productsWithPrices = await Promise.all(
      products.data.map(async product => {
        const prices = await stripe.prices.list({
          active: true,
          product: product.id,
        })

        return {
          ...product,
          prices: prices.data,
        }
      }),
    )

    return productsWithPrices
  } catch (error) {
    console.error("Error fetching products with prices:", error)
    throw error
  }
}
