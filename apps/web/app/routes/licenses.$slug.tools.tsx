import {
  type HeadersFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
} from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { ToolRecord } from "~/components/records/tool-record"
import { BackButton } from "~/components/ui/back-button"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"
import { Grid } from "~/components/ui/grid"
import { Intro } from "~/components/ui/intro"
import { type LicenseOne, licenseOnePayload, toolOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"
import { combineServerTimings, makeTimings, time } from "~/utils/timing.server"

export const handle = {
  breadcrumb: (data?: { license: LicenseOne }) => {
    if (!data?.license) return <BackButton to="/licenses" />

    const { slug, name } = data.license

    return <BreadcrumbsLink to={`/licenses/${slug}/tools`} label={name} />
  },
}

export const meta: MetaFunction<typeof loader> = ({ matches, data, location }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    location,
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const headers: HeadersFunction = ({ loaderHeaders, parentHeaders }) => {
  return {
    "Server-Timing": combineServerTimings(parentHeaders, loaderHeaders),
  }
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  const timings = makeTimings("license loader")

  try {
    const [license, tools] = await Promise.all([
      time(
        () =>
          prisma.license.findUniqueOrThrow({
            where: { slug },
            include: licenseOnePayload,
          }),
        { type: "find license", timings },
      ),
      time(
        () =>
          prisma.tool.findMany({
            where: { license: { slug }, publishedAt: { lte: new Date() } },
            include: toolOnePayload,
            orderBy: [{ isFeatured: "desc" }, { score: "desc" }],
          }),
        { type: "find tools", timings },
      ),
    ])

    const meta = {
      title: `${license.name} Licensed Open Source Software`,
      description: `A curated collection of the ${tools.length} best open source software licensed under ${license.name}. Find the best tools, libraries, and frameworks for your next project.`,
    }

    return json(
      { meta, license, tools },
      { headers: { "Server-Timing": timings.toString(), ...JSON_HEADERS } },
    )
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function LicensesToolsPage() {
  const { meta, license, tools } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />

      <Grid>
        {tools.map(tool => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}

        {!tools?.length && <p className="col-span-full">No Open Source software found.</p>}
      </Grid>

      <BackButton to={`/licenses/${license.slug}`} />
    </>
  )
}
