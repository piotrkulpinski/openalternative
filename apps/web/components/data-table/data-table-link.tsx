import Image from "next/image"
import type { ComponentProps } from "react"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { cx } from "~/utils/cva"

type DataTableLinkProps = ComponentProps<typeof Link> & {
  image?: string | null
  title: string
}

export const DataTableLink = ({
  children,
  className,
  image,
  title,
  ...props
}: DataTableLinkProps) => {
  return (
    <Stack size="sm" wrap={false}>
      <Link
        className={cx(
          "block max-w-40 truncate font-medium underline underline-offset-4 decoration-foreground/10 hover:decoration-foreground/25",
          className,
        )}
        {...props}
      >
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
