import type { Tool } from "@openalternative/db/client"
import { Text } from "@react-email/components"
import type { Jsonify } from "inngest/helpers/jsonify"
import { config } from "~/config"
import { EmailButton } from "~/emails/components/button"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"

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

      <EmailButton href={`${config.site.url}/admin/tools/${tool?.slug}`}>
        Review {tool?.name}'s submission
      </EmailButton>
    </EmailWrapper>
  )
}

export default EmailAdminNewSubmission
