import { SITE_NAME } from "~/utils/constants"
import { Intro } from "~/components/Intro"
import { Prose } from "~/components/Prose"
import { MetaFunction } from "@remix-run/node"

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export default function Index() {
  return (
    <>
      <Intro
        title="Submit your Open Source Software"
        description={`Help us grow the list of open source alternatives to proprietary software. Contribute to ${SITE_NAME} by submitting a new open source alternative.`}
      />

      <Prose className="max-w-lg text-sm/normal">
        <h3>Submission Checklist:</h3>

        <p>
          Please make sure the software you’re submitting meets the following criteria before
          submitting:
        </p>

        <ul>
          <li>It’s open source</li>
          <li>It’s free to use or can be self-hosted</li>
          <li>It’s actively maintained</li>
          <li>It’s a good alternative to a proprietary software</li>
        </ul>
      </Prose>
    </>
  )
}
