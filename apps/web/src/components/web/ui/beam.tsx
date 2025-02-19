import { type ComponentProps, useEffect, useRef } from "react"
import { cx } from "~/utils/cva"

export const Beam = ({ className, ...props }: ComponentProps<"div">) => {
  const meteorRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const meteor = meteorRef.current

    meteor.addEventListener("animationend", () => {
      meteor.style.visibility = "hidden"
      const animationDelay = Math.floor(Math.random() * (2 - 0) + 0)
      const animationDuration = Math.floor(Math.random() * (4 - 0) + 0)
      const meteorWidth = Math.floor(Math.random() * (100 - 20) + 20)
      meteor.style.setProperty("--meteor-delay", `${animationDelay}s`)
      meteor.style.setProperty("--meteor-duration", `${animationDuration}s`)
      meteor.style.setProperty("--meteor-width", `${meteorWidth}px`)

      restartAnimation()
    })

    meteor.addEventListener("animationstart", () => {
      meteor.style.visibility = "visible"
    })

    return () => {
      const meteor = meteorRef.current
      if (meteor) {
        meteor.removeEventListener("animationend", () => {})
        meteor.removeEventListener("animationstart", () => {})
      }
    }
  }, [])

  const restartAnimation = () => {
    const meteor = meteorRef.current
    meteor.style.animation = "none"
    void meteor.offsetWidth
    meteor.style.animation = ""
  }

  return (
    <div
      ref={meteorRef}
      className={cx(
        "meteor absolute top-0 inset-x-0 z-[40] size-[0.1rem] rounded-full bg-gradient-to-r from-foreground/35 via-foreground/35 to-transparent shadow-foreground/10 shadow-[0_0_0_1px_var(--tw-shadow-color)] rotate-[180deg]",
        className,
      )}
      {...props}
    />
  )
}
