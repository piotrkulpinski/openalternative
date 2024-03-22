import { LinksFunction } from "@remix-run/node"
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react"
import { PropsWithChildren } from "react"
import { Footer } from "~/components/Footer"
import { Header } from "~/components/Header"
import { Newsletter } from "~/components/Newsletter"

import stylesheet from "~/styles.css?url"
import { Logo } from "./components/Logo"
import { BreadcrumbsLink } from "./components/Breadcrumbs"
import { SITE_NAME } from "./utils/constants"

export const handle = {
  Breadcrumb: () => (
    <BreadcrumbsLink to="/" label={SITE_NAME}>
      <Logo className="size-5" />
    </BreadcrumbsLink>
  ),
}

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesheet },
    { rel: "icon", href: "/logo.svg", type: "image/svg+xml" },
    { rel: "preconnect", href: "https://rsms.me/" },
    { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
  ]
}

export function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <body className="bg-white text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
        <div className="mx-auto flex min-h-screen max-w-[60rem] flex-col gap-12 p-8">
          <Header />

          {children}

          <hr className="mt-auto dark:border-neutral-800" />

          <Newsletter
            title="Newsletter"
            description="Get updates on new tools, alternatives, and other cool stuff."
          />

          <Footer />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
