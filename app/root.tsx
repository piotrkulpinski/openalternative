import { publishEscape } from "@curiousleaf/utils"
import type { LinksFunction, MetaFunction } from "@remix-run/node"
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "@remix-run/react"
import { SpeedInsights } from "@vercel/speed-insights/remix"
import { ThemeProvider } from "next-themes"
import { posthog } from "posthog-js"
import { type PropsWithChildren, useEffect } from "react"
import { Footer } from "~/components/Footer"
import { Header } from "~/components/Header"
import { Newsletter } from "~/components/Newsletter"
import { BreadcrumbsLink } from "./components/Breadcrumbs"
import { Logo } from "./components/Logo"
import { SITE_NAME, SITE_URL } from "./utils/constants"

import stylesheet from "~/styles.css?url"

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

export function Layout({ children }: PropsWithChildren) {
  const { key } = useLocation()

  useEffect(() => {
    // Trigger escape hatch when the route changes
    publishEscape()

    // Track pageview
    posthog.capture("$pageview")
  }, [key])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <Meta />
        <Links />
      </head>

      <body className="bg-background text-foreground">
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

        <ScrollRestoration />
        <Scripts />
        <SpeedInsights />

        {/* Plausible */}
        <script
          defer
          data-domain={import.meta.env.VITE_PLAUSIBLE_DOMAIN}
          src={`${import.meta.env.VITE_PLAUSIBLE_HOST}/js/script.js`}
        />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
