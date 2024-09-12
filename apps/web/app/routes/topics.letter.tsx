import { type MetaFunction, json } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { Intro } from "~/components/ui/intro"
import { LetterPicker } from "~/components/ui/letter-picker"
import { getMetaTags } from "~/utils/meta"

export const meta: MetaFunction<typeof loader> = ({ matches, data, location }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    location,
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = async () => {
  const meta = {
    title: "Open Source Software Topics",
    description: "Browse top topics to find your best Open Source software options.",
  }

  return json({ meta })
}

export default function TopicsLetterIndex() {
  const { meta } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />
      <LetterPicker path="/topics/letter" />
      <Outlet />
    </>
  )
}
