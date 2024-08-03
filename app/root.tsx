import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteLoaderData,
} from "@remix-run/react"
import { ThemeProvider } from "next-themes"
import { useEffect, type PropsWithChildren } from "react"
import { Footer } from "~/partials/Footer"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Logo } from "~/components/Logo"
import { JSON_HEADERS, SITE_NAME, SITE_URL } from "./utils/constants"
import { Header } from "~/partials/Header"
import { ErrorPage } from "~/partials/ErrorPage"
import { Container } from "~/components/Container"
import { publishEscape } from "@curiousleaf/utils"
import posthog from "posthog-js"

import stylesheet from "~/styles.css?url"
import { prisma } from "./services.server/prisma"
import { categoryManyPayload } from "./services.server/api"

export const shouldRevalidate = () => {
  return false
}

export const handle = {
  breadcrumb: () => (
    <BreadcrumbsLink to="/" label={SITE_NAME}>
      <Logo className="size-5 shrink-0" />
    </BreadcrumbsLink>
  ),
}

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesheet },
    { rel: "icon", href: "/favicon.png", type: "image/png" },
  ]
}

export const meta: MetaFunction = ({ location }) => {
  const currentUrl = `${SITE_URL}${location.pathname}${location.search}`
  const canonicalUrl = `${SITE_URL}${location.pathname}`

  return [
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: currentUrl },
    { property: "og:site_name", content: SITE_NAME },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const categories = await prisma.category.findMany({
    orderBy: { tools: { _count: "desc" } },
    include: categoryManyPayload,
    take: 8,
  })

  return json({ categories }, { headers: JSON_HEADERS })
}

export function Layout({ children }: PropsWithChildren) {
  const data = useRouteLoaderData<typeof loader>("root")
  const { key } = useLocation()

  useEffect(() => {
    // Trigger escape hatch when the route changes
    publishEscape()

    // Track pageview
    posthog.capture("$pageview")
  }, [key])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <Meta />
        <Links />

        {process.env.NODE_ENV === "production" && (
          <>
            {/* Plausible */}
            <script
              defer
              data-domain={import.meta.env.VITE_PLAUSIBLE_DOMAIN}
              src={`${import.meta.env.VITE_PLAUSIBLE_HOST}/js/script.js`}
            />

            {/* AdSense */}
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${import.meta.env.VITE_ADSENSE_PUBLISHER_ID}`}
              crossOrigin="anonymous"
            />

            {/* Seline */}
            <script async src="https://cdn.seline.so/seline.js" />
          </>
        )}
      </head>

      <body className="bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />

          <Container className="flex min-h-[calc(100dvh-var(--header-height))] mt-[calc(var(--header-top)+var(--header-height))] flex-col py-8 gap-8 md:gap-10 md:py-10 lg:gap-12 lg:py-12">
            {children}

            <hr className="mt-auto peer-[[href]]:mt-0" />

            <Footer categories={data?.categories} />
          </Container>
        </ThemeProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary() {
  return <ErrorPage />
}
