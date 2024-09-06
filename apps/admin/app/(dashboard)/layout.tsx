import {
  CodeXmlIcon,
  CopyrightIcon,
  DraftingCompassIcon,
  GalleryHorizontalEndIcon,
  ReplaceIcon,
  TagIcon,
} from "lucide-react"
import Link from "next/link"
import type { PropsWithChildren } from "react"
import { NavItem } from "~/app/(dashboard)/NavItem"
import { User } from "~/app/(dashboard)/User"
import { Logo } from "~/components/ui/Logo"
import { siteConfig } from "~/config/site"
import Providers from "./Providers"

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <Providers>
      <main className="flex items-start min-h-screen w-full">
        <aside className="sticky top-0 z-40 h-dvh flex flex-col gap-4 px-2 py-4 text-sm border-r bg-muted/50">
          <Link
            href="/"
            className="p-1.5 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Logo className="size-5" />
            <span className="sr-only">{siteConfig.name}</span>
          </Link>

          <nav className="contents">
            <NavItem href="/tools" label="Tools">
              <DraftingCompassIcon />
            </NavItem>

            <NavItem href="/categories" label="Categories">
              <GalleryHorizontalEndIcon />
            </NavItem>

            <NavItem href="/alternatives" label="Alternatives">
              <ReplaceIcon />
            </NavItem>

            <NavItem href="/languages" label="Languages">
              <CodeXmlIcon />
            </NavItem>

            <NavItem href="/topics" label="Topics">
              <TagIcon />
            </NavItem>

            <NavItem href="/licenses" label="Licenses">
              <CopyrightIcon />
            </NavItem>
          </nav>

          <User className="mt-auto" />
        </aside>

        <main className="grid w-full gap-4 p-4 sm:px-6">{children}</main>
      </main>
    </Providers>
  )
}
