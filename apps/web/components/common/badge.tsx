import { Slot } from "radix-ui"
import { type ComponentProps, type ReactNode, isValidElement } from "react"
import { Slottable } from "~/components/common/slottable"
import { type VariantProps, cva, cx } from "~/utils/cva"

const badgeVariants = cva({
  base: "inline-flex items-center rounded-sm text-secondary-foreground leading-tight border border-transparent whitespace-nowrap",

  variants: {
    variant: {
      primary: "bg-primary text-background hover:[&[href]]:bg-primary/75",
      soft: "bg-border/50 hover:[&[href]]:bg-border/75 hover:[&[type]]:bg-border/75",
      outline: "bg-background border-border hover:[&[href]]:bg-accent hover:[&[type]]:bg-accent",
      success: "bg-green-500/50 text-foreground",
      warning: "bg-yellow-500/50 text-foreground",
      danger: "bg-red-500/50 text-foreground",
    },
    size: {
      sm: "px-1 py-px gap-1 text-[0.625rem]",
      md: "px-1.5 py-0.5 gap-1.5 text-xs",
      lg: "px-2 py-1 gap-2 text-sm rounded-md",
    },
  },

  defaultVariants: {
    variant: "soft",
    size: "md",
  },
})

type BadgeProps = Omit<ComponentProps<"span">, "prefix"> &
  VariantProps<typeof badgeVariants> & {
    /**
     * If set to `true`, the button will be rendered as a child within the component.
     * This child component must be a valid React component.
     */
    asChild?: boolean

    /**
     * The slot to be rendered before the label.
     */
    prefix?: ReactNode

    /**
     * The slot to be rendered after the label.
     */
    suffix?: ReactNode
  }

const badgeAffixVariants = cva({
  base: "shrink-0 size-[1.1em]",
})

const Badge = ({
  children,
  className,
  asChild,
  variant,
  size,
  prefix,
  suffix,
  ...props
}: BadgeProps) => {
  const useAsChild = asChild && isValidElement(children)
  const Comp = useAsChild ? Slot.Root : "span"

  return (
    <Comp className={cx(badgeVariants({ variant, size, className }))} {...props}>
      <Slottable child={children} asChild={asChild}>
        {child => (
          <>
            {prefix && <Slot.Root className={cx(badgeAffixVariants())}>{prefix}</Slot.Root>}
            {child}
            {suffix && <Slot.Root className={cx(badgeAffixVariants())}>{suffix}</Slot.Root>}
          </>
        )}
      </Slottable>
    </Comp>
  )
}

export { Badge, badgeVariants }
