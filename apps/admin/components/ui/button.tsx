import { Slot } from "@radix-ui/react-slot"
import { LoaderIcon } from "lucide-react"
import * as React from "react"
import { Slottable } from "~/components/ui/slottable"
import { type VariantProps, cva, cx } from "~/utils/cva"

export const buttonVariants = cva({
  base: "group/button relative shrink-0 min-w-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",

  variants: {
    variant: {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-muted hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },

    size: {
      sm: "h-8 gap-[0.66ch] rounded-md px-3 text-xs",
      md: "h-9 gap-[0.75ch] px-4 py-2",
      lg: "h-10 gap-[1ch] rounded-md px-8",
      icon: "size-8 text-sm",
    },

    isPending: {
      true: "text-transparent select-none",
    },
  },

  defaultVariants: {
    variant: "default",
    size: "md",
  },
})

export const buttonAffixVariants = cva({
  base: "shrink-0 size-[1.1em] opacity-75",
})

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "prefix">,
    VariantProps<typeof buttonVariants> {
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
  prefix?: React.ReactNode

  /**
   * The slot to be rendered after the label.
   */
  suffix?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant, size, asChild, isPending, prefix, suffix, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cx(buttonVariants({ variant, size, isPending, className }))}
        ref={ref}
        {...props}
      >
        <Slottable child={children} asChild={asChild}>
          {child => (
            <>
              <Slot className={buttonAffixVariants()} aria-hidden="true">
                {prefix}
              </Slot>

              {React.Children.count(child) !== 0 && <span className="truncate">{child}</span>}

              <Slot className={buttonAffixVariants()} aria-hidden="true">
                {suffix}
              </Slot>

              {!!isPending && (
                <LoaderIcon className="absolute size-[1.25em] animate-spin text-white" />
              )}
            </>
          )}
        </Slottable>
      </Comp>
    )
  },
)
Button.displayName = "Button"
