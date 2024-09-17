import { Slot } from "@radix-ui/react-slot"
import { type HTMLAttributes, forwardRef, isValidElement } from "react"
import { cx } from "~/utils/cva"

export type CardProps = HTMLAttributes<HTMLElement> & {
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
        "fade-in relative flex flex-col items-start gap-4 w-full border bg-card p-5 overflow-clip rounded-lg",
        "hover:[&[href]]:bg-card-dark hover:[&[href]]:border-border-dark",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  )
})

CardBase.displayName = "Card"

export const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return <div className={cx("flex w-full items-center gap-x-3 gap-y-2", className)} {...props} />
}

export const CardFooter = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div
      className={cx("flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted", className)}
      {...props}
    />
  )
}

export const CardDescription = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <p
      className={cx("line-clamp-2 text-sm/normal text-secondary text-pretty", className)}
      {...props}
    />
  )
}

export const Card = Object.assign(CardBase, {
  Header: CardHeader,
  Footer: CardFooter,
  Description: CardDescription,
})
