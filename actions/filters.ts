"use server"

import { createServerAction } from "zsa"
import { findAlternatives } from "~/server/web/alternatives/queries"
import { findCategories } from "~/server/web/categories/queries"
import { findLicenses } from "~/server/web/licenses/queries"
import { findStacks } from "~/server/web/stacks/queries"

export const findFilterOptions = createServerAction().handler(async () => {
  const filters = await Promise.all([
    findAlternatives({}),
    findCategories({}),
    findStacks({}),
    findLicenses({}),
  ])

  // Map the filters to the expected format
  const [alternative, category, stack, license] = filters.map(r =>
    r.map(({ slug, name, _count }) => ({ slug, name, count: _count.tools })),
  )

  return { alternative, category, stack, license } as const
})
