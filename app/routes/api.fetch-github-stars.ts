import type { LoaderFunctionArgs } from "@remix-run/node"
import { z } from "zod"
import { getAllGithubStars } from "~/utils/github"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const searchParams = Object.fromEntries(url.searchParams)

  const schema = z.object({
    owner: z.string(),
    name: z.string(),
  })

  const { owner, name } = schema.parse(searchParams)

  const starsMonth = await getAllGithubStars(owner, name)

  for (const stars of starsMonth) {
    console.log(stars.stars)
    console.log({
      month: stars.date.month,
      year: stars.date.year,
      day: stars.date.day,
    })
  }

  return null
}
