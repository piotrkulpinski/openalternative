import NumberFlow from "@number-flow/react"
import { Slot } from "@radix-ui/react-slot"
import { useFetcher, useParams } from "@remix-run/react"
import { ArrowUpRightIcon, CheckIcon, XIcon } from "lucide-react"
import { posthog } from "posthog-js"
import { type ComponentProps, type HTMLAttributes, forwardRef, useEffect } from "react"
import type Stripe from "stripe"
import { PlanIntervalSwitch } from "~/components/plan-interval-switch"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { H5 } from "~/components/ui/heading"
import { Ping } from "~/components/ui/ping"
import { Stack } from "~/components/ui/stack"
import { Tooltip, TooltipProvider } from "~/components/ui/tooltip"
import { usePlanPrices } from "~/hooks/use-plan-prices"
import type {
  StripeCheckoutSchema,
  action as createCheckoutAction,
} from "~/routes/api.stripe.create-checkout"
import type {
  StripeGetPricesSchema,
  action as createGetPricesAction,
} from "~/routes/api.stripe.get-prices"
import { type VariantProps, cva, cx } from "~/utils/cva"

const planVariants = cva({
  base: "gap-6 basis-72 grow max-w-80",
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

export type PlanFeature = {
  /**
   * The text of the feature.
   */
  name?: string

  /**
   * The footnote of the feature.
   */
  footnote?: string

  /**
   * The type of the feature.
   */
  type?: "positive" | "neutral" | "negative"
}

export type PlanProps = Omit<HTMLAttributes<HTMLDivElement>, "size"> &
  ComponentProps<typeof Card> &
  VariantProps<typeof planVariants> & {
    plan: Stripe.Product & {
      /**
       * The features of the plan.
       */
      features?: PlanFeature[]
    }

    /**
     * Whether the plan is featured.
     */
    isFeatured?: boolean
  }

export const Plan = forwardRef<HTMLDivElement, PlanProps>((props, ref) => {
  const { className, plan, isFeatured, ...rest } = props

  const params = useParams()
  const checkoutFetcher = useFetcher<typeof createCheckoutAction>()
  const pricesFetcher = useFetcher<typeof createGetPricesAction>()

  const { isSubscription, currentPrice, price, fullPrice, discount, interval, setInterval } =
    usePlanPrices(pricesFetcher.data?.prices || [])

  useEffect(() => {
    if (pricesFetcher.state === "idle" && !pricesFetcher.data) {
      const payload: StripeGetPricesSchema = {
        productId: plan.id,
      }

      pricesFetcher.submit(payload, {
        method: "POST",
        encType: "application/json",
        action: "/api/stripe/get-prices",
      })
    }
  }, [pricesFetcher, plan.id])

  useEffect(() => {
    if (checkoutFetcher.data?.url) {
      window.open(checkoutFetcher.data.url, "_blank")?.focus()
    }
  }, [checkoutFetcher.data])

  const onSubmit = () => {
    if (!params.tool) return

    const payload: StripeCheckoutSchema = {
      priceId: currentPrice.id,
      tool: params.tool,
      mode: isSubscription ? "subscription" : "payment",
    }

    checkoutFetcher.submit(payload, {
      method: "POST",
      encType: "application/json",
      action: "/api/stripe/create-checkout",
    })

    // Capture the event (assuming posthog is available)
    posthog.capture("submit_checkout", { price: currentPrice.id })
  }

  return (
    <Card
      ref={ref}
      hover={false}
      isRevealed={false}
      className={cx(planVariants({ className }))}
      {...rest}
    >
      {isFeatured && <Card.Bg />}

      <div className="w-full space-y-3">
        <div className="flex items-center justify-between gap-2">
          <H5>{plan.name}</H5>

          {isSubscription && pricesFetcher.data?.prices && pricesFetcher.data.prices.length > 1 && (
            <PlanIntervalSwitch
              intervals={[
                { label: "Monthly", value: "month" },
                { label: "Yearly", value: "year" },
              ]}
              value={interval}
              onChange={setInterval}
              className="-my-0.5"
            />
          )}
        </div>

        {plan.description && <p className="text-muted text-sm text-pretty">{plan.description}</p>}
      </div>

      <div className="relative flex items-end w-full">
        <span className="self-start mt-1 mr-1 text-xl/none font-display">$</span>

        <div className="relative font-display -tracking-wide text-4xl/[0.9] sm:text-5xl/[0.9]">
          <NumberFlow
            value={price}
            format={{ notation: "compact" }}
            locales="en-US"
            className="!flex items-center h-[0.9em] font-semibold tabular-nums"
            continuous
          />

          {!!fullPrice && (
            <del className="absolute ml-1 left-full -top-3 text-[0.4em] text-muted">
              <span className="tabular-nums">{Math.round(fullPrice)}</span>
            </del>
          )}
        </div>

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

      {!!plan.features && (
        <TooltipProvider delayDuration={0} disableHoverableContent>
          <Stack direction="column">
            {plan.features.map(({ type, name, footnote }) => (
              <div key={name} className={cx(planFeatureVariants())}>
                <Slot className={cx(planFeatureCheckVariants({ type }))}>
                  {type === "negative" ? <XIcon /> : <CheckIcon />}
                </Slot>

                <span className={cx("truncate", type === "negative" && "opacity-50")}>{name}</span>

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
        className="mt-auto w-full"
        variant={!price ? "secondary" : "primary"}
        isPending={checkoutFetcher.state !== "idle" || !pricesFetcher.data}
        disabled={!price}
        suffix={<ArrowUpRightIcon />}
        onClick={onSubmit}
      >
        {!price ? "Current Package" : (plan.metadata.label ?? `Choose ${plan.name}`)}
      </Button>
    </Card>
  )
})

Plan.displayName = "Plan"
