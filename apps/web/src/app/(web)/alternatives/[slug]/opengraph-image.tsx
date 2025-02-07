import { notFound } from "next/navigation"
import { ImageResponse } from "next/og"
import { OgBase } from "~/components/web/og/og-base"
import { loadGoogleFont } from "~/lib/fonts"
import { findAlternative } from "~/server/web/alternatives/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

// Image metadata
export const contentType = "image/png"
export const alt = "Open Source Alternative OpenGraph image"
export const size = { width: 1200, height: 630 }

export default async function Image({ params }: PageProps) {
  const { slug } = await params
  const alternative = await findAlternative({ where: { slug } })

  if (!alternative) {
    notFound()
  }

  return new ImageResponse(
    <OgBase
      name={`Open Source ${alternative.name} Alternatives`}
      description={alternative.description}
      faviconUrl={alternative.faviconUrl}
    />,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Geist",
          data: await loadGoogleFont("Geist", 400),
          weight: 400,
          style: "normal",
        },
        {
          name: "GeistBold",
          data: await loadGoogleFont("Geist", 600),
          weight: 600,
          style: "normal",
        },
      ],
    },
  )
}
