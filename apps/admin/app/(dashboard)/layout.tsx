import {
  CopyrightIcon,
  DraftingCompassIcon,
  GalleryHorizontalEndIcon,
  ReplaceIcon,
} from "lucide-react"
import Link from "next/link"
import type { PropsWithChildren } from "react"
import { NavItem } from "~/app/(dashboard)/nav-item"
import { User } from "~/app/(dashboard)/user"
import { Logo } from "~/components/ui/logo"
import { siteConfig } from "~/config/site"
import { Providers } from "./providers"

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <Providers>
      <main className="flex min-h-screen w-full bg-muted">
        <aside className="sticky top-0 z-40 h-svh flex flex-col gap-4 px-2 py-4 text-sm">
          <Link
            href="/"
            className="p-1.5 shrink-0 rounded-lg bg-foreground text-background hover:bg-foreground/90"
          >
            <Logo className="size-5" />
            <span className="sr-only">{siteConfig.name}</span>
          </Link>

          <nav className="contents">
            <NavItem href="/tools" label="Tools">
              <DraftingCompassIcon />
            </NavItem>

            <NavItem href="/alternatives" label="Alternatives">
              <ReplaceIcon />
            </NavItem>

            <NavItem href="/categories" label="Categories">
              <GalleryHorizontalEndIcon />
            </NavItem>

            <NavItem href="/licenses" label="Licenses">
              <CopyrightIcon />
            </NavItem>
          </nav>

          <User className="mt-auto" />
        </aside>

        <main className="grid content-start gap-4 grow p-4 bg-background border-l sm:px-6 lg:rounded-xl lg:border lg:shadow lg:my-2 lg:mr-2">
          {children}
        </main>
      </main>
    </Providers>
  )
}
