"use client"

import { AdType } from "@prisma/client"
import posthog from "posthog-js"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { createStripeAlternativeAdsCheckout } from "~/actions/stripe"
import { RelationSelector } from "~/components/admin/relation-selector"
import { Button } from "~/components/common/button"
import { Card, CardBg, CardHeader } from "~/components/common/card"
import { H5 } from "~/components/common/heading"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { ExternalLink } from "~/components/web/external-link"
import { Price } from "~/components/web/price"
import { config } from "~/config"
import type { AlternativeMany } from "~/server/web/alternatives/payloads"

type AlternativesAdPickerProps = {
  alternatives: AlternativeMany[]
  defaultIds?: string[]
}

export const AlternativesAdPicker = ({ alternatives, defaultIds }: AlternativesAdPickerProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultIds ?? [])
  const [selectedAlternatives, setSelectedAlternatives] = useState<AlternativeMany[]>([])
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    const alts = alternatives.filter(({ id }) => selectedIds.includes(id))
    setSelectedAlternatives(alts)
    setTotalPrice(alts.reduce((sum, alt) => sum + (alt.adPrice || 0), 0))
  }, [alternatives, selectedIds])

  const { execute, isPending } = useServerAction(createStripeAlternativeAdsCheckout, {
    onSuccess: ({ data }) => {
      posthog.capture("stripe_checkout_ad", { totalPrice })

      window.open(data, "_blank")?.focus()
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  const handleCheckout = () => {
    execute({
      type: AdType.AlternativePage,
      alternatives: selectedAlternatives.map(({ slug, name, adPrice }) => ({
        slug,
        name: `${name} Alternatives Ad`,
        price: adPrice ?? 0,
      })),
    })
  }

  return (
    <Stack size="lg" direction="column" className="w-full max-w-md mx-auto">
      <Card hover={false} className="bg-transparent">
        <CardBg />

        <CardHeader wrap={false}>
          <H5 className="w-full text-center">Select the alternatives to advertise on</H5>
        </CardHeader>

        <RelationSelector
          relations={alternatives}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          mapFunction={({ id, name, faviconUrl, adPrice }) => {
            return {
              id,
              name: (
                <Stack size="sm">
                  {faviconUrl && (
                    <img
                      src={faviconUrl}
                      alt=""
                      className="shrink-0 size-4 rounded-sm"
                      loading="lazy"
                    />
                  )}

                  <span className="truncate">{name}</span>

                  {adPrice && `($${adPrice}/mo)`}
                </Stack>
              ),
            }
          }}
        />

        <Stack className="w-full justify-between">
          {selectedAlternatives.length > 0 ? (
            <Stack size="sm" className="mr-auto">
              <Note>Total:</Note>
              <Price price={totalPrice} interval="month" />
            </Stack>
          ) : (
            <Note>Please select at least one alternative</Note>
          )}

          <Button
            variant="fancy"
            size="md"
            disabled={!selectedIds.length || isPending}
            isPending={isPending}
            className="ml-auto"
            onClick={handleCheckout}
          >
            Purchase Now
          </Button>
        </Stack>
      </Card>

      <Note className="w-full text-xs text-center">
        You can cancel at any time. Have any questions? Please{" "}
        <ExternalLink
          href={`mailto:${config.site.email}`}
          className="underline hover:text-foreground"
        >
          contact us
        </ExternalLink>
        .
      </Note>
    </Stack>
  )
}
