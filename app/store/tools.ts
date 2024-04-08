import { createContext, useContext } from "react"
import { z } from "zod"
import { createStore, useStore } from "zustand"

export const toolsSearchParamsSchema = z.object({
  page: z.string().nullish(),
  query: z.string().nullish(),
  order: z.string().nullish(),
  alternative: z.array(z.string()).optional(),
  category: z.array(z.string()).optional(),
  language: z.array(z.string()).optional(),
  topic: z.array(z.string()).optional(),
})

export type ToolsSearchParams = z.infer<typeof toolsSearchParamsSchema>

export type ToolsStore = ReturnType<typeof createToolsStore>

export type ToolsState = {
  searchParams: ToolsSearchParams
  setSearchParams: (searchParams: ToolsSearchParams) => void
  isFiltersOpen: boolean
  toggleFilters: () => void
}

export const createToolsStore = (initProps?: Partial<ToolsSearchParams>) => {
  return createStore<ToolsState>()((set) => ({
    searchParams: initProps ?? {},
    setSearchParams: (searchParams) => set(() => ({ searchParams })),
    isFiltersOpen: false,
    toggleFilters: () => set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),
  }))
}

export const ToolsContext = createContext<ToolsStore | null>(null)

export const useToolsContext = <T>(selector: (state: ToolsState) => T): T => {
  const store = useContext(ToolsContext)
  if (!store) throw new Error("Missing ToolsContext.Provider in the tree")
  return useStore(store, selector)
}
