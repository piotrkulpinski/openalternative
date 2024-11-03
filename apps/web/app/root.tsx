import { publishEscape } from "@curiousleaf/utils"
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useFetchers,
  useLocation,
  useNavigation,
  useRouteLoaderData,
} from "@remix-run/react"
import { ThemeProvider } from "next-themes"
import NProgress from "nprogress"
import posthog from "posthog-js"
import { type PropsWithChildren, useEffect, useMemo } from "react"
import { Bottom } from "~/components/bottom"
import { ErrorPage } from "~/components/error-page"
import { Footer } from "~/components/footer"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"
import { Container } from "~/components/ui/container"
import { Logo } from "~/components/ui/logo"
import { getUserPrefs } from "~/services.server/cookies"
import { alternativeManyPayload, categoryManyPayload } from "./services.server/api"
import { prisma } from "./services.server/prisma"
import { JSON_HEADERS, SITE_NAME, SITE_URL } from "./utils/constants"

import { Banner } from "~/components/banner"
import { Header } from "~/components/header"
import stylesheet from "~/styles.css?url"

export const maxDuration = 300

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
    {
      tagName: "link",
      rel: "alternate",
      type: "application/rss+xml",
      title: `${SITE_NAME} &raquo; Feed`,
      href: `${SITE_URL}/rss.xml`,
    },
    {
      tagName: "link",
      rel: "alternate",
      type: "application/rss+xml",
      title: `${SITE_NAME} &raquo; Alternatives Feed`,
      href: `${SITE_URL}/alternatives/rss.xml`,
    },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userPrefs = await getUserPrefs(request)

  const [categories, alternatives] = await Promise.all([
    prisma.category.findMany({
      orderBy: { tools: { _count: "desc" } },
      include: categoryManyPayload,
      take: 12,
    }),

    prisma.alternative.findMany({
      where: { website: { startsWith: "https://go" }, NOT: { tools: { none: {} } } },
      orderBy: { tools: { _count: "desc" } },
      include: alternativeManyPayload,
      take: 12,
    }),
  ])

  return json({ categories, alternatives, ...userPrefs }, { headers: JSON_HEADERS })
}

export function Layout({ children }: PropsWithChildren) {
  const data = useRouteLoaderData<typeof loader>("root")
  const { key } = useLocation()
  const navigation = useNavigation()
  const fetchers = useFetchers()

  NProgress.configure({
    minimum: 0.25,
    parent: "#header",
    template: '<div class="fixed z-50 top-0 inset-x-0 h-0.5 bg-foreground/25" role="bar" />',
  })

  const state = useMemo<"idle" | "loading">(() => {
    const states = [navigation.state, ...fetchers.map(fetcher => fetcher.state)]

    if (states.every(state => state === "idle")) {
      return "idle"
    }

    return "loading"
  }, [navigation.state, fetchers])

  useEffect(() => {
    // Trigger escape hatch when the route changes
    publishEscape()

    // Track pageview
    posthog.capture("$pageview")
  }, [key])

  useEffect(() => {
    if (state === "loading") NProgress.start()
    if (state === "idle") NProgress.done()
  }, [navigation.state])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />

        {/* Plausible */}
        <script
          defer
          data-domain={import.meta.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
          src={`${import.meta.env.NEXT_PUBLIC_PLAUSIBLE_HOST}/js/script.js`}
        />
      </head>

      <body className="bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-dvh">
            <Banner />
            <Header />

            <Container asChild>
              <main className="flex flex-col grow py-8 gap-8 md:gap-10 md:py-10 lg:gap-12 lg:py-12">
                {children}

                <Footer hideNewsletter={data?.hideNewsletter} />
              </main>
            </Container>
          </div>

          <Bottom categories={data?.categories} alternatives={data?.alternatives} />
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
