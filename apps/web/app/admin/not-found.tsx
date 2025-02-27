import { H2 } from "~/components/common/heading"

export default function NotFound() {
  return (
    <div className="flex flex-col gap-2 max-w-sm">
      <H2>404 Not Found</H2>

      <p className="text-muted-foreground text-pretty">
        We're sorry, but the page you're looking for doesn't exist.
      </p>
    </div>
  )
}
