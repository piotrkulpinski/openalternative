import NumberFlow, { type Value } from "@number-flow/react"
import { type ComponentProps, useEffect, useState } from "react"

export const Stat = ({ value, ...props }: ComponentProps<typeof NumberFlow>) => {
  const [state, setState] = useState<Value>(0)

  useEffect(() => setState(value), [value])

  return <NumberFlow {...props} value={state} continuous />
}
