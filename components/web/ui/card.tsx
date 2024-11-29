import { Slot } from "@radix-ui/react-slot"
import { type ComponentProps, isValidElement } from "react"
import { Box, type BoxProps } from "~/components/common/box"
import { Stack } from "~/components/common/stack"
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

type CardProps = ComponentProps<"div"> &
  BoxProps &
  VariantProps<typeof cardVariants> & {
    /**
     * If set to `true`, the button will be rendered as a child within the component.
     * This child component must be a valid React component.
     */
    asChild?: boolean
  }

const Card = ({
  className,
  hover = true,
  focus = true,
  asChild,
  isRevealed,
  ...props
}: CardProps) => {
  const useAsChild = asChild && isValidElement(props.children)
  const Comp = useAsChild ? Slot : "div"

  return (
    <Box hover={hover} focus={focus}>
      <Comp className={cx(cardVariants({ isRevealed, className }))} {...props} />
    </Box>
  )
}

const CardHeader = ({ className, ...props }: ComponentProps<"div">) => {
  return <div className={cx("flex w-full items-center gap-x-3 gap-y-2", className)} {...props} />
}

const CardFooter = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={cx("flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted", className)}
      {...props}
    />
  )
}

const CardDescription = ({ className, ...props }: ComponentProps<"p">) => {
  return (
    <p
      className={cx("line-clamp-2 text-sm/normal text-secondary text-pretty", className)}
      {...props}
    />
  )
}

const CardBadges = ({ className, size = "sm", ...props }: ComponentProps<typeof Stack>) => {
  return (
    <Stack
      size={size}
      className={cx("absolute top-0 inset-x-5 z-10 -translate-y-1/2", className)}
      {...props}
    />
  )
}

const CardBg = ({ className, ...props }: ComponentProps<"div">) => {
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

export {
  Card,
  CardBg,
  CardBadges,
  CardDescription,
  CardFooter,
  CardHeader,
  cardVariants,
  type CardProps,
}
