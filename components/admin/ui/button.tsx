import { Slot } from "@radix-ui/react-slot"
import { LoaderIcon } from "lucide-react"
import { Children, type ComponentProps, type ReactNode } from "react"
import { Slottable } from "~/components/common/slottable"
import { type VariantProps, cva, cx } from "~/utils/cva"

const buttonVariants = cva({
  base: "group/button relative shrink-0 min-w-0 inline-flex items-center justify-center rounded-md text-sm/tight font-medium focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",

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
      sm: "px-3 py-2 gap-[0.66ch] rounded-md text-xs/tight",
      md: "px-4 py-2 gap-[0.75ch]",
      lg: "px-6 py-2.5 gap-[1ch] rounded-md",
    },

    isAffixOnly: {
      true: "",
    },

    isPending: {
      true: "text-transparent select-none",
    },
  },

  compoundVariants: [
    // Is affix only
    { size: "sm", isAffixOnly: true, class: "px-2" },
    { size: "md", isAffixOnly: true, class: "px-2" },
    { size: "lg", isAffixOnly: true, class: "px-2.5" },
  ],

  defaultVariants: {
    variant: "default",
    size: "md",
  },
})

const buttonAffixVariants = cva({
  base: "shrink-0 size-[1.1em] opacity-75",
})

type ButtonProps = Omit<ComponentProps<"button">, "size" | "prefix"> &
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

const Button = ({
  children,
  className,
  variant,
  size,
  asChild,
  isPending,
  prefix,
  suffix,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button"

  const isChildrenEmpty = (children: ReactNode) => {
    return Children.count(children) === 0
  }

  // Determine if the button has affix only.
  const isAffixOnly = isChildrenEmpty(children) && (!prefix || !suffix)

  return (
    <Comp
      className={cx(buttonVariants({ variant, size, isPending, isAffixOnly, className }))}
      {...props}
    >
      <Slottable child={children} asChild={asChild}>
        {child => (
          <>
            <Slot className={buttonAffixVariants()} aria-hidden="true">
              {prefix}
            </Slot>

            {child}

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
}

export { Button, buttonVariants, type ButtonProps }
