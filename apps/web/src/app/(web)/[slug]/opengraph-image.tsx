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
      <ul style={{ display: "flex", alignItems: "center", gap: "12" }}>
        {!!tool.stars && (
          <li
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6",
              padding: "0.5rem 1rem",
              border: "0.1em solid #D1D5DB",
              borderRadius: "0.75rem",
              color: "#71717A",
              fontSize: "1.6rem",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ height: "1.75rem", width: "1.75rem" }}
              role="img"
              aria-label="Star icon"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <strong style={{ color: "#3F3F46", fontFamily: "GeistBold" }}>
              {tool.stars.toLocaleString()}
            </strong>
            Stars
          </li>
        )}

        {!!tool.forks && (
          <li
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6",
              padding: "0.5rem 1rem",
              border: "0.1em solid #D1D5DB",
              borderRadius: "0.75rem",
              color: "#71717A",
              fontSize: "1.6rem",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ height: "1.75rem", width: "1.75rem" }}
              role="img"
              aria-label="Star icon"
            >
              <circle cx="12" cy="18" r="3" />
              <circle cx="6" cy="6" r="3" />
              <circle cx="18" cy="6" r="3" />
              <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" />
              <path d="M12 12v3" />
            </svg>
            <strong style={{ color: "#3F3F46", fontFamily: "GeistBold" }}>
              {tool.forks.toLocaleString()}
            </strong>
            Forks
          </li>
        )}
      </ul>
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
