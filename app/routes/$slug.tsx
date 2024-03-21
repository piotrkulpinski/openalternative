import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { CopyrightIcon, GitForkIcon, StarIcon, TimerIcon } from "lucide-react"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { format } from "timeago.js"
import { FaviconImage } from "~/components/Favicon"
import { Insights } from "~/components/Insights"
import { Intro } from "~/components/Intro"
import { toolOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  try {
    const tool = await prisma.tool.findUniqueOrThrow({
      where: { slug },
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
    { label: "Last commit", value: format(tool.lastCommitDate ?? ""), icon: TimerIcon },
    { label: "License", value: tool.license, icon: CopyrightIcon },
  ]

  return (
    <div className="flex flex-wrap gap-12">
      <div className="flex-1">
        <Intro
          prefix={<FaviconImage url={tool.website} />}
          title={tool.name}
          description={tool.description}
        />

        {/* <Series size="sm" className="md:-mt-2" asChild>
          <ul>
            {
              tool.stars !== null && (
                <li>
                  <span className={badgeVariants({ theme: "gray", className: "!text-gray-500" })}>
                  <Star className="size-3.5 opacity-75 max-sm:hidden" />
                  <strong className="text-gray-700">{tool.stars.toLocaleString()}</strong>
                    Stars
                  </span>
                </li>
              )
            }
            {
              tool.forks !== null && (
                <li>
                  <span className={badgeVariants({ theme: "gray", className: "!text-gray-500" })}>
                  <GitFork className="size-3.5 opacity-75 max-sm:hidden" />
                  <strong className="text-gray-700">{tool.forks.toLocaleString()}</strong>
                    Forks
                  </span>
                </li>
              )
            }
            {
              tool.issues !== null && (
                <li>
                  <span className={badgeVariants({ theme: "gray", className: "!text-gray-500" })}>
                  <Bug className="size-3.5 opacity-75 max-sm:hidden" />
                  <strong className="text-gray-700">{tool.issues.toLocaleString()}</strong>
                    Issues
                  </span>
                </li>
              )
            }
          </ul>
          </Series> */}

        <Insights insights={insights} className="text-sm" />

        {/* <div class:list={["", listVariants({ size: "lg" })]}>
            {
              tool.website && (
                <a
                  href={`${tool.website}?ref=openalternative`}
                  className={buttonVariants({ theme: "primary" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="tool-website"
                >
                  <ExternalLink className="size-4 opacity-60 max-sm:hidden" />
                  Visit Website
                </a>
              )
            }
            {
              tool.repository && (
                <a
                  href={tool.repository}
                  className={buttonVariants({ theme: "secondary" })}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  id="tool-repository"
                >
                  <Github className="size-4 opacity-60 max-sm:hidden" />
                  View Repository
                </a>
              )
            }
          </div> */}

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
        </div>

        <Pattern width={76} height={56} x="50%" y="-6" squares={[[0, 1]]} className="bottom-auto h-96" /> */}
      </div>

      {tool.website && (
        <div className="relative z-10 self-start max-md:order-last max-md:-m-4 max-md:mt-0 md:w-2/5 md:rounded-md md:border md:p-1.5">
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
  )
}
