import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Grid } from "apps/web/app/components/Grid"
import { Intro } from "apps/web/app/components/Intro"
import { LicenseRecord } from "apps/web/app/partials/records/LicenseRecord"
import { licenseManyPayload } from "apps/web/app/services.server/api"
import { prisma } from "apps/web/app/services.server/prisma"
import { JSON_HEADERS } from "apps/web/app/utils/constants"
import { getMetaTags } from "apps/web/app/utils/meta"

export const meta: MetaFunction<typeof loader> = ({ matches, data, location }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    location,
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const licenses = await prisma.license.findMany({
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
