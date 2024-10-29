import { Slot } from "@radix-ui/react-slot"
import { type ComponentProps, forwardRef, isValidElement } from "react"
import { Box, type BoxProps } from "~/components/ui/box"
import { Stack } from "~/components/ui/stack"
import { type VariantProps, cva, cx } from "~/utils/cva"

const cardVariants = cva({
  base: [
    "relative flex flex-col items-start gap-4 w-full border bg-card p-5 rounded-lg transform-gpu",
    "hover:[&[href]]:bg-card-dark",
  ],

  variants: {
    isRevealed: {
      true: "animate-reveal",
    },
  },

  defaultVariants: {
    isRevealed: true,
  },
})

export type CardProps = ComponentProps<"div"> &
  BoxProps &
  VariantProps<typeof cardVariants> & {
    /**
     * If set to `true`, the button will be rendered as a child within the component.
     * This child component must be a valid React component.
     */
    asChild?: boolean
  }

export const CardBase = forwardRef<HTMLDivElement, CardProps>(({ ...props }, ref) => {
  const { className, hover = true, focus = true, asChild, isRevealed, ...rest } = props

  const useAsChild = asChild && isValidElement(props.children)
  const Component = useAsChild ? Slot : "div"

  return (
    <Box hover={hover} focus={focus}>
      <Component ref={ref} className={cx(cardVariants({ isRevealed, className }))} {...rest} />
    </Box>
  )
})

CardBase.displayName = "Card"

export const CardHeader = ({ className, ...props }: ComponentProps<"div">) => {
  return <div className={cx("flex w-full items-center gap-x-3 gap-y-2", className)} {...props} />
}

export const CardFooter = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={cx("flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted", className)}
      {...props}
    />
  )
}

export const CardDescription = ({ className, ...props }: ComponentProps<"p">) => {
  return (
    <p
      className={cx("line-clamp-2 text-sm/normal text-secondary text-pretty", className)}
      {...props}
    />
  )
}

export const CardBadges = ({ className, size = "sm", ...props }: ComponentProps<typeof Stack>) => {
  return (
    <Stack
      size={size}
      className={cx("absolute top-0 inset-x-5 z-10 -translate-y-1/2", className)}
      {...props}
    />
  )
}

export const CardBg = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={cx(
        "absolute -top-px -inset-x-px -z-10 h-1/3 rounded-lg overflow-clip pointer-events-none",
        className,
      )}
      {...props}
    >
      <div className="-mt-12 size-full -rotate-12 bg-primary/10 blur-xl rounded-full" />
    </div>
  )
}

export const Card = Object.assign(CardBase, {
  Header: CardHeader,
  Footer: CardFooter,
  Description: CardDescription,
  Badges: CardBadges,
  Bg: CardBg,
})
