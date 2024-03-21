import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { format } from "timeago.js"
import { Favicon } from "~/components/Favicon"
import { Intro } from "~/components/Intro"
import { Series } from "~/components/Series"
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

  return (
    <>
      <Intro
        prefix={<Favicon url={tool.website} />}
        title={tool.name}
        description={tool.description}
      />

      <div className="relative flex flex-col items-start gap-4 overflow-clip rounded-md border bg-neutral-50 p-5 dark:border-neutral-700/50 dark:bg-neutral-800/40">
        <div className="flex flex-1 flex-col gap-6">
          <Series size="lg">
            <Favicon url={tool.website} />

            <h1 className="text-3xl font-semibold">{tool.name}</h1>
          </Series>

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

          <div className="prose prose-zinc prose-lg !leading-relaxed text-gray-600 md:max-w-sm">
            <p>{tool.description}</p>
          </div>

          <ul className="mt-auto space-y-1 text-sm text-gray-500">
            {tool.commitDate && (
              <li>
                Last commited:{" "}
                <strong className="font-medium text-gray-600" title={tool.commitDate}>
                  {format(tool.lastCommitDate ?? "")}
                </strong>
              </li>
            )}
            {tool.license && (
              <li>
                License: <strong className="font-medium text-gray-600">{tool.license}</strong>
              </li>
            )}
          </ul>

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
        </div>

        {/* {
          imageUrl && (
            <div className="relative z-10 self-start max-md:order-last max-md:-m-4 max-md:mt-0 md:w-2/5 md:p-1.5 md:border md:rounded-md md:bg-white md:shadow lg:w-1/2">
              <Image
                src={imageUrl}
                alt=""
                width={1280}
                height={1024}
                loading="eager"
                className="rounded w-full h-auto"
              />
            </div>
          )
        } */}

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
    </>
  )
}
