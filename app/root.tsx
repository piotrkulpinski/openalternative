import type { LinksFunction, MetaFunction } from "@remix-run/node"
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "@remix-run/react"
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

import stylesheet from "~/styles.css?url"
import { Container } from "./components/Container"

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

export function Layout({ children }: PropsWithChildren) {
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
      </head>

      <body className="bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />

          <Container className="flex min-h-[calc(100dvh-var(--header-height))] mt-[calc(var(--header-top)+var(--header-height))] flex-col pt-8 pb-6 gap-8 md:gap-10 lg:gap-12 lg:pt-12">
            {children}

            <hr className="mt-auto peer-[[href]]:mt-0" />

            <Newsletter
              title="Newsletter"
              description="Get updates on new tools, alternatives, and other cool stuff."
            />

            <Footer />
          </Container>
        </ThemeProvider>

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
