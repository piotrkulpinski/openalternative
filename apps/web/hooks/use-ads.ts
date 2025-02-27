"use client"

import type { AdType } from "@openalternative/db/client"
import { useCallback, useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"
import { config } from "~/config"
import { calculateAdsPrice } from "~/utils/ads"

export type AdsPicker = {
  label: string
  type: AdType
  description: string
  price: number
}

export type AdsSelection = {
  type: AdType
  dateRange?: DateRange
  duration?: number
}

export const useAds = () => {
  const [selections, setSelections] = useState<AdsSelection[]>([])
  const spots = config.ads.adSpots

  const findAdSpot = useCallback((type: AdType) => {
    return spots.find(s => s.type === type) ?? spots[0]
  }, [])

  const clearSelection = useCallback((type: AdType) => {
    setSelections(prev => prev.filter(s => s.type !== type))
  }, [])

  const updateSelection = useCallback(
    (type: AdType, selection: Partial<Omit<AdsSelection, "type">>) => {
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
        price: findAdSpot(selection.type).price,
        duration: selection.duration,
      }))

    if (selectedItems.length === 0) return null

    const basePrice = Math.min(...spots.map(s => s.price))
    return calculateAdsPrice(selectedItems, basePrice)
  }, [selections, spots])

  return {
    price,
    selections,
    hasSelections,
    findAdSpot,
    clearSelection,
    updateSelection,
  }
}
