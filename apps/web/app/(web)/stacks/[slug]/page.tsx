import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Suspense, cache } from "react"
import { StackCategories } from "~/app/(web)/stacks/[slug]/categories"
import { StackToolListing } from "~/app/(web)/stacks/[slug]/listing"
import { ToolQuerySkeleton } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import type { StackOne } from "~/server/web/stacks/payloads"
import { findStackBySlug, findStackSlugs } from "~/server/web/stacks/queries"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

const getStack = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const stack = await findStackBySlug(slug)

  if (!stack) {
    notFound()
  }

  return stack
})

const getMetadata = (stack: StackOne): Metadata => {
  return {
    title: `Top Open Source Projects using ${stack.name}`,
    description: `A curated collection of the ${stack._count.tools} best open source software using ${stack.name}. Find the most popular and trending open source projects to learn from, contribute to, or use in your own projects.`,
  }
}

export const generateStaticParams = async () => {
  const stacks = await findStackSlugs({})
  return stacks.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const stack = await getStack(props)
  const url = `/stacks/${stack.slug}`

  return {
    ...getMetadata(stack),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function StackPage(props: PageProps) {
  const stack = await getStack(props)
  const { title, description } = getMetadata(stack)

  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/stacks",
            name: "Tech Stacks",
          },
          {
            href: `/stacks/${stack.slug}`,
            name: stack.name,
          },
        ]}
      />

      <Intro>
        <IntroTitle>{`${title}`}</IntroTitle>
        <IntroDescription className="max-w-3xl">{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolQuerySkeleton />}>
        <StackToolListing stack={stack} searchParams={props.searchParams} />
      </Suspense>

      <Suspense>
        <StackCategories stack={stack} />
      </Suspense>
    </>
  )
}
