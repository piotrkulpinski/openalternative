import { Skeleton } from "~/components/ui/Skeleton"

export const CardSkeleton = () => (
  <div className="flex flex-col gap-2 p-6 rounded-xl border bg-card text-card-foreground">
    <div className="flex flex-row items-center justify-between gap-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="size-4" />
    </div>

    <div className="flex flex-col">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-4 w-48" />
    </div>
  </div>
)
