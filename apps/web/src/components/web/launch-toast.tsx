"use client"

import { useLocalStorage } from "@mantine/hooks"
import { useEffect } from "react"
import { toast } from "sonner"

const START_TIME = new Date("2025-02-20T08:01:00.000Z") // 12:01 AM PST
const END_TIME = new Date("2025-02-21T08:01:00.000Z") // 12:01 AM PST

export function LaunchToast() {
  const [dismissed, setDismissed] = useLocalStorage({
    key: "ph-launch-dismissed",
    defaultValue: false,
    getInitialValueInEffect: false,
  })

  useEffect(() => {
    const now = new Date()
    const isLaunchTime = now >= START_TIME && now <= END_TIME

    if (!dismissed && isLaunchTime) {
      setTimeout(() => {
        toast.info("We're live on Product Hunt right now! 🚀", {
          duration: Number.POSITIVE_INFINITY,
          className: "max-w-xs",
          onDismiss: () => setDismissed(true),
          action: {
            label: "Check it out",
            onClick: () => {
              setDismissed(true)
              window.open("https://go.openalternative.co/ph", "_blank")
            },
          },
        })
      }, 0)
    }
  }, [dismissed])

  return null
}
