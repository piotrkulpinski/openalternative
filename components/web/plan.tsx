"use client"

import { useRouter } from "next/navigation"
import { posthog } from "posthog-js"
import { Slot } from "radix-ui"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import type Stripe from "stripe"
import { useServerAction } from "zsa-react"
import { createStripeToolCheckout } from "~/actions/stripe"
import { Button } from "~/components/common/button"
import { Card, CardBg, type cardVariants } from "~/components/common/card"
import { H5 } from "~/components/common/heading"
import { Ping } from "~/components/common/ping"
import { Skeleton } from "~/components/common/skeleton"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { PlanIntervalSwitch } from "~/components/web/plan-interval-switch"
import { Price } from "~/components/web/price"
import { usePlanPrices } from "~/hooks/use-plan-prices"
import { isToolPublished } from "~/lib/tools"
import type { ToolOne } from "~/server/web/tools/payloads"
import { type VariantProps, cva, cx } from "~/utils/cva"
import { Icon } from "../common/icon"

const planVariants = cva({
  base: "items-stretch gap-8 basis-72 grow max-w-80 bg-transparent overflow-clip",
})

const planFeatureVariants = cva({
  base: "flex gap-3 text-sm",
})

const planFeatureCheckVariants = cva({
  base: "shrink-0 size-5 stroke-[3px] p-1 rounded-md",

  variants: {
    type: {
      positive: "bg-green-500/50",
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

type PlanProps = ComponentProps<"div"> &
  VariantProps<typeof cardVariants> &
  VariantProps<typeof planVariants> & {
    /**
     * The plan.
     */
    plan: Stripe.Product

    /**
     * The features of the plan.
     */
    features: PlanFeature[]

    /**
     * The prices of the plan.
     */
    prices: Stripe.Price[]

    /**
     * The discount coupon.
     */
    coupon?: Stripe.Coupon

    /**
     * The slug of the tool.
     */
    tool: ToolOne

    /**
     * Whether the plan is featured.
     */
    isFeatured?: boolean
  }

const Plan = ({
  className,
  plan,
  features,
  prices,
  coupon,
  tool,
  isFeatured,
  ...props
}: PlanProps) => {
  const router = useRouter()
  const { isSubscription, currentPrice, price, fullPrice, discount, interval, setInterval } =
    usePlanPrices(prices, coupon)

  const { execute, isPending } = useServerAction(createStripeToolCheckout, {
    onSuccess: ({ data }) => {
      posthog.capture("stripe_checkout_tool", {
        tool: tool.slug,
        mode: isSubscription ? "featured" : "expedited",
      })

      router.push(data)
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  const onSubmit = () => {
    // Execute the action
    execute({
      priceId: currentPrice.id,
      tool: tool.slug,
      mode: isSubscription ? "subscription" : "payment",
      coupon: coupon?.id,
    })
  }

  return (
    <Card
      hover={false}
      className={cx(planVariants({ className }), isFeatured && "lg:-my-3 lg:py-8")}
      {...props}
    >
      {isFeatured && <CardBg />}

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <H5>{plan.name}</H5>

          {isSubscription && prices.length > 1 && (
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

        {plan.description && (
          <p className="text-foreground/50 text-sm text-pretty">{plan.description}</p>
        )}
      </div>

      <Price
        price={price}
        fullPrice={fullPrice}
        interval={isSubscription ? "month" : "one-time"}
        discount={discount}
        coupon={coupon}
        format={{ style: "decimal", notation: "compact", maximumFractionDigits: 0 }}
        className="w-full"
        priceClassName="text-[3em]"
      />

      {!!features && (
        <Stack direction="column" className="my-auto items-stretch">
          {features.map(({ type, name, footnote }) => (
            <div key={name} className={cx(planFeatureVariants())}>
              <Slot.Root className={cx(planFeatureCheckVariants({ type }))}>
                {type === "negative" ? <Icon name="lucide/x" /> : <Icon name="lucide/check" />}
              </Slot.Root>

              <span className={cx("truncate", type === "negative" && "opacity-50")}>{name}</span>

              {footnote && (
                <Tooltip tooltip={footnote} delayDuration={0}>
                  <Ping className="-ml-1 mt-1" />
                </Tooltip>
              )}
            </div>
          ))}
        </Stack>
      )}

      <Button
        type="button"
        variant={!price ? "secondary" : isFeatured ? "fancy" : "primary"}
        isPending={isPending}
        disabled={!price || isPending}
        suffix={!price ? <span /> : <Icon name="lucide/arrow-up-right" />}
        onClick={onSubmit}
      >
        {!price
          ? "Current Package"
          : isToolPublished(tool)
            ? "Upgrade Listing"
            : (plan.metadata.label ?? `Choose ${plan.name}`)}
      </Button>
    </Card>
  )
}

const PlanSkeleton = () => {
  return (
    <Card hover={false} className={cx(planVariants())}>
      <div className="space-y-3">
        <H5>
          <Skeleton className="w-24">&nbsp;</Skeleton>
        </H5>

        <div className="flex flex-col gap-2">
          <Skeleton className="w-full h-4">&nbsp;</Skeleton>
          <Skeleton className="w-3/4 h-4">&nbsp;</Skeleton>
        </div>
      </div>

      <Skeleton className="w-1/4 h-[0.9em] text-[3em]">&nbsp;</Skeleton>

      <Stack direction="column" className="my-auto items-stretch">
        {[...Array(5)].map((_, index) => (
          <div key={index} className={cx(planFeatureVariants())}>
            <div className={cx(planFeatureCheckVariants({ type: "neutral" }))}>&nbsp;</div>

            <Skeleton className="w-3/4">&nbsp;</Skeleton>
          </div>
        ))}
      </Stack>

      <Button variant="secondary" disabled>
        &nbsp;
      </Button>
    </Card>
  )
}

export { Plan, PlanSkeleton, type PlanProps }
