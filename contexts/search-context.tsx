"use client"

import { type PropsWithChildren, createContext, use, useState } from "react"

export type SearchContextType = {
  isOpen: boolean
  open: () => void
  close: () => void
}

const SearchContext = createContext<SearchContextType>(null!)

const SearchProvider = (props: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return <SearchContext.Provider value={{ isOpen, open, close }} {...props} />
}

const useSearch = () => {
  const context = use(SearchContext)

  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }

  return context
}

export { SearchProvider, useSearch }
