import Image from "next/image"
import type { ComponentProps } from "react"
import { Box } from "~/components/common/box"
import { Button } from "~/components/common/button"
import { Icon } from "~/components/common/icon"
import { ExternalLink } from "~/components/web/external-link"
import { cx } from "~/utils/cva"

type OverlayImageProps = ComponentProps<typeof ExternalLink> & {
  src: string
  alt?: string
}

export const OverlayImage = ({ children, className, src, alt, ...props }: OverlayImageProps) => {
  return (
    <Box hover>
      <ExternalLink
        className={cx("not-prose group relative rounded-md overflow-clip", className)}
        {...props}
      >
        <Image
          src={src}
          alt={alt ?? ""}
          width={1280}
          height={1024}
          loading="lazy"
          className="aspect-video h-auto w-full object-cover object-top will-change-transform group-hover:opacity-75 group-hover:scale-[102%] group-hover:blur-[1px]"
        />

        <Button
          focus={false}
          suffix={<Icon name="lucide/arrow-up-right" />}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none shadow-lg group-hover:opacity-100"
          asChild
        >
          <span>{children}</span>
        </Button>
      </ExternalLink>
    </Box>
  )
}
