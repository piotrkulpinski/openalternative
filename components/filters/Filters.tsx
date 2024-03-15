"use client"

import { Box, Checkbox, Field, H5, Input, Series, Sidebar } from "@curiousleaf/design"
import { useQueryStates } from "nuqs"
import { config } from "~/config"

export const Filters = () => {
  const [filters, setFilters] = useQueryStates(config.filters, {
    shallow: false,
    clearOnDefault: true,
    throttleMs: 350,
  })

  const technologies = ["React", "Vue", "Svelte", "Angular", "Ember", "Preact"]

  return (
    <Sidebar>
      <H5>Filter Tools</H5>
      <Sidebar.Separator fullWidth />

      <Input
        placeholder="Search for tools..."
        value={filters.query}
        onChange={(e) => setFilters({ query: e.target.value })}
      />

      <Field label="Technology">
        <Series direction="column" className="text-xs">
          {technologies?.map((value, i) => (
            <Box
              key={`${value}-${i}`}
              label={value}
              className="w-full border-0 bg-transparent p-0 shadow-none"
            >
              <Checkbox
                value={value}
                defaultChecked={filters.technologies.includes(value)}
                onCheckedChange={(checked) => {
                  setFilters({
                    technologies: checked
                      ? [...filters.technologies, value]
                      : filters.technologies.filter((v) => v !== value),
                  })
                }}
              />
            </Box>
          ))}
        </Series>
      </Field>
    </Sidebar>
  )
}
