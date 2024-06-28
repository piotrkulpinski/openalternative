import type { LinksFunction, MetaFunction } from "@remix-run/node"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react"
import { ThemeProvider } from "next-themes"
import { useEffect, type PropsWithChildren } from "react"
import { Footer } from "~/components/Footer"
import { Newsletter } from "~/components/Newsletter"
import { BreadcrumbsLink } from "./components/Breadcrumbs"
import { Logo } from "./components/Logo"
import { SITE_NAME, SITE_URL } from "./utils/constants"
import { Header } from "./components/Header"
import { ErrorPage } from "./components/ErrorPage"
import { publishEscape } from "@curiousleaf/utils"
import posthog from "posthog-js"
import { readStats } from "./utils/stats"
import { StatsContext, StatsProvider } from "./providers/StatsProvider"

import stylesheet from "~/styles.css?url"

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
    { rel: "preconnect", href: "https://rsms.me/" },
    { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
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

export const loader = () => {
  return readStats() as StatsContext
}

export function Layout({ children }: PropsWithChildren) {
  const { key } = useLocation()
  const stats = useLoaderData<typeof loader>()

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
      </head>

      <body className="bg-background text-foreground">
        <StatsProvider stats={stats}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="@container/main mx-auto flex min-h-screen max-w-[60rem] flex-col gap-12 p-8">
              <Header />

              {children}

              <hr className="mt-auto peer-[[href]]:mt-0" />

              <Newsletter
                title="Newsletter"
                description="Get updates on new tools, alternatives, and other cool stuff."
              />

              <Footer />
            </div>
          </ThemeProvider>
        </StatsProvider>

        <ScrollRestoration />
        <Scripts />

        {process.env.NODE_ENV === "production" && (
          <>
            {/* Plausible */}
            <script
              defer
              data-domain={import.meta.env.VITE_PLAUSIBLE_DOMAIN}
              src={`${import.meta.env.VITE_PLAUSIBLE_HOST}/js/script.js`}
            />

            {/* OpenPanel */}
            <script defer async src="https://openpanel.dev/op.js" />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                window.op = window.op || function (...args) { (window.op.q = window.op.q || []).push(args); };
                window.op('ctor', {
                  clientId: '${import.meta.env.VITE_OPENPANEL_CLIENT_ID}',
                  trackScreenViews: true,
                  trackOutgoingLinks: true,
                  trackAttributes: true,
                });
              `,
              }}
            />
          </>
        )}
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
