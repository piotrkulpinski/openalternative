import { db } from "@openalternative/db"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { createSearchParamsCache, parseAsBoolean, parseAsString } from "nuqs/server"
import { Suspense, cache } from "react"
import { SubmitProducts } from "~/app/(web)/submit/[slug]/products"
import { Link } from "~/components/common/link"
import { Prose } from "~/components/common/prose"
import { PlanSkeleton } from "~/components/web/plan"
import { Stats } from "~/components/web/stats"
import { Testimonial } from "~/components/web/testimonial"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import { isToolPublished } from "~/lib/tools"
import { type ToolOne, toolOnePayload } from "~/server/web/tools/payloads"

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

  const tool = await db.tool.findFirst({
    where: { slug, isFeatured: success ? undefined : false },
    select: toolOnePayload,
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
    title: `Choose a plan for ${tool.name}`,
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
            <SubmitProducts tool={tool} searchParams={props.searchParams} />
          </Suspense>
        </div>
      )}

      <Stats className="my-4" />

      {config.ads.testimonials.map(testimonial => (
        <Testimonial key={testimonial.quote} {...testimonial} className="my-4" />
      ))}

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
