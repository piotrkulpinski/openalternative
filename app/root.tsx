import { LinksFunction } from "@remix-run/node"
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react"
import { PropsWithChildren } from "react"
import { Footer } from "~/components/Footer"
import { Header } from "~/components/Header"
import { Navigation } from "~/components/Navigation"
import { Newsletter } from "~/components/Newsletter"

import stylesheet from "~/styles.css?url"

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesheet },
    { rel: "icon", href: "/favicon.png", type: "image/svg+xml" },
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

      <body className="mx-auto flex min-h-screen max-w-[60rem] flex-col gap-12 bg-white p-8 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
        <Header>
          <Navigation />
        </Header>
        {children}
        <Newsletter />
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
