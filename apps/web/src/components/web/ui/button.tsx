import { Slot } from "@radix-ui/react-slot"
import { LoaderIcon } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import { isValidElement } from "react"
import { boxVariants } from "~/components/common/box"
import { Slottable } from "~/components/common/slottable"
import { type VariantProps, cva, cx } from "~/utils/cva"
import { isChildrenEmpty } from "~/utils/helpers"

const buttonVariants = cva({
  base: [
    "group/button relative inline-flex items-center justify-center border font-medium text-[0.8125rem] text-start leading-tight rounded-md hover:z-10",
    "disabled:opacity-60 disabled:pointer-events-none",
  ],

  variants: {
    variant: {
      fancy: "border-transparent! bg-primary text-white hover:opacity-90",
      primary: "border-transparent! text-background bg-foreground hover:opacity-90",
      secondary: "bg-background text-secondary hover:bg-card hover:border-border-dark",
      ghost: "border-transparent! text-foreground hover:bg-card-dark",
    },
    size: {
      sm: "gap-[0.66ch] py-1 px-2 leading-none",
      md: "gap-[0.75ch] py-1.5 px-3",
      lg: "gap-[1ch] py-2.5 px-4 rounded-lg sm:text-sm",
    },
    isPending: {
      true: "[&>*:not(.animate-spin)]:text-transparent select-none",
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "lg",
  },
})

const buttonAffixVariants = cva({
  base: "shrink-0 first:-ml-[0.21425em] last:-mr-[0.21425em] size-[1.1em]",
})

export type ButtonProps = Omit<ComponentProps<"button">, "size" | "prefix"> &
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
  disabled,
  asChild,
  isPending,
  prefix,
  suffix,
  variant,
  size,
  ...props
}: ButtonProps) => {
  const useAsChild = asChild && isValidElement(children)
  const Comp = useAsChild ? Slot : "button"

  return (
    <Comp
      disabled={disabled ?? isPending}
      className={cx(
        boxVariants({ hover: true, focus: true }),
        buttonVariants({ variant, size, isPending, className }),
      )}
      {...props}
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
    </Comp>
  )
}

export { Button, buttonVariants }
