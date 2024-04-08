import { createContext, useContext } from "react"
import { z } from "zod"
import { createStore, useStore } from "zustand"

export const toolsSearchParamsSchema = z.object({
  page: z.string().optional(),
  query: z.string().optional(),
  order: z.string().optional(),
})

export type ToolsSearchParams = z.infer<typeof toolsSearchParamsSchema>

export type ToolsStore = ReturnType<typeof createToolsStore>

export type ToolsState = {
  searchParams: ToolsSearchParams
  setSearchParams: (searchParams: ToolsSearchParams) => void
}

export const createToolsStore = (initProps?: Partial<ToolsSearchParams>) => {
  return createStore<ToolsState>()((set) => ({
    searchParams: initProps ?? {},
    setSearchParams: (searchParams) => set(() => ({ searchParams })),
  }))
}

export const ToolsContext = createContext<ToolsStore | null>(null)

export const useToolsContext = <T>(selector: (state: ToolsState) => T): T => {
  const store = useContext(ToolsContext)
  if (!store) throw new Error("Missing ToolsContext.Provider in the tree")
  return useStore(store, selector)
}
