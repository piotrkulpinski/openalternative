import { LinksFunction, MetaFunction } from "@remix-run/node"
import { SpeedInsights } from "@vercel/speed-insights/remix"
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "@remix-run/react"
import { PropsWithChildren, useEffect } from "react"
import { ThemeProvider } from "next-themes"
import { Footer } from "~/components/Footer"
import { Header } from "~/components/Header"
import { Newsletter } from "~/components/Newsletter"
import { Logo } from "./components/Logo"
import { BreadcrumbsLink } from "./components/Breadcrumbs"
import { SITE_NAME, SITE_URL } from "./utils/constants"
import { posthog } from "posthog-js"

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
    { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
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
  const location = useLocation()

  useEffect(() => {
    posthog.capture("$pageview")
  }, [location])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <Meta />
        <Links />
      </head>

      <body className="bg-white text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="@container/main mx-auto flex min-h-screen max-w-[60rem] flex-col gap-12 p-8">
            <Header />

            {children}

            <hr className="mt-auto peer-[[href]]:mt-0 dark:border-neutral-800" />

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
          data-domain="openalternative.co"
          src="https://plausible.kulpinski.dev/js/script.js"
        />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
