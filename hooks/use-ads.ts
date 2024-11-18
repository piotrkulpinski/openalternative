"use client"

import type { SponsoringType } from "@openalternative/db"
import { useCallback, useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"
import { calculateAdsPrice } from "~/utils/ads"

export type AdsPicker = {
  label: string
  type: SponsoringType
  description: string
  price: number
}

export type AdsSelection = {
  type: SponsoringType
  dateRange?: DateRange
  duration?: number
}

type UseAdsProps = {
  calendars: AdsPicker[]
}

export const useAds = ({ calendars }: UseAdsProps) => {
  const [selections, setSelections] = useState<AdsSelection[]>([])

  const clearSelection = useCallback((type: SponsoringType) => {
    setSelections(prev => prev.filter(s => s.type !== type))
  }, [])

  const updateSelection = useCallback(
    (type: SponsoringType, selection: Partial<Omit<AdsSelection, "type">>) => {
      setSelections(prev => {
        const existing = prev.find(s => s.type === type)
        if (!existing) {
          return [...prev, { type, ...selection }]
        }

        return prev.map(s => (s.type === type ? { ...s, ...selection } : s))
      })
    },
    [],
  )

  const hasSelections = useMemo(() => {
    return selections.some(s => s.duration && s.duration > 0)
  }, [selections])

  const price = useMemo(() => {
    const selectedItems = selections
      .filter(s => s.duration && s.duration > 0)
      .map(selection => ({
        price: calendars.find(c => c.type === selection.type)?.price ?? 0,
        duration: selection.duration,
      }))

    if (selectedItems.length === 0) return null

    const basePrice = Math.min(...calendars.map(c => c.price))
    return calculateAdsPrice(selectedItems, basePrice)
  }, [selections, calendars])

  return {
    price,
    selections,
    hasSelections,
    clearSelection,
    updateSelection,
  }
}
