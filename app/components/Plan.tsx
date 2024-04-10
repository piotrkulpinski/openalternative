"use client"

import { Slot } from "@radix-ui/react-slot"
import { type HTMLAttributes, ReactNode, forwardRef, isValidElement } from "react"

import { formatIntervalAmount } from "@curiousleaf/utils"
import { VariantProps, cva, cx } from "~/utils/cva"
import { Card } from "./Card"
import { H3 } from "./Heading"
import { Series } from "./Series"
import { CheckIcon, XIcon } from "lucide-react"

export const planVariants = cva({
  base: "gap-8 p-4 min-w-64 md:p-6",

  variants: {
    isFeatured: {
      true: "border-neutral-400 dark:border-neutral-600",
    },
  },

  defaultVariants: {
    isFeatured: false,
  },
})

export const planFeatureVariants = cva({
  base: "flex gap-3 text-sm",
})

export const planFeatureCheckVariants = cva({
  base: "shrink-0 p-0.5 text-white text-lg rounded-smooth",

  variants: {
    type: {
      positive: "bg-green-500",
      negative: "bg-neutral-400",
    },
  },
})

export type PlanElement = HTMLDivElement

export type PlanProps = Omit<HTMLAttributes<PlanElement>, "size"> &
  VariantProps<typeof planVariants> & {
    /**
     * If set to `true`, the button will be rendered as a child within the component.
     * This child component must be a valid React component.
     */
    asChild?: boolean

    /**
     * The price of the plan.
     */
    price: {
      /**
       * The unit amount of the price.
       */
      amount: number

      /**
       * The interval of the price.
       */
      interval: "month" | "year"
    }

    /**
     * The name of the plan.
     */
    name: string

    /**
     * The description of the plan.
     */
    description?: string

    /**
     * The features of the plan.
     */
    features?: {
      /**
       * The text of the feature.
       */
      text: string

      /**
       * The footnote of the feature.
       */
      footnote?: ReactNode | string

      /**
       * The type of the feature.
       */
      type?: "positive" | "negative"
    }[]
  }

export const Plan = forwardRef<PlanElement, PlanProps>((props, ref) => {
  const { children, className, asChild, price, name, description, features, isFeatured, ...rest } =
    props

  const useAsChild = asChild && isValidElement(children)
  const Component = useAsChild ? Slot : "div"

  return (
    <Card asChild>
      <Component ref={ref} className={cx(planVariants({ isFeatured, className }))} {...rest}>
        <div className="space-y-3">
          <H3>{name}</H3>

          {description && (
            <Card.Description className="text-neutral-600">{description}</Card.Description>
          )}
        </div>

        <div className="relative flex flex-wrap items-end gap-1 font-medium">
          <span className="text-xl/none text-neutral-400">$</span>

          <span className="text-4xl font-semibold tracking-tighter !leading-[0.85em]">
            {formatIntervalAmount(price.amount, price.interval)}
          </span>

          <div className="text-xs text-neutral-500">
            /mo
            {price.interval === "year" && <div>billed annually</div>}
          </div>
        </div>

        {!!features?.length && (
          <Series direction="column" className="mb-auto">
            {features.map(({ type, text }) => (
              <div key={text} className={cx(planFeatureVariants())}>
                <Slot className={cx(planFeatureCheckVariants({ type }))}>
                  {type === "negative" ? <XIcon /> : <CheckIcon />}
                </Slot>

                <span className={cx(type === "negative" && "text-neutral-500")}>{text}</span>
              </div>
            ))}
          </Series>
        )}

        {children}
      </Component>
    </Card>
  )
})

Plan.defaultProps = {
  asChild: false,
  isFeatured: false,
}

Plan.displayName = "Plan"
