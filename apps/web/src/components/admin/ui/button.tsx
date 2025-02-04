import { Slot } from "@radix-ui/react-slot"
import { LoaderIcon } from "lucide-react"
import { type ComponentProps, type ReactNode, isValidElement } from "react"
import { Slottable } from "~/components/common/slottable"
import { type VariantProps, cva, cx } from "~/utils/cva"
import { isChildrenEmpty } from "~/utils/helpers"

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

    isPending: {
      true: "[&>*:not(.animate-spin)]:text-transparent select-none",
    },
  },

  defaultVariants: {
    variant: "default",
    size: "md",
  },
})

const buttonAffixVariants = cva({
  base: "shrink-0 first:-ml-[0.21425em] last:-mr-[0.21425em] size-[1.1em] opacity-75",
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
  const useAsChild = asChild && isValidElement(children)
  const Comp = useAsChild ? Slot : "button"

  return (
    <Comp className={cx(buttonVariants({ variant, size, isPending, className }))} {...props}>
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
    </Comp>
  )
}

export { Button, buttonVariants, type ButtonProps }
