import type { CSSProperties, HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

export const NorthernLights = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cx(
        "fixed inset-x-0 top-0 z-50 flex h-32 flex-row items-center justify-center px-4 text-center bg-fd-background text-md gap-4 font-semibold pointer-events-none opacity-25",
        className,
      )}
      {...props}
    >
      <div
        className="absolute inset-0 -z-10 mix-blend-difference animate-movingBanner direction-reverse"
        style={
          {
            "--start": "rgba(0,87,255,0.5)",
            "--mid": "rgba(255,0,166,0.77)",
            "--end": "rgba(255,77,0,0.4)",
            "--via": "rgba(164,255,68,0.4)",

            maskImage:
              "linear-gradient(to bottom,white,transparent), radial-gradient(circle at top center, white, transparent)",
            maskComposite: "intersect",
            backgroundImage:
              "repeating-linear-gradient(60deg, var(--end), var(--start) 2%, var(--start) 5%, transparent 8%, transparent 14%, var(--via) 18%, var(--via) 22%, var(--mid) 28%, var(--mid) 30%, var(--via) 34%, var(--via) 36%, transparent, var(--end) calc(50% - 12px))",
            backgroundSize: "200% 100%",
          } as CSSProperties
        }
      />

      <div
        className="absolute inset-0 -z-10 mix-blend-color-dodge animate-movingBanner"
        style={
          {
            "--start": "rgba(255,120,120,0.5)",
            "--mid": "rgba(36,188,255,0.4)",
            "--end": "rgba(64,0,255,0.51)",
            "--via": "rgba(255,89,0,0.56)",

            maskImage:
              "linear-gradient(to bottom,white,transparent), radial-gradient(circle at top center, white, transparent)",
            maskComposite: "intersect",
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--end), var(--start) 4%, var(--start) 8%, transparent 9%, transparent 14%, var(--mid) 16%, var(--mid) 20%, transparent, var(--via) 36%, var(--via) 40%, transparent 42%, var(--end) 46%, var(--end) calc(50% - 16.8px))",
            backgroundSize: "200% 100%",
          } as CSSProperties
        }
      />
    </div>
  )
}
