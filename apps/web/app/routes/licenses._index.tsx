import { type MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { LicenseRecord } from "~/components/records/license-record"
import { Grid } from "~/components/ui/grid"
import { Intro } from "~/components/ui/intro"
import { licenseManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"
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
  const licenses = await prisma.license.findMany({
    where: { tools: { some: { publishedAt: { lte: new Date() } } } },
    orderBy: { tools: { _count: "desc" } },
    include: licenseManyPayload,
  })

  const meta = {
    title: "Best Open Source Software Licenses",
    description:
      "Browse top open source software licenses and learn about their terms and conditions.",
  }

  return json({ meta, licenses }, { headers: JSON_HEADERS })
}

export default function LicensesIndex() {
  const { meta, licenses } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />

      <Grid className="md:gap-8">
        {licenses.map(license => (
          <LicenseRecord key={license.slug} license={license} />
        ))}

        {!licenses.length && <p className="col-span-full">No licenses found.</p>}
      </Grid>
    </>
  )
}
