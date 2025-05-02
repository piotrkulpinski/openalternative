import Image from "next/image"
import type { ComponentProps } from "react"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { cx } from "~/utils/cva"

type DataTableLinkProps = ComponentProps<typeof Link> & {
  image?: string | null
  title: string
  isOverlay?: boolean
}

export const DataTableLink = ({
  children,
  className,
  image,
  title,
  isOverlay = true,
  ...props
}: DataTableLinkProps) => {
  return (
    <Stack size="sm" wrap={false}>
      <Link
        className={cx(
          "block truncate font-medium underline decoration-foreground/10 hover:decoration-foreground/35",
          !isOverlay && "relative z-10",
          className,
        )}
        {...props}
      >
        {isOverlay && <span className="absolute inset-0" />}

        {image && (
          <Image
            src={image}
            alt=""
            loading="lazy"
            width="64"
            height="64"
            className="inline-block align-text-bottom mr-2 size-4 rounded"
          />
        )}

        {title}
      </Link>

      {children}
    </Stack>
  )
}
