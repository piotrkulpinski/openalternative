import { Slot } from "radix-ui"
import { type ComponentProps, isValidElement } from "react"
import { H5, type Heading } from "~/components/common/heading"
import { type VariantProps, cva, cx } from "~/utils/cva"

const tileVariants = cva({
  base: "group flex justify-between items-center gap-4 min-w-0 -my-2 py-2",
})

type TileProps = ComponentProps<"div"> &
  VariantProps<typeof tileVariants> & {
    /**
     * If set to `true`, the button will be rendered as a child within the component.
     * This child component must be a valid React component.
     */
    asChild?: boolean
  }

const Tile = ({ className, asChild, ...props }: TileProps) => {
  const useAsChild = asChild && isValidElement(props.children)
  const Comp = useAsChild ? Slot.Root : "div"

  return <Comp className={cx(tileVariants({ className }))} {...props} />
}

const TileTitle = ({ className, ...props }: ComponentProps<typeof Heading>) => {
  return <H5 className={cx("truncate", className)} {...props} />
}

const TileDivider = ({ className, ...props }: ComponentProps<"hr">) => {
  return <hr className={cx("min-w-2 flex-1 group-hover:border-ring", className)} {...props} />
}

const TileCaption = ({ className, ...props }: ComponentProps<"span">) => {
  return <span className={cx("shrink-0 text-xs text-secondary-foreground", className)} {...props} />
}

export { Tile, TileTitle, TileDivider, TileCaption }
