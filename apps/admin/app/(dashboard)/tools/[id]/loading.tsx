import { Loader } from "lucide-react"

export default function LoadingPage() {
  return (
    <div className="grid place-items-center h-dvh">
      <Loader className="animate-spin" />
    </div>
  )
}
