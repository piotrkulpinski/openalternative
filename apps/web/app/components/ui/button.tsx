import { Slot } from "@radix-ui/react-slot"
import { LoaderIcon } from "lucide-react"
import type { ButtonHTMLAttributes, ReactNode } from "react"
import { Children, forwardRef, isValidElement } from "react"
import { Box } from "~/components/ui/box"
import { Slottable } from "~/components/ui/slottable"
import { type VariantProps, cva, cx } from "~/utils/cva"

const buttonVariants = cva({
  base: [
    "group/button relative max-w-80 inline-flex items-center justify-center border font-medium text-left rounded-md hover:z-10",
    "disabled:opacity-60 disabled:pointer-events-none",
  ],

  variants: {
    variant: {
      fancy:
        "!border-transparent bg-gradient-to-br from-primary to-primary/85 text-white hover:opacity-90",
      primary: "!border-transparent text-background bg-foreground hover:opacity-90",
      secondary: "bg-background text-secondary hover:bg-card hover:border-border-dark",
      ghost: "!border-transparent bg-transparent text-foreground hover:bg-card",
    },
    size: {
      sm: "text-[0.8125rem]/none gap-[0.66ch] py-1 px-2",
      md: "text-[0.8125rem]/tight gap-[0.75ch] py-1.5 px-3",
      lg: "text-[0.8125rem]/tight gap-[1ch] py-2 px-4 sm:text-sm/tight",
    },
    isAffixOnly: {
      true: "",
    },
    isPending: {
      true: "[&>*:not(.animate-spin)]:text-transparent select-none",
    },
  },

  compoundVariants: [
    // Is affix only
    { size: "sm", isAffixOnly: true, class: "px-1" },
    { size: "md", isAffixOnly: true, class: "px-1.5" },
    { size: "lg", isAffixOnly: true, class: "px-2" },
  ],

  defaultVariants: {
    variant: "primary",
    size: "lg",
  },
})

const buttonAffixVariants = cva({
  base: "shrink-0 size-[1.1em]",
})

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size" | "prefix"> &
  VariantProps<typeof buttonVariants> & {
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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    children,
    className,
    disabled,
    asChild,
    isPending,
    prefix,
    suffix,
    variant,
    size,
    isAffixOnly,
    ...rest
  } = props

  const isChildrenEmpty = (children: ReactNode) => {
    return Children.count(children) === 0
  }

  const useAsChild = asChild && isValidElement(children)
  const Component = useAsChild ? Slot : "button"

  return (
    <Box hover focus>
      <Component
        ref={ref}
        disabled={disabled ?? isPending}
        className={cx(buttonVariants({ variant, size, isAffixOnly, isPending, className }))}
        {...rest}
      >
        <Slottable child={children} asChild={asChild}>
          {child => (
            <>
              <Slot className={buttonAffixVariants()}>{prefix}</Slot>
              {!isChildrenEmpty(child) && (
                <span className="flex-1 truncate only:text-center">{child}</span>
              )}
              <Slot className={buttonAffixVariants()}>{suffix}</Slot>

              {!!isPending && <LoaderIcon className="absolute size-[1.25em] animate-spin" />}
            </>
          )}
        </Slottable>
      </Component>
    </Box>
  )
})

Button.displayName = "Button"
