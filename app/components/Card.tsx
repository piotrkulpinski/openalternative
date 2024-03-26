import { HTMLAttributes, forwardRef, isValidElement } from "react"
import { cx } from "~/utils/cva"
import { Slot } from "@radix-ui/react-slot"

type CardProps = HTMLAttributes<HTMLElement> & {
  /**
   * If set to `true`, the button will be rendered as a child within the component.
   * This child component must be a valid React component.
   */
  asChild?: boolean
}

export const CardBase = forwardRef<HTMLDivElement, CardProps>(({ ...props }, ref) => {
  const { children, className, asChild, ...rest } = props

  const useAsChild = asChild && isValidElement(children)
  const Component = useAsChild ? Slot : "div"

  return (
    <Component
      ref={ref}
      className={cx(
        "fade-in relative flex flex-col items-start gap-4 overflow-clip rounded-md border bg-neutral-50 p-5 hover:border-neutral-300 dark:border-neutral-700/50 dark:bg-neutral-800/40 dark:hover:border-neutral-700",
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  )
})

CardBase.displayName = "Card"

export const CardHeader = ({ className, ...rest }: HTMLAttributes<HTMLElement>) => {
  return <div className={cx("flex w-full items-center gap-x-3 gap-y-2", className)} {...rest} />
}

export const Card = Object.assign(CardBase, { Header: CardHeader })
