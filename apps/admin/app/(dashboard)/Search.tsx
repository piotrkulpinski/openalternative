"use client"

import { LucideLoader, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Input } from "~/components/Input"

export function SearchInput() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function searchAction(formData: FormData) {
    const value = formData.get("q") as string
    const params = new URLSearchParams({ q: value })
    startTransition(() => {
      router.replace(`/?${params.toString()}`)
    })
  }

  return (
    <form action={searchAction} className="relative ml-auto flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-[.75rem] size-4 text-muted-foreground" />
      <Input
        name="q"
        type="search"
        placeholder="Search..."
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
      />

      {isPending && <LucideLoader className="animate-spin" />}
    </form>
  )
}
