import { Slot } from "radix-ui"
import type { ComponentProps, ReactNode } from "react"
import { Children, isValidElement } from "react"
import { boxVariants } from "~/components/common/box"
import { Icon } from "~/components/common/icon"
import { Slottable } from "~/components/common/slottable"
import { type VariantProps, cva, cx } from "~/utils/cva"

const buttonVariants = cva({
  base: [
    "group/button relative inline-flex items-center justify-center border-transparent! font-display font-medium text-[0.8125rem] text-start leading-tight rounded-md overflow-clip hover:z-10 hover:border-transparent",
    "disabled:opacity-60 disabled:pointer-events-none",
  ],

  variants: {
    variant: {
      fancy: "bg-primary text-primary-foreground hover:opacity-90",
      primary: "text-background bg-foreground hover:opacity-90",
      secondary:
        "border-border! bg-background text-secondary-foreground hover:bg-card hover:border-ring!",
      ghost: "text-secondary-foreground hover:bg-accent hover:text-foreground",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    },
    size: {
      sm: "px-2 py-1 gap-[0.66ch]",
      md: "px-3 py-2 gap-[0.75ch]",
      lg: "px-4 py-2.5 gap-[1ch] rounded-lg sm:text-sm",
    },
    isPending: {
      true: "[&>*:not(.animate-spin)]:opacity-0 select-none",
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "lg",
  },
})

const buttonAffixVariants = cva({
  base: "shrink-0 first:-ml-[0.21425em] last:-mr-[0.21425em] [&:is(svg)]:size-[1.1em] [&:is(svg)]:opacity-75",
})

export type ButtonProps = Omit<ComponentProps<"button">, "size" | "prefix"> &
  VariantProps<typeof buttonVariants> &
  VariantProps<typeof boxVariants> & {
    /**
     * If set to `true`, the button will be rendered as a child within the component.
     * This child component must be a valid React component.
     */
    asChild?: boolean

    /**
     * If set to `true`, the button will be rendered in the pending state.
     */
    isPending?: boolean

    /**
     * The slot to be rendered before the label.
     */
    prefix?: ReactNode

    /**
     * The slot to be rendered after the label.
     */
    suffix?: ReactNode
  }

const Button = ({
  children,
  className,
  disabled,
  asChild,
  isPending,
  prefix,
  suffix,
  variant,
  size,
  hover = true,
  focus = true,
  ...props
}: ButtonProps) => {
  const useAsChild = asChild && isValidElement(children)
  const Comp = useAsChild ? Slot.Root : "button"

  return (
    <Comp
      disabled={disabled ?? isPending}
      className={cx(
        boxVariants({ hover, focus }),
        buttonVariants({ variant, size, isPending, className }),
      )}
      {...props}
    >
      <Slottable child={children} asChild={asChild}>
        {child => (
          <>
            <Slot.Root className={buttonAffixVariants()}>{prefix}</Slot.Root>

            {Children.count(child) !== 0 && (
              <span className="flex-1 truncate only:text-center has-[div]:contents">{child}</span>
            )}

            <Slot.Root className={buttonAffixVariants()}>{suffix}</Slot.Root>

            {!!isPending && (
              <Icon name="lucide/loader" className="absolute size-[1.25em] animate-spin" />
            )}
          </>
        )}
      </Slottable>
    </Comp>
  )
}

export { Button, buttonVariants }
