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
        <aside className="sticky top-0 h-dvh flex flex-col gap-4 px-2 py-4 border-r bg-muted/50">
          <nav className="contents">
            <Link
              href="/"
              className="flex size-9 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base hover:bg-primary/90"
            >
              <Logo className="size-5" />
              <span className="sr-only">{siteConfig.name}</span>
            </Link>

            <NavItem href="/tools" label="Tools">
              <DraftingCompassIcon className="size-5" />
            </NavItem>

            <NavItem href="/categories" label="Categories">
              <GalleryHorizontalEndIcon className="size-5" />
            </NavItem>

            <NavItem href="/alternatives" label="Alternatives">
              <ReplaceIcon className="size-5" />
            </NavItem>

            <NavItem href="/languages" label="Languages">
              <CodeXmlIcon className="size-5" />
            </NavItem>

            <NavItem href="/topics" label="Topics">
              <TagIcon className="size-5" />
            </NavItem>

            <NavItem href="/licenses" label="Licenses">
              <CopyrightIcon className="size-5" />
            </NavItem>
          </nav>

          <User className="mt-auto" />
        </aside>

        <main className="grid w-full gap-4 p-4 sm:px-6">{children}</main>
      </main>
    </Providers>
  )
}
