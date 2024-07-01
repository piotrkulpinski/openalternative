import { Category } from "@prisma/client"
import {
  HeadersFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
  SerializeFrom,
  json,
} from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { ArrowUpRightIcon } from "lucide-react"
import { Fragment, ReactNode } from "react"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Button } from "~/components/Button"
import { Card } from "~/components/Card"
import { Favicon } from "~/components/Favicon"
import { H3 } from "~/components/Heading"
import { Intro } from "~/components/Intro"
import { Prose } from "~/components/Prose"
import { ToolEntry } from "~/components/records/ToolEntry"
import { type AlternativeOne, alternativeOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"
import { combineServerTimings, makeTimings, time } from "~/utils/timing.server"

export const handle = {
  breadcrumb: (data?: { alternative: AlternativeOne }) => {
    if (!data?.alternative) return <BackButton to="/" />

    const { slug, name } = data.alternative

    return <BreadcrumbsLink to={`/alternatives/${slug}`} label={name} />
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
  const timings = makeTimings("alternative loader")

  try {
    const [alternative, tools] = await Promise.all([
      time(
        () =>
          prisma.alternative.findUniqueOrThrow({
            where: { slug },
            include: alternativeOnePayload,
          }),
        { type: "find alternative", timings },
      ),

      time(
        () =>
          prisma.tool.findMany({
            where: {
              alternatives: { some: { alternative: { slug } } },
              publishedAt: { lte: new Date() },
            },
            include: { categories: { include: { category: true } } },
            orderBy: [{ isFeatured: "desc" }, { score: "desc" }],
          }),
        { type: "find tools", timings },
      ),
    ])

    const meta = {
      title: `Best Open Source ${alternative.name} Alternatives`,
      description: `A collection of the best open source ${alternative.name} alternatives. Find the best alternatives for ${alternative.name} that are open source and free to use/self-hostable.`,
    }

    return json(
      { meta, alternative, tools },
      { headers: { "Server-Timing": timings.toString(), ...JSON_HEADERS } },
    )
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function AlternativesPage() {
  const { meta, alternative, tools } = useLoaderData<typeof loader>()

  const categories = tools.reduce<
    Record<string, { count: number; category: SerializeFrom<Category> }>
  >((acc, { categories }) => {
    categories.forEach(({ category }) => {
      if (!acc[category.name]) {
        acc[category.name] = { count: 0, category }
      }
      acc[category.name].count += 1
    })

    return acc
  }, {})

  const bestAlternatives: ReactNode[] = tools.slice(0, 5).map(tool => (
    <Link to={`/${tool.slug}`} prefetch="intent" unstable_viewTransition>
      {tool.name}
    </Link>
  ))

  const popularCategories = Object.values(categories)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(({ category }) => (
      <Link to={`/categories/${category.slug}`} unstable_viewTransition>
        {category.label || category.name}
      </Link>
    ))

  return (
    <>
      <Intro
        title={meta.title}
        description={`Find the best alternatives to ${alternative.name} that are open source and free to use/self-hostable.`}
      />

      <div className="grid items-start gap-6 md:grid-cols-3">
        {!!tools.length && (
          <Prose className="order-last md:order-first md:col-span-2">
            <p>
              The best open source alternative to {alternative.name} is {bestAlternatives.shift()}.
              If that doesn't suit you, we've compiled a ranked list of other open source{" "}
              {alternative.name} alternatives to help you find a suitable replacement.
              {!!bestAlternatives.length && (
                <>
                  {" "}
                  Other interesting open source
                  {bestAlternatives.length === 1
                    ? ` alternative to ${alternative.name} is `
                    : ` alternatives to ${alternative.name} are: `}
                  {bestAlternatives.map((alt, index) => (
                    <Fragment key={index}>
                      {index > 0 && index !== bestAlternatives.length - 1 && ", "}
                      {index > 0 && index === bestAlternatives.length - 1 && " and "}
                      {alt}
                    </Fragment>
                  ))}
                  .
                </>
              )}
            </p>

            {!!popularCategories.length && (
              <p>
                {alternative.name} alternatives are mainly {popularCategories.shift()}
                {!!popularCategories.length && (
                  <>
                    {" "}
                    but may also be{" "}
                    {popularCategories.map((category, index) => (
                      <Fragment key={index}>
                        {index > 0 && index !== popularCategories.length - 1 && ", "}
                        {index > 0 && index === popularCategories.length - 1 && " or "}
                        {category}
                      </Fragment>
                    ))}
                  </>
                )}
                . Filter by these if you want a narrower list of alternatives or looking for a
                specific functionality of {alternative.name}.
              </p>
            )}
          </Prose>
        )}

        <Card className="group/button bg-background" asChild>
          <Link to={alternative.website} target="_blank" rel="noopener noreferrer nofollow">
            <Card.Header>
              <Favicon src={alternative.faviconUrl} title={alternative.name} />

              <H3 className="truncate">{alternative.name}</H3>
            </Card.Header>

            {alternative.description && (
              <p className="relative -tracking-0.5 line-clamp-4 text-sm/normal text-secondary">
                {alternative.description}
              </p>
            )}

            <Button
              variant={alternative.website.includes("go.") ? "fancy" : "primary"}
              size="md"
              className="mt-auto pointer-events-none"
              suffix={<ArrowUpRightIcon />}
              asChild
            >
              <span>Visit Website</span>
            </Button>
          </Link>
        </Card>
      </div>

      <div className="flex flex-col items-start gap-12 max-w-2xl [counter-reset:alternatives]">
        {tools.map(tool => (
          <ToolEntry key={tool.id} tool={tool} />
        ))}

        {!tools?.length && (
          <p className="col-span-full">No Open Source alternatives to {alternative.name} found.</p>
        )}
      </div>

      <BackButton to="/alternatives" />
    </>
  )
}
