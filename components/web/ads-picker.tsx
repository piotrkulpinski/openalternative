"use client"

import { formatDateRange } from "@primoui/utils"
import { cx } from "cva"
import { endOfDay, startOfDay } from "date-fns"
import plur from "plur"
import posthog from "posthog-js"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { createStripeAdsCheckout } from "~/actions/stripe"
import { AnimatedContainer } from "~/components/common/animated-container"
import { Badge } from "~/components/common/badge"
import { Button } from "~/components/common/button"
import { Icon } from "~/components/common/icon"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { AdsCalendar } from "~/components/web/ads-calendar"
import { Price } from "~/components/web/price"
import { config } from "~/config"
import { useAds } from "~/hooks/use-ads"
import type { AdMany } from "~/server/web/ads/payloads"

type AdsPickerProps = ComponentProps<"div"> & {
  ads: AdMany[]
}

export const AdsPicker = ({ className, ads, ...props }: AdsPickerProps) => {
  const { price, selections, hasSelections, findAdSpot, clearSelection, updateSelection } = useAds()

  const { execute, isPending } = useServerAction(createStripeAdsCheckout, {
    onSuccess: ({ data }) => {
      posthog.capture("stripe_checkout_ad", { ...price })

      window.open(data, "_blank")?.focus()
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  const handleCheckout = () => {
    const checkoutData = selections
      .filter(({ dateRange, duration }) => dateRange?.from && dateRange?.to && duration)
      .map(selection => {
        const adSpot = findAdSpot(selection.type)

        const discountedPrice = price?.discountPercentage
          ? adSpot.price * (1 - price.discountPercentage / 100)
          : adSpot.price

        return {
          type: selection.type,
          price: discountedPrice,
          duration: selection.duration ?? 0,
          metadata: {
            startDate: selection.dateRange?.from?.getTime() ?? 0,
            endDate: selection.dateRange?.to?.getTime() ?? 0,
          },
        }
      })

    execute(checkoutData)
  }

  return (
    <div className={cx("flex flex-col min-w-md border divide-y rounded-md", className)} {...props}>
      <div className="flex flex-wrap overflow-clip">
        {config.ads.adSpots.map(adSpot => (
          <AdsCalendar
            key={adSpot.type}
            adSpot={adSpot}
            ads={ads}
            price={price}
            selections={selections}
            updateSelection={updateSelection}
            className="border-l border-t -ml-px -mt-px"
          />
        ))}
      </div>

      <AnimatedContainer height>
        {hasSelections && (
          <div className="flex flex-col gap-3 text-sm text-muted-foreground p-4">
            {selections.map(selection => {
              if (!selection.dateRange?.from || !selection.dateRange?.to || !selection.duration) {
                return null
              }

              const adSpot = findAdSpot(selection.type)
              const from = startOfDay(selection.dateRange.from)
              const to = endOfDay(selection.dateRange.to)

              return (
                <div key={selection.type} className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="flex items-center gap-2 mr-auto">
                    <Button
                      variant="secondary"
                      size="sm"
                      aria-label={`Clear ${adSpot.label} selection`}
                      prefix={<Icon name="lucide/x" />}
                      onClick={() => clearSelection(selection.type)}
                    />

                    <div>
                      <strong className="font-medium text-foreground">{adSpot.label}</strong> – (
                      {selection.duration} {plur("day", selection.duration)})
                    </div>
                  </span>

                  <span>{formatDateRange(from, to)}</span>
                </div>
              )
            })}
          </div>
        )}
      </AnimatedContainer>

      <Stack className="text-center p-4 sm:justify-between sm:text-start">
        {price ? (
          <>
            <Stack size="sm" className="mr-auto">
              <Note>Total:</Note>
              <Price price={price.discountedPrice} fullPrice={price.totalPrice} />
            </Stack>

            {price.discountPercentage > 0 && (
              <Tooltip tooltip="Discount applied based on the order value. Max 30% off.">
                <Badge
                  size="lg"
                  variant="outline"
                  className="-my-1.5 text-green-700/90 dark:text-green-300/90"
                >
                  {price.discountPercentage}% off
                </Badge>
              </Tooltip>
            )}
          </>
        ) : (
          <Note>Please select dates for at least one ad type</Note>
        )}

        <Button
          variant="fancy"
          size="md"
          disabled={!hasSelections || isPending}
          isPending={isPending}
          className="max-sm:w-full sm:-my-2"
          onClick={handleCheckout}
        >
          Purchase Now
        </Button>
      </Stack>
    </div>
  )
}
