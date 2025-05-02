import type { Tool } from "@prisma/client"
import { Text } from "@react-email/components"
import { config } from "~/config"
import { EmailButton } from "~/emails/components/button"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"

export type EmailProps = EmailWrapperProps & {
  tool: Tool
}

const EmailAdminSubmissionPremium = ({ tool, ...props }: EmailProps) => {
  return (
    <EmailWrapper {...props}>
      <Text>Hi!</Text>

      <Text>
        {tool.submitterName} has opted to {tool.isFeatured ? "feature" : "expedite"} the submission
        of {tool.name}. You should review and approve it as soon as possible.
      </Text>

      <EmailButton href={`${config.site.url}/admin/tools/${tool.slug}`}>
        Review {tool.name}
      </EmailButton>
    </EmailWrapper>
  )
}

export default EmailAdminSubmissionPremium
