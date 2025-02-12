"use server"

import { createServerAction } from "zsa"
import { findAlternatives } from "~/server/web/alternatives/queries"
import { findCategories } from "~/server/web/categories/queries"
import { findLicenses } from "~/server/web/licenses/queries"
import { findStacks } from "~/server/web/stacks/queries"
import type { FilterOption, FilterType } from "~/types/search"

export const findFilterOptions = createServerAction().handler(
  async (): Promise<Record<FilterType, FilterOption[]>> => {
    const [alternative, category, stack, license] = await Promise.all([
      findAlternatives({}).then(r =>
        r.map(({ slug, name, _count }) => ({ slug, name, count: _count.tools })),
      ),
      findCategories({}).then(r =>
        r.map(({ slug, name, _count }) => ({ slug, name, count: _count.tools })),
      ),
      findStacks({}).then(r =>
        r.map(({ slug, name, _count }) => ({ slug, name, count: _count.tools })),
      ),
      findLicenses({}).then(r =>
        r.map(({ slug, name, _count }) => ({ slug, name, count: _count.tools })),
      ),
    ])

    return {
      alternative,
      category,
      stack,
      license,
    }
  },
)
