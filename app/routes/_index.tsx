import type { MetaFunction } from "@remix-run/node"
import { Featured } from "~/components/Featured"
import { Prose } from "~/components/Prose"

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export default function Index() {
  return (
    <>
      <section className="flex flex-col items-start gap-y-6">
        <Prose className="!max-w-lg text-pretty">
          <p className="lead">
            Discover <strong>Open Source Alternatives</strong> to Popular Software.
            <br />
            We’ve curated some great open source alternatives to tools that your business requires
            in day-to-day operations.
          </p>
        </Prose>

        <Featured />
      </section>
    </>
  )
}
