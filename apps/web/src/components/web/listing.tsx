import { ArrowRightIcon } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import { H4 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import { Button } from "~/components/web/ui/button"
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
              suffix={<ArrowRightIcon />}
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
