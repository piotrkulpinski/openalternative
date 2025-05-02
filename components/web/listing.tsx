import type { ComponentProps, ReactNode } from "react"
import { Button } from "~/components/common/button"
import { H4 } from "~/components/common/heading"
import { Icon } from "~/components/common/icon"
import { Stack } from "~/components/common/stack"
import { cx } from "~/utils/cva"

type ListingProps = ComponentProps<typeof Stack> & {
  title?: string
  button?: ReactNode
  separated?: boolean
}

export const Listing = ({
  children,
  className,
  title,
  button,
  separated,
  ...props
}: ListingProps) => {
  return (
    <>
      {separated && <hr />}

      <Stack size="lg" direction="column" className={cx("items-stretch", className)} {...props}>
        <Stack className="w-full justify-between">
          {title && <H4 as="h3">{title}</H4>}

          {button && (
            <Button
              size="md"
              variant="secondary"
              suffix={<Icon name="lucide/arrow-right" />}
              className="-my-0.5"
              asChild
            >
              {button}
            </Button>
          )}
        </Stack>

        {children}
      </Stack>
    </>
  )
}
