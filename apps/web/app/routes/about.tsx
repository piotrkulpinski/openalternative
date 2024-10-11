import { type MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Featured } from "~/components/featured"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"
import { Intro } from "~/components/ui/intro"
import { Markdown } from "~/components/ui/markdown"
import {
  AUTHOR_URL,
  FAMILY_LINKS,
  GITHUB_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "~/utils/constants"
import { addUTMTracking } from "~/utils/helpers"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: () => <BreadcrumbsLink to="/about" label="About Us" />,
}

export const meta: MetaFunction<typeof loader> = ({ matches, data, location }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    location,
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = () => {
  const meta = {
    title: "About Us",
    description: `${SITE_NAME} is a community driven list of open source alternatives to proprietary software and applications.`,
  }

  return json({ meta })
}

export default function AboutPage() {
  const { meta } = useLoaderData<typeof loader>()

  const content = `
## What is ${SITE_NAME}?

[${SITE_NAME}](${SITE_URL} "${SITE_TAGLINE}") is a community driven list of **open source alternatives to proprietary software** and applications. The goal of the site is to be your first stop when researching for a new open source service to help you grow your business. It will help you find alternatives and reviews of the products you already use.

## How did ${SITE_NAME} get started?

The project started as a weekend project to learn a new technology and try something new and fun from scratch. It gained a lot of traction early on ([100k unique visitors](https://kulp.in/launch) in one week, [#1 on Hacker News](https://news.ycombinator.com/item?id=39639386)) so it was clear that there was a need for a site like this.

I’ve always been a fan of open source software and I’ve always wanted to contribute to the community in some way. I thought that creating a list of open source alternatives to proprietary software and applications would be a great way to give back to the community.

## How are rankings calculated?

${SITE_NAME} uses a sophisticated algorithm to calculate the health score of each open source project, which determines its ranking. The score is based on several factors:

1. **GitHub Metrics**: We consider stars, forks, watchers, and contributors, with each metric weighted differently.
2. **Project Age**: Newer projects get a slight boost to balance out the advantage of older, more established projects.
3. **Recent Activity**: Projects with recent commits are ranked higher to ensure we're showcasing actively maintained alternatives.
4. **Manual Adjustments**: In some cases, we may apply a small manual adjustment to account for factors our algorithm can't capture.

Here's a breakdown of how the score is calculated:

- Stars, forks, and watchers each contribute 25% of their value to the score, adjusted for the project's age.
- The number of contributors has a higher impact, contributing 50% of its value to the score.
- We apply a penalty for projects that haven't been updated recently, with the penalty increasing for up to 90 days of inactivity.
- The project's age is factored in to give newer projects a fair chance. Very new projects get a full score, while older projects (5+ years) get about half the score for each metric.

This approach helps us balance between popular, well-established projects and promising newcomers in the open source community.

## Tools Used

* [Remix](https://remix.run) – Web framework
* [GitHub](https://github.com) – Repository data
* [Airtable](https://kulp.in/airtable) – Database
* [Beehiiv](https://kulp.in/beehiiv) – Newsletter
* [Screen Studio](https://kulp.in/screenstudio) – Screen recording for marketing videos
* [ScreenshotOne](https://kulp.in/screenshotone) – The screenshot API for developers
* [Typefully](https://kulp.in/typefully) – Twitter scheduling/analytics

## Contribute

If you have any suggestions for open source alternatives to proprietary software and applications, feel free to contribute to the list. You can also contribute by suggesting new categories or improving the website. The source code is available on [GitHub](${GITHUB_URL}).

Enjoy and feel free to contribute!

## About the Author

I’m a software developer and entrepreneur. I’ve been building web applications for over 15 years. I’m passionate about open source software and I love to contribute to the community in any way I can.

Some of my other projects:

${FAMILY_LINKS.map(link => `* [${link.title}](${addUTMTracking(link.href, { source: SITE_NAME.toLowerCase() })} "${link.description}") – ${link.description}`).join("\n")}

I’m always looking for new projects to work on and new people to collaborate with. Feel free to reach out to me if you have any questions or suggestions.

– [Piotr Kulpinski](${AUTHOR_URL})
  `

  return (
    <>
      <Intro {...meta} />
      <Featured />
      <Markdown>{content}</Markdown>
    </>
  )
}
