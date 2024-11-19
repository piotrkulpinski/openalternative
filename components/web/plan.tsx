"use client"

import NumberFlow from "@number-flow/react"
import { Slot } from "@radix-ui/react-slot"
import { ArrowUpRightIcon, CheckIcon, XIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import type Stripe from "stripe"
import { useServerAction } from "zsa-react"
import { createStripeCheckout } from "~/actions/stripe"
import { H5 } from "~/components/common/heading"
import { Skeleton } from "~/components/common/skeleton"
import { Stack } from "~/components/common/stack"
import { PlanIntervalSwitch } from "~/components/web/plan-interval-switch"
import { Badge } from "~/components/web/ui/badge"
import { Button } from "~/components/web/ui/button"
import { Card, type cardVariants } from "~/components/web/ui/card"
import { Ping } from "~/components/web/ui/ping"
import { Tooltip } from "~/components/web/ui/tooltip"
import { TooltipProvider } from "~/components/web/ui/tooltip"
import { usePlanPrices } from "~/hooks/use-plan-prices"
import { isToolPublished } from "~/lib/tools"
import type { ToolOne } from "~/server/tools/payloads"
import { type VariantProps, cva, cx } from "~/utils/cva"

const planVariants = cva({
  base: "items-stretch gap-8 basis-72 grow max-w-80",
})

const planFeatureVariants = cva({
  base: "flex gap-3 text-sm",
})

const planFeatureCheckVariants = cva({
  base: "shrink-0 size-5 stroke-[3px] p-1 rounded-md",

  variants: {
    type: {
      positive: "bg-green-700/90 text-white dark:bg-green-500/50",
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
    coupon?: Stripe.Coupon | null

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
  const { isSubscription, currentPrice, price, fullPrice, discount, interval, setInterval } =
    usePlanPrices(prices ?? [], coupon)

  const { execute, isPending } = useServerAction(createStripeCheckout, {
    onSuccess: ({ data }) => {
      window.open(data, "_blank")?.focus()
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
    <Card hover={false} isRevealed={false} className={cx(planVariants({ className }))} {...props}>
      {isFeatured && <Card.Bg />}

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

      <div className="relative flex items-end font-display">
        <span className="self-start mt-1 mr-1 text-xl/none">$</span>

        <div className="relative -tracking-wide text-4xl/[0.9] sm:text-5xl/[0.9]">
          <NumberFlow
            value={price}
            format={{ notation: "compact" }}
            locales="en-US"
            className="!flex items-center h-[0.9em] font-semibold tabular-nums"
            continuous
          />

          {!!fullPrice && (
            <del className="absolute ml-1 left-full -top-3 text-[0.4em] text-foreground/50">
              <span className="tabular-nums">{Math.round(fullPrice)}</span>
            </del>
          )}
        </div>

        {price > 0 && (
          <div className="m-1 text-foreground/50 text-base/none md:text-lg/none">
            /{isSubscription ? "month" : "one-time"}
          </div>
        )}

        {!!discount && (
          <Badge variant="success" className="absolute -top-3.5 right-0">
            {discount}% off
            {coupon?.max_redemptions && (
              <span className="text-foreground/65">
                ({coupon.max_redemptions - coupon.times_redeemed}
                {coupon.max_redemptions > coupon.max_redemptions - coupon.times_redeemed &&
                  `/${coupon.max_redemptions}`}{" "}
                left)
              </span>
            )}
          </Badge>
        )}
      </div>

      {!!features && (
        <TooltipProvider delayDuration={0} disableHoverableContent>
          <Stack direction="column" className="items-stretch">
            {features.map(({ type, name, footnote }) => (
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
        className="mt-auto"
        variant={!price ? "secondary" : "primary"}
        isPending={isPending}
        disabled={!price || isPending}
        suffix={<ArrowUpRightIcon />}
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
    <Card hover={false} isRevealed={false} className={cx(planVariants())}>
      <div className="space-y-3">
        <H5 asChild>
          <Skeleton className="w-24">&nbsp;</Skeleton>
        </H5>

        <div className="flex flex-col gap-2">
          <Skeleton className="w-full h-4">&nbsp;</Skeleton>
          <Skeleton className="w-3/4 h-4">&nbsp;</Skeleton>
        </div>
      </div>

      <Skeleton className="w-1/4 text-4xl/[0.9] sm:text-5xl/[0.9]">&nbsp;</Skeleton>

      <Stack direction="column" className="items-stretch">
        {[...Array(6)].map((_, index) => (
          <div key={index} className={cx(planFeatureVariants())}>
            <div className={cx(planFeatureCheckVariants({ type: "neutral" }))}>&nbsp;</div>

            <Skeleton className="w-3/4">&nbsp;</Skeleton>
          </div>
        ))}
      </Stack>

      <Button variant="secondary" className="mt-auto" disabled>
        &nbsp;
      </Button>
    </Card>
  )
}

export { Plan, PlanSkeleton, type PlanProps }
