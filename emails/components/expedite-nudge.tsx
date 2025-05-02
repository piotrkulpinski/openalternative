import type { Tool } from "@prisma/client"
import { Text } from "@react-email/components"
import type { PropsWithChildren } from "react"
import { config } from "~/config"
import { EmailButton } from "~/emails/components/button"
import { isToolWithinExpediteThreshold } from "~/lib/tools"

type EmailExpediteNudgeProps = PropsWithChildren<{
  tool: Tool
}>

export const EmailExpediteNudge = ({ children, tool }: EmailExpediteNudgeProps) => {
  const link = `${config.site.url}/submit/${tool.slug}`

  if (isToolWithinExpediteThreshold(tool)) {
    return null
  }

  return (
    <>
      <Text>
        Due to the high volume of submissions we're currently receiving, there's a bit of a queue.{" "}
        {tool.name} is scheduled to be added {children}. However, if you'd like to fast-track your
        submission, you have the option to skip the queue.
      </Text>

      <EmailButton href={link}>Publish {tool.name} within 24 hours</EmailButton>
    </>
  )
}
