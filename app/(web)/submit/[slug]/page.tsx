import type { Tool } from "@prisma/client"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs"
import { createSearchParamsCache, parseAsBoolean, parseAsString } from "nuqs/server"
import { Suspense, cache } from "react"
import { SubmitProducts } from "~/app/(web)/submit/[slug]/products"
import { Prose } from "~/components/common/prose"
import { PlanSkeleton } from "~/components/web/plan"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { isToolPublished } from "~/lib/tools"
import { findToolSlugs, findUniqueTool } from "~/server/tools/queries"
import { parseMetadata } from "~/utils/metadata"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

const searchParamsCache = createSearchParamsCache({
  success: parseAsBoolean.withDefault(false),
  cancelled: parseAsBoolean.withDefault(false),
  discount: parseAsString.withDefault(""),
})

const getTool = cache(async ({ slug, success }: { slug: string; success: boolean }) => {
  return findUniqueTool({
    where: { slug, publishedAt: undefined, isFeatured: success ? undefined : false },
  })
})

const getMetadata = cache((tool: Tool, success: boolean, metadata?: Metadata): Metadata => {
  if (success) {
    if (tool.isFeatured) {
      return {
        ...metadata,
        title: "Thank you for your payment!",
        description: `We've received your payment. ${tool.name} should be featured on ${config.site.name} shortly.`,
      }
    }

    return {
      ...metadata,
      title: `Thank you for submitting ${tool.name}!`,
      description: `We've received your submission. We'll review it shortly and get back to you.`,
    }
  }

  if (isToolPublished(tool)) {
    return {
      ...metadata,
      title: `Boost ${tool.name}'s Visibility`,
      description: `You can upgrade ${tool.name}'s listing on ${config.site.name} to benefit from a featured badge, a prominent placement, and a do-follow link.`,
    }
  }

  return {
    ...metadata,
    title: "Choose a submission package",
    description: `Maximize ${tool.name}'s impact from day one. Select a package that suits your goals - from free listing to premium features.`,
  }
})

export const generateStaticParams = async () => {
  const tools = await findToolSlugs({ where: { publishedAt: undefined } })
  return tools.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async ({ params, searchParams }: PageProps): Promise<Metadata> => {
  const { slug } = await params
  const { success } = searchParamsCache.parse(await searchParams)

  const tool = await getTool({ slug, success })
  const url = `/submit/${slug}`

  if (!tool) {
    return {}
  }

  return parseMetadata(
    getMetadata(tool, success, {
      alternates: { canonical: url },
      openGraph: { url },
    }),
  )
}

export default async function SubmitPackages({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { success } = searchParamsCache.parse(await searchParams)

  const tool = await getTool({ slug, success })

  if (!tool) {
    notFound()
  }

  const { title, description } = getMetadata(tool, success)

  return (
    <>
      <Intro alignment="center">
        <IntroTitle>{title?.toString()}</IntroTitle>
        <IntroDescription>{description}</IntroDescription>
      </Intro>

      {success ? (
        <Image
          src={"/3d-heart.webp"}
          alt=""
          className="max-w-64 w-2/3 h-auto mx-auto"
          width={256}
          height={228}
        />
      ) : (
        <div className="flex flex-wrap justify-center gap-5">
          <Suspense fallback={[...Array(3)].map((_, index) => <PlanSkeleton key={index} />)}>
            <SubmitProducts tool={tool} />
          </Suspense>
        </div>
      )}

      <Intro alignment="center">
        <IntroTitle size="h3">Have questions?</IntroTitle>

        <Prose>
          <p>
            If you have any questions, please contact us at{" "}
            <Link href={`mailto:${config.site.email}`}>{config.site.email}</Link>.
          </p>
        </Prose>
      </Intro>
    </>
  )
}
