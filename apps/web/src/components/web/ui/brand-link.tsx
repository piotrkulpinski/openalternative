import type { ComponentProps } from "react"
import { Favicon } from "~/components/web/ui/favicon"
import { NavigationLink } from "~/components/web/ui/navigation-link"

type BrandLinkProps = ComponentProps<typeof NavigationLink> & {
  name: string
  faviconUrl: string | null
}

export const BrandLink = ({ name, faviconUrl, ...props }: BrandLinkProps) => {
  return (
    <NavigationLink {...props}>
      <Favicon src={faviconUrl} title={name} className="size-6 p-[3px]" />

      <strong className="font-medium">{name}</strong>
    </NavigationLink>
  )
}
