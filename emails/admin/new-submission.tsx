import type { Tool } from "@prisma/client"
import { Text } from "@react-email/components"
import type { Jsonify } from "inngest/helpers/jsonify"
import { config } from "~/config"
import { EmailButton } from "~/emails/_components/button"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/_components/wrapper"

export type EmailAdminNewSubmissionProps = EmailWrapperProps & {
  tool?: Tool | Jsonify<Tool>
}

const EmailAdminNewSubmission = ({ tool, ...props }: EmailAdminNewSubmissionProps) => {
  return (
    <EmailWrapper {...props}>
      <Text>Hi!</Text>

      <Text>
        {tool?.submitterName} has opted to expedite the submission of {tool?.name}. You should
        review and approve it as soon as possible.
      </Text>

      <EmailButton href={`${config.site.adminUrl}/tools/${tool?.id}`}>
        Review {tool?.name}'s submission
      </EmailButton>
    </EmailWrapper>
  )
}

export default EmailAdminNewSubmission
