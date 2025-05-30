import { Slot } from "radix-ui"
import { type ComponentProps, isValidElement } from "react"
import { type BoxProps, boxVariants } from "~/components/common/box"
import { Stack } from "~/components/common/stack"
import { type VariantProps, cva, cx } from "~/utils/cva"

const cardVariants = cva({
  base: [
    "group relative flex flex-col items-start gap-4 w-full border bg-card p-5 rounded-lg transform-gpu ring-4 ring-inset ring-background",
    "hover:[&[href]]:bg-accent",
  ],
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

const Card = ({ className, hover = true, focus = true, asChild, ...props }: CardProps) => {
  const useAsChild = asChild && isValidElement(props.children)
  const Comp = useAsChild ? Slot.Root : "div"

  return (
    <Comp className={cx(boxVariants({ hover, focus }), cardVariants({ className }))} {...props} />
  )
}

const CardHeader = ({ className, ...props }: ComponentProps<typeof Stack>) => {
  return <Stack className={cx("w-full", className)} {...props} />
}

const CardFooter = ({ className, ...props }: ComponentProps<typeof Stack>) => {
  return <Stack size="sm" className={cx("text-xs text-muted-foreground", className)} {...props} />
}

const CardDescription = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={cx("line-clamp-2 text-sm/normal text-secondary-foreground text-pretty", className)}
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
        "absolute top-1 inset-x-1 -z-10 h-24 rounded-lg overflow-clip pointer-events-none",
        className,
      )}
      {...props}
    >
      <div className="-mt-12 size-full -rotate-12 bg-primary/10 blur-xl rounded-full" />
    </div>
  )
}

const CardIcon = ({ children, className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={cx(
        "absolute inset-1 overflow-clip rounded-sm opacity-10 pointer-events-none",
        className,
      )}
      {...props}
    >
      <Slot.Root className="absolute -top-20 -right-20 -z-10 size-60 rotate-12 mask-b-from-25 mask-l-from-25">
        {children}
      </Slot.Root>
    </div>
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardDescription,
  CardBadges,
  CardBg,
  CardIcon,
  cardVariants,
  type CardProps,
}
