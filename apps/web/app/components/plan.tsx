import { Slot } from "@radix-ui/react-slot"
import { redirect, useFetcher, useParams } from "@remix-run/react"
import { ArrowUpRightIcon, CheckIcon, XIcon } from "lucide-react"
import { posthog } from "posthog-js"
import {
  type ComponentProps,
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useEffect,
} from "react"
import { PlanIntervalSwitch } from "~/components/plan-interval-switch"
import { Badge } from "~/components/ui/badge"
import { Button, type ButtonProps } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { H5 } from "~/components/ui/heading"
import { Ping } from "~/components/ui/ping"
import { Stack } from "~/components/ui/stack"
import { Tooltip, TooltipProvider } from "~/components/ui/tooltip"
import { type ProductInterval, usePlanPrices } from "~/hooks/use-plan-prices"
import type { StripeCheckoutSchema, action } from "~/routes/api.stripe.create-checkout"
import { type VariantProps, cva, cx } from "~/utils/cva"

const planVariants = cva({
  base: "gap-6 p-4 basis-72 grow max-w-80 bg-transparent md:p-6",
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

export const Plan = forwardRef<PlanElement, PlanProps>((props, ref) => {
  const {
    className,
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

  const params = useParams()
  const { data, state, submit } = useFetcher<typeof action>()
  const { isSubscription, currentPrice, price, fullPrice, discount, interval, setInterval } =
    usePlanPrices(prices)

  useEffect(() => {
    if (data?.url) {
      window.open(data.url, "_blank")?.focus()
    }
  }, [data])

  const onSubmit = () => {
    if (!currentPrice.priceId) {
      throw redirect("/submit/thanks")
    }

    const payload = {
      priceId: currentPrice.priceId,
      slug: params.slug ?? "",
      mode: isSubscription ? "subscription" : "payment",
    } satisfies StripeCheckoutSchema

    // Submit the action
    submit(payload, {
      method: "POST",
      encType: "application/json",
      action: "/api/stripe/create-checkout",
    })

    // Capture the event
    posthog.capture("submit_checkout", { price: currentPrice.priceId })
  }

  return (
    <Card
      ref={ref}
      isRevealed={false}
      isFeatured={isFeatured}
      className={cx(planVariants({ className }))}
      {...rest}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <H5>{name}</H5>

          {isSubscription && prices.length > 1 && (
            <PlanIntervalSwitch
              intervals={[
                { label: "Monthly", value: "month" },
                { label: "Yearly", value: "year" },
              ]}
              value={interval}
              onChange={setInterval}
            />
          )}
        </div>

        {description && <p className="text-muted text-sm text-pretty">{description}</p>}
      </div>

      <div className="relative flex items-end w-full">
        <span className="self-start mt-1 mr-1 text-xl/none font-display">$</span>

        <strong className="relative font-display font-semibold -tracking-wide text-4xl/[0.9] sm:text-5xl/[0.9]">
          <span className="tabular-nums">{Math.round(price)}</span>

          {!!fullPrice && (
            <del className="absolute ml-1 left-full -top-3 text-[0.4em] font-normal align-top">
              <span className="tabular-nums">{Math.round(fullPrice)}</span>
            </del>
          )}
        </strong>

        {price > 0 && (
          <div className="m-1 text-muted text-base/none md:text-lg/none">
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

                <span className={cx("truncate", type === "negative" && "opacity-50")}>{text}</span>

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
        onClick={onSubmit}
        suffix={<ArrowUpRightIcon />}
        className="mt-auto w-full"
        isPending={state !== "idle"}
        {...buttonProps}
      />
    </Card>
  )
})

Plan.displayName = "Plan"
