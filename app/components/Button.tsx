import { Slot } from "@radix-ui/react-slot"
import { LoaderIcon } from "lucide-react"
import type { ButtonHTMLAttributes, ReactNode } from "react"
import { Children, forwardRef, isValidElement } from "react"
import { cva, cx, type VariantProps } from "~/utils/cva"
import { Slottable } from "./Slottable"

export const buttonVariants = cva({
  base: [
    "group relative inline-flex items-center justify-center border font-medium -tracking-micro rounded-md hover:z-10",
    "disabled:opacity-60 disabled:pointer-events-none",
  ],

  variants: {
    variant: {
      fancy: "!border-transparent bg-pink-600 text-neutral-50 hover:bg-pink-700",
      primary:
        "!border-transparent text-neutral-950 bg-current [&>*]:invert hover:opacity-90 dark:text-neutral-50",
      secondary: [
        "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-100",
        "dark:text-neutral-400 dark:bg-transparent dark:border-neutral-700/50 dark:bg-neutral-800/40 dark:hover:border-neutral-700 dark:hover:bg-neutral-800",
      ],
    },
    size: {
      sm: "text-[13px]/none gap-[0.5ch] py-1 px-2",
      md: "text-[13px]/tight gap-[0.75ch] py-2 px-3",
      lg: "text-sm/tight gap-[1ch] py-2 px-4",
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

export const buttonAffixVariants = cva({
  base: "shrink-0 size-[1.1em] first:-ml-[0.21425em] last:-mr-[0.21425em] only:m-0",
})

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size" | "prefix"> &
  Omit<VariantProps<typeof buttonVariants>, "isAffixOnly"> & {
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
    ...rest
  } = props

  const isChildrenEmpty = (children: ReactNode) => {
    return Children.count(children) === 0
  }

  const useAsChild = asChild && isValidElement(children)
  const Component = useAsChild ? Slot : "button"

  // Determine if the button has affix only.
  const isAffixOnly = isChildrenEmpty(children) && (!prefix || !suffix)

  return (
    <Component
      ref={ref}
      disabled={disabled ?? isPending}
      className={cx(buttonVariants({ variant, size, isAffixOnly, isPending, className }))}
      {...rest}
    >
      <Slottable child={children} asChild={asChild}>
        {(child) => (
          <>
            <Slot className={buttonAffixVariants()}>{prefix}</Slot>
            {!isChildrenEmpty(child) && <span className="truncate">{child}</span>}
            <Slot className={buttonAffixVariants()}>{suffix}</Slot>

            {!!isPending && <LoaderIcon className="absolute size-[1.25em] animate-spin" />}
          </>
        )}
      </Slottable>
    </Component>
  )
})

Button.displayName = "Button"
