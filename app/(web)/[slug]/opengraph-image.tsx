import { notFound } from "next/navigation"
import { ImageResponse } from "next/og"
import { OgBase } from "~/components/web/og/og-base"
import { loadGoogleFont } from "~/lib/fonts"
import { findTool } from "~/server/web/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

// Image metadata
export const contentType = "image/png"
export const alt = "Open Source Tool OpenGraph image"
export const size = { width: 1200, height: 630 }

export default async function Image({ params }: PageProps) {
  const { slug } = await params
  const tool = await findTool({ where: { slug } })

  if (!tool) {
    notFound()
  }

  return new ImageResponse(
    <OgBase name={tool.name} description={tool.description} faviconUrl={tool.faviconUrl}>
      {!!tool.stars && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8",
            fontSize: "2.2rem",
          }}
        >
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(0, 0, 0, 0.5)"
            strokeWidth="2"
            role="img"
            aria-label="Star icon"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>

          <strong style={{ color: "rgba(0, 0, 0, 0.75)", fontFamily: "GeistBold" }}>
            {tool.stars.toLocaleString()}
          </strong>
        </div>
      )}
    </OgBase>,
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
