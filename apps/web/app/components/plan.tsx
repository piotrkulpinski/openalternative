import { Slot } from "@radix-ui/react-slot"
import { ArrowUpRightIcon, CheckIcon, XIcon } from "lucide-react"
import {
  type ComponentProps,
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  isValidElement,
  useState,
} from "react"
import { PlanIntervalSwitch } from "~/components/plan-interval-switch"
import { Badge } from "~/components/ui/badge"
import { Button, type ButtonProps } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { H5 } from "~/components/ui/heading"
import { Ping } from "~/components/ui/ping"
import { Prose } from "~/components/ui/prose"
import { Stack } from "~/components/ui/stack"
import { Tooltip, TooltipProvider } from "~/components/ui/tooltip"
import { type VariantProps, cva, cx } from "~/utils/cva"

const planVariants = cva({
  base: "gap-6 p-4 basis-72 grow max-w-96 bg-transparent md:p-6",
})

const planFeatureVariants = cva({
  base: "flex gap-3 text-sm",
})

const planFeatureCheckVariants = cva({
  base: "shrink-0 size-5 stroke-[3px] p-1 rounded-md",

  variants: {
    type: {
      positive: "bg-green-700/90 text-background dark:bg-green-300/90",
      neutral: "bg-foreground/10",
      negative: "bg-foreground/10",
    },
  },
})

export type PlanElement = HTMLDivElement

export type PlanProps = Omit<HTMLAttributes<PlanElement>, "size"> &
  ComponentProps<typeof Card> &
  VariantProps<typeof planVariants> & {
    /**
     * If set to `true`, the button will be rendered as a child within the component.
     * This child component must be a valid React component.
     */
    asChild?: boolean

    /**
     * If set to `true`, the plan will be hidden.
     */
    isHidden?: boolean

    /**
     * The props of the button.
     */
    buttonProps?: ButtonProps

    /**
     * The prices of the plan. If empty, the plan is free.
     */
    prices: { interval?: ProductInterval; price: number; priceId: string }[]

    /**
     * The name of the plan.
     */
    name: string

    /**
     * The description of the plan.
     */
    description?: string

    /**
     * The amount of discount applied to the plan.
     */
    discount?: number

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
      type?: "positive" | "neutral" | "negative"
    }[]
  }

const intervals = [
  { label: "Monthly", value: "month" },
  { label: "Yearly", value: "year" },
]

export type ProductInterval = (typeof intervals)[number]["value"]

export const Plan = forwardRef<PlanElement, PlanProps>((props, ref) => {
  const {
    children,
    className,
    asChild,
    isHidden,
    buttonProps,
    prices,
    name,
    description,
    features,
    isFeatured,
    ...rest
  } = props

  if (isHidden) return null

  const [interval, setInterval] = useState<ProductInterval>("month")

  const useAsChild = asChild && isValidElement(children)
  const Component = useAsChild ? Slot : "div"

  const getPriceForInterval = (interval: ProductInterval | undefined) => {
    if (prices.length === 0) {
      return { price: 0, priceId: undefined, interval: undefined }
    }
    const selectedPrice = prices.find(p => p.interval === interval)
    return selectedPrice ?? prices[0]
  }

  const isSubscription = prices.length > 0 && prices.some(p => p.interval)
  const currentPrice = getPriceForInterval(isSubscription ? interval : undefined)
  const monthlyPrice = isSubscription ? getPriceForInterval("month") : currentPrice

  const priceValue = isSubscription
    ? currentPrice.price / (interval === "month" ? 100 : 1200)
    : currentPrice.price / 100

  const monthlyPriceValue = monthlyPrice.price / 100

  const originalPrice = isSubscription && interval === "year" ? monthlyPriceValue : null
  const discount =
    isSubscription && interval === "year"
      ? Math.round((1 - priceValue / monthlyPriceValue) * 100)
      : null

  // const { execute, isPending } = useServerAction(createStripeCheckout, {
  //   onSuccess: ({ data }) => {
  //     window.open(data, "_blank")?.focus()
  //   },

  //   onError: ({ err }) => {
  //     toast.error(err.message)
  //   },
  // })

  // const onSubmit = () => {
  //   if (!currentPrice.priceId) {
  //     return router.push("/submit/thanks")
  //   }

  //   // Execute the action
  //   execute({
  //     priceId: currentPrice.priceId,
  //     slug: params.slug,
  //     mode: isSubscription ? "subscription" : "payment",
  //   })
  // }

  return (
    <Card
      isRevealed={false}
      isFeatured={isFeatured}
      className={cx(planVariants({ className }))}
      asChild
    >
      <Component ref={ref} {...rest}>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <H5>{name}</H5>

            {isSubscription && prices.length > 1 && (
              <PlanIntervalSwitch intervals={intervals} value={interval} onChange={setInterval} />
            )}
          </div>

          {description && (
            <Prose className="text-foreground/50 text-sm text-pretty">{description}</Prose>
          )}
        </div>

        <div className="relative flex items-end w-full">
          <span className="self-start mt-1 mr-1 text-xl/none font-display">$</span>

          <strong className="relative font-display font-semibold -tracking-wide text-4xl/[0.9] sm:text-5xl/[0.9]">
            <span className="tabular-nums">{Math.round(priceValue)}</span>

            {!!originalPrice && (
              <del className="absolute ml-1 left-full -top-3 text-[0.4em] font-normal align-top decoration-from-font">
                <span className="tabular-nums">{Math.round(originalPrice)}</span>
              </del>
            )}
          </strong>

          {priceValue > 0 && (
            <div className="m-0.5 opacity-50 text-base/none md:text-lg/none">
              /{isSubscription ? "month" : "one-time"}
            </div>
          )}

          {discount && (
            <Badge variant="success" className="absolute -top-3.5 right-0">
              {discount}% off
            </Badge>
          )}
        </div>

        {!!features?.length && (
          <TooltipProvider delayDuration={0} disableHoverableContent>
            <Stack direction="column" className="mb-auto">
              {features.map(({ type, text, footnote }) => (
                <div key={text} className={cx(planFeatureVariants())}>
                  <Slot className={cx(planFeatureCheckVariants({ type }))}>
                    {type === "negative" ? <XIcon /> : <CheckIcon />}
                  </Slot>

                  <span className={cx("truncate", type === "negative" && "text-foreground/50")}>
                    {text}
                  </span>

                  {footnote && (
                    <Tooltip tooltip={footnote}>
                      <Ping className="-ml-1 mt-1" />
                    </Tooltip>
                  )}
                </div>
              ))}
            </Stack>
          </TooltipProvider>
        )}

        <Button
          type="button"
          // onClick={onSubmit}
          suffix={<ArrowUpRightIcon />}
          className="mt-auto w-full"
          // isPending={isPending}
          {...buttonProps}
        />
      </Component>
    </Card>
  )
})

Plan.displayName = "Plan"
