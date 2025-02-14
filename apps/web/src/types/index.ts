import type { ColumnSort } from "@tanstack/react-table"

export type StringKeyOf<TData> = Extract<keyof TData, string>

export type Option = {
  label: string
  value: string
  icon?: React.ReactNode
  withCount?: boolean
}

export type ExtendedColumnSort<TData> = Omit<ColumnSort, "id"> & {
  id: StringKeyOf<TData>
}

export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[]

export type DataTableFilterField<TData> = {
  id: StringKeyOf<TData>
  label: string
  placeholder?: string
  options?: Option[]
}

export type DataTableFilterOption<TData> = {
  id: string
  label: string
  value: keyof TData
  options: Option[]
  filterValues?: string[]
  filterOperator?: string
  isMulti?: boolean
}

export type DataTableRowAction<TData> = {
  data: TData
  type: "schedule" | "delete"
}
