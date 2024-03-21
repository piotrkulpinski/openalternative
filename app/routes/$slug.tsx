import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"
import {
  CopyrightIcon,
  ExternalLinkIcon,
  GitForkIcon,
  GithubIcon,
  StarIcon,
  TimerIcon,
} from "lucide-react"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { format } from "timeago.js"
import { Button } from "~/components/Button"
import { FaviconImage } from "~/components/Favicon"
import { Insights } from "~/components/Insights"
import { Intro } from "~/components/Intro"
import { Series } from "~/components/Series"
import { addSearchParamsToUrl } from "~/utils/helpers"
import { toolOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { BackButton } from "~/components/BackButton"

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  try {
    const tool = await prisma.tool.findUniqueOrThrow({
      where: { slug, isDraft: false },
      include: toolOnePayload,
    })

    return typedjson({ tool })
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function ToolPage() {
  const { tool } = useTypedLoaderData<typeof loader>()

  const insights = [
    { label: "Stars", value: tool.stars.toLocaleString(), icon: StarIcon },
    { label: "Forks", value: tool.forks.toLocaleString(), icon: GitForkIcon },
    {
      label: "Last commit",
      value: tool.lastCommitDate && format(tool.lastCommitDate),
      icon: TimerIcon,
    },
    { label: "License", value: tool.license, icon: CopyrightIcon },
  ]

  return (
    <>
      <div className="flex flex-wrap gap-12">
        <div className="flex flex-1 flex-col items-start gap-4 md:gap-6">
          <Intro
            prefix={<FaviconImage url={tool.website} />}
            title={tool.name}
            description={tool.description}
            className="space-y-4"
          />

          <Insights insights={insights} className="text-sm" />

          <Series size="lg" className="mt-auto">
            {tool.website && (
              <Button
                prefix={<ExternalLinkIcon className="size-4 opacity-60 max-sm:hidden" />}
                asChild
              >
                <Link
                  to={addSearchParamsToUrl(tool.website, { ref: "openalternative" })}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit Website
                </Link>
              </Button>
            )}

            {tool.repository && (
              <Button
                variant="outline"
                prefix={<GithubIcon className="size-4 opacity-60 max-sm:hidden" />}
                asChild
              >
                <Link to={tool.repository} target="_blank" rel="noreferrer nofollow">
                  View Repository
                </Link>
              </Button>
            )}
          </Series>

          {/* <div className="flex flex-col gap-8 w-full">
          {
            tags.map(
              (tag) =>
                !!tag.items?.length && (
                  <div className={listVariants({ direction: "column" })}>
                    <h3 className="font-semibold">{tag.name}:</h3>

                    <ul class:list={listVariants({ size: "sm" })}>
                      {tag.items?.map((item) => (
                        <li>
                          <a href={`/${tag.path}/${item?.slug}`} class:list={[linkVariants()]}>
                            {item?.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )
        }
        </div> */}
        </div>

        {tool.website && (
          <div className="relative z-10 self-start max-md:order-last max-md:-m-4 max-md:mt-0 md:w-2/5 md:rounded-md md:border md:p-1.5 lg:w-1/2">
            <img
              src={
                "https://openalternative.co/_next/image?url=https%3A%2F%2Fapi.screenshotone.com%2Ftake%3Furl%3Dhttps%253A%252F%252Fposthog.com%26cache%3Dtrue%26cache_ttl%3D2000000%26block_chats%3Dtrue%26block_trackers%3Dtrue%26block_cookie_banners%3Dtrue%26block_ads%3Dtrue%26access_key%3DoWVNWT8VvhigEQ%26signature%3D7f0e0f90b5375f79368cb0a0492ea1f04255d0757e42706ad9196f29b4829464&w=3840&q=75"
              }
              alt=""
              width={1280}
              height={1024}
              loading="eager"
              className="h-auto w-full rounded"
            />
          </div>
        )}
      </div>

      <BackButton to="/" />
    </>
  )
}
