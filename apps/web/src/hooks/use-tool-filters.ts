import { use } from "react"
import { ToolFiltersContext } from "~/contexts/tool-filter-context"

export const useToolFilters = () => {
  const context = use(ToolFiltersContext)

  if (context === undefined) {
    throw new Error("useToolFilter must be used within a ToolFilterProvider")
  }

  return context
}
