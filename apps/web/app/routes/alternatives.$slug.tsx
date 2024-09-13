import type { Category } from "@prisma/client"
import {
  type HeadersFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
} from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { Fragment, type ReactNode } from "react"
import { AlternativeList } from "~/components/alternative-list"
import { AlternativeCard } from "~/components/records/alternative-card"
import { ToolEntry } from "~/components/records/tool-entry"
import { BackButton } from "~/components/ui/back-button"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/ui/intro"
import { Prose } from "~/components/ui/prose"
import { Section } from "~/components/ui/section"
import { ShareButtons } from "~/components/ui/share-buttons"
import {
  type AlternativeOne,
  alternativeManyPayload,
  alternativeOnePayload,
} from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { FEATURED_ALTERNATIVES, JSON_HEADERS } from "~/utils/constants"
import { joinAsSentence } from "~/utils/helpers"
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
  let suffix = ""

  try {
    const [alternative, alternatives, tools] = await Promise.all([
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
          prisma.alternative.findMany({
            where: {
              slug: { in: FEATURED_ALTERNATIVES.filter(a => a !== slug) },
              NOT: { tools: { none: {} } },
            },
            include: alternativeManyPayload,
            take: 6,
          }),
        { type: "find other alternatives", timings },
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

    // Sort the categories by count
    const categories = Object.values(
      tools.reduce<Record<string, { count: number; category: Category }>>((acc, { categories }) => {
        for (const { category } of categories) {
          if (!acc[category.name]) {
            acc[category.name] = { count: 0, category }
          }
          acc[category.name].count += 1
        }
        return acc
      }, {}),
    ).sort((a, b) => b.count - a.count)

    switch (tools.length) {
      case 0:
        suffix = ""
        break
      case 1:
        suffix = `: Best ${categories[0].category.label}`
        break
      default:
        suffix = `: Top ${tools.length} ${categories[0].category.label}`
    }

    const meta = {
      title: `Open Source ${alternative.name} Alternatives${suffix}`,
      description: `A curated collection of the ${tools.length} best open source alternatives to ${alternative.name}. Each listing includes a website screenshot along with a detailed review of its features.`,
    }

    return json(
      { meta, alternative, alternatives, tools, categories },
      { headers: { "Server-Timing": timings.toString(), ...JSON_HEADERS } },
    )
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function AlternativesPage() {
  const { meta, alternative, alternatives, tools, categories } = useLoaderData<typeof loader>()

  // Pick the top 5 tools
  const bestAlternatives: ReactNode[] = tools.slice(0, 5).map(tool => (
    <Link key={tool.id} to={`/${tool.slug}`} prefetch="intent" unstable_viewTransition>
      {tool.name}
    </Link>
  ))

  // Pick the top 3 categories
  const bestCategories = categories.slice(0, 3).map(({ category }) => (
    <Link key={category.id} to={`/categories/${category.slug}`} unstable_viewTransition>
      {category.label || category.name}
    </Link>
  ))

  // Get the category labels
  const categoryLabels = categories.map(({ category }) => category.label || category.name)

  return (
    <>
      <Intro>
        <IntroTitle>Open Source {alternative.name} Alternatives</IntroTitle>

        <IntroDescription className="max-w-4xl">
          {tools.length
            ? `The Best ${joinAsSentence(categoryLabels, 2)} similar to ${alternative.name}.`
            : `No open source ${alternative.name} alternatives found yet.`}
        </IntroDescription>
      </Intro>

      {!!tools.length && (
        <Section>
          <Section.Content className="gap-12 md:gap-14 lg:gap-16">
            <Prose>
              <p>
                The best open source alternative to {alternative.name} is {bestAlternatives.shift()}
                . If that doesn't suit you, we've compiled a ranked list of other open source{" "}
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

              {!!bestCategories.length && (
                <p>
                  {alternative.name} alternatives are mainly {bestCategories.shift()}
                  {!!bestCategories.length && " but may also be "}
                  {bestCategories.map((category, index) => (
                    <Fragment key={index}>
                      {index > 0 && index !== bestCategories.length - 1 && ", "}
                      {index > 0 && index === bestCategories.length - 1 && " or "}
                      {category}
                    </Fragment>
                  ))}
                  . Browse these if you want a narrower list of alternatives or looking for a
                  specific functionality of {alternative.name}.
                </p>
              )}

              <ShareButtons title={meta.title} className="not-prose" />
            </Prose>

            {tools.map(tool => (
              <ToolEntry key={tool.id} tool={tool} />
            ))}
          </Section.Content>

          <Section.Sidebar className="order-first md:order-last">
            <AlternativeCard alternative={alternative} />
          </Section.Sidebar>
        </Section>
      )}

      <AlternativeList alternatives={alternatives} />
    </>
  )
}
