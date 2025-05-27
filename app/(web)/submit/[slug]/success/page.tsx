import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { cache } from "react"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import { type ToolOne, toolOnePayload } from "~/server/web/tools/payloads"
import { db } from "~/services/db"

type PageProps = {
  params: Promise<{ slug: string }>
}

const getTool = cache(async ({ params }: PageProps) => {
  const { slug } = await params

  const tool = await db.tool.findFirst({
    where: { slug },
    select: toolOnePayload,
  })

  if (!tool) {
    notFound()
  }

  return tool
})

const getMetadata = async (tool: ToolOne) => {
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

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const tool = await getTool(props)
  const url = `/submit/${tool.slug}/success`

  return {
    ...getMetadata(tool),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function SuccessPage(props: PageProps) {
  const tool = await getTool(props)
  const metadata = await getMetadata(tool)

  return (
    <>
      <Intro alignment="center">
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Image
        src={"/3d-heart.webp"}
        alt=""
        width={256}
        height={228}
        className="max-w-64 w-2/3 h-auto mx-auto"
      />
    </>
  )
}
