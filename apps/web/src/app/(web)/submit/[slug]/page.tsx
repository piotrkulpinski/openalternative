import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { createSearchParamsCache, parseAsBoolean, parseAsString } from "nuqs/server"
import { Suspense, cache } from "react"
import { SubmitProducts } from "~/app/(web)/submit/[slug]/products"
import { PlanSkeleton } from "~/components/web/plan"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Prose } from "~/components/web/ui/prose"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import { isToolPublished } from "~/lib/tools"
import type { ToolOne } from "~/server/web/tools/payloads"
import { findToolBySlug } from "~/server/web/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

const searchParamsCache = createSearchParamsCache({
  success: parseAsBoolean.withDefault(false),
  cancelled: parseAsBoolean.withDefault(false),
  discount: parseAsString.withDefault(""),
})

const getTool = cache(async ({ params, searchParams }: PageProps) => {
  const { success } = searchParamsCache.parse(await searchParams)
  const { slug } = await params

  const tool = await findToolBySlug(slug, {
    where: { isFeatured: success ? undefined : false, status: undefined },
  })

  if (!tool) {
    notFound()
  }

  return { tool, success }
})

const getMetadata = (tool: ToolOne, success: boolean): Metadata => {
  if (success) {
    if (tool.isFeatured) {
      return {
        title: "Thank you for your payment!",
        description: `We've received your payment. ${tool.name} should be featured on ${config.site.name} shortly.`,
      }
    }

    return {
      title: `Thank you for submitting ${tool.name}!`,
      description: `We've received your submission. We'll review it shortly and get back to you.`,
    }
  }

  if (isToolPublished(tool)) {
    return {
      title: `Boost ${tool.name}'s Visibility`,
      description: `You can upgrade ${tool.name}'s listing on ${config.site.name} to benefit from a featured badge, a prominent placement, and a do-follow link.`,
    }
  }

  return {
    title: "Choose a submission package",
    description: `Maximize ${tool.name}'s impact from day one. Select a package that suits your goals - from free listing to premium features.`,
  }
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const { tool, success } = await getTool(props)
  const url = `/submit/${tool.slug}`

  return {
    ...getMetadata(tool, success),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function SubmitPackages(props: PageProps) {
  const { tool, success } = await getTool(props)
  const { title, description } = getMetadata(tool, success)

  return (
    <>
      <Intro alignment="center">
        <IntroTitle>{`${title}`}</IntroTitle>
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
