import type { Tool } from "@prisma/client"
import { Hr, Link, Text } from "@react-email/components"
import type { Jsonify } from "inngest/helpers/jsonify"
import { config } from "~/config"
import { EmailButton } from "~/emails/_components/button"

type EmailFeatureNudgeProps = {
  tool?: Tool | Jsonify<Tool>
  showButton?: boolean
}

export const EmailFeatureNudge = ({ tool, showButton }: EmailFeatureNudgeProps) => {
  const link = `${config.site.url}/submit/${tool?.slug}`

  const benefits = [
    "⏱️ Get published within 12 hours",
    "🔗 Get a do-follow link",
    "⭐ Featured on our homepage",
    "📌 Prominent placement on our category and alternative pages",
    "✏️ Unlimited content updates",
  ]

  if (tool?.isFeatured) {
    return null
  }

  return (
    <>
      {showButton && <Hr />}

      <Text>
        Want to maximize {tool?.name}'s visibility? Consider upgrading to{" "}
        <Link href={link}>our Featured plan</Link>. We offer a wide range of featuring options:
      </Text>

      <ul>
        {benefits.map(benefit => (
          <li key={benefit}>
            <Text className="m-0">{benefit}</Text>
          </li>
        ))}
      </ul>

      {showButton && <EmailButton href={link}>Boost {tool?.name}'s visibility</EmailButton>}
    </>
  )
}
