"use client"

import { isTruthy } from "@curiousleaf/utils"
import { useCallback, useEffect, useState } from "react"
import { getElementPosition } from "~/utils/helpers"

export type InlineMenuItem = {
  id: string
  title: string
}

export const useInlineMenu = (menu: InlineMenuItem[]) => {
  const [active, setActive] = useState<string | undefined>(menu[0]?.id)

  /**
   * Returns an array of positions of the headings in the document.
   * @param headings - An array of HeadingTree objects.
   * @returns An array of positions of the headings in the document.
   */
  const getHeadingPositions = useCallback((menu: InlineMenuItem[]) => {
    return (
      menu
        .map(({ id }) => id)
        // Get the position of each heading.
        .map(getElementPosition)
        // Remove headings that don't have a position.
        .filter(isTruthy)
    )
  }, [])

  const showMenuElement = useCallback((id?: string) => {
    const element = id ? document.querySelector(`a[href="#${id}"]`) : null

    if (element) {
      const parent = element.parentElement

      if (parent) {
        const parentRect = parent.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()
        const offset = elementRect.top - parentRect.top

        parent.scrollTop =
          parent.scrollTop + offset - parentRect.height / 2 + elementRect.height / 2
      }
    }
  }, [])

  useEffect(() => {
    const headingPositions = getHeadingPositions(menu).reverse()

    const onScroll = () => {
      for (const pos of headingPositions) {
        if (window.scrollY >= pos.top) {
          setActive(pos.id)
          showMenuElement(pos.id)
          return
        }
      }
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [getHeadingPositions, menu])

  return active
}
