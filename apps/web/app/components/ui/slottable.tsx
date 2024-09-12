import type { ReactNode } from "react"
import { cloneElement, forwardRef, isValidElement } from "react"

export type SlottableProps = {
  asChild?: boolean
  child?: ReactNode
  children: (child: ReactNode) => ReactNode
}

export const Slottable = forwardRef<HTMLElement, SlottableProps>((props, ref) => {
  const { asChild, child, children, ...rest } = props

  if (!asChild) {
    return children(child)
  }

  if (!isValidElement(child)) {
    return null
  }

  // @ts-expect-error
  return cloneElement(child, { ref, ...rest }, children(child.props?.children))
})

Slottable.displayName = "Slottable"
