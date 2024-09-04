import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cx } from "apps/web/app/utils/cva"
import { CheckIcon } from "lucide-react"
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from "react"

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cx(
      "peer size-4 shrink-0 rounded-sm border disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-card data-[state=checked]:text-foreground",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cx("flex items-center justify-center text-current")}>
      <CheckIcon className="size-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
