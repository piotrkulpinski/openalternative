import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from "react"
import { Box } from "~/components/ui/box"
import { cx } from "~/utils/cva"

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <Box hover focusWithin>
    <CheckboxPrimitive.Root
      ref={ref}
      className={cx(
        "peer size-4 shrink-0 rounded disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-card data-[state=checked]:text-foreground",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cx("flex items-center justify-center text-current")}>
        <CheckIcon className="size-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  </Box>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
