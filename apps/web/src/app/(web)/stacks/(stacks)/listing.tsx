import { StackList } from "~/components/web/stacks/stack-list"
import { findStacks } from "~/server/web/stacks/queries"

export const StackListing = async () => {
  const stacks = await findStacks({})

  return <StackList stacks={stacks} showCount />
}
