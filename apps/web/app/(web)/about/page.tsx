import type { Metadata } from "next"
import { Link } from "~/components/common/link"
import { Prose } from "~/components/common/prose"
import { ExternalLink } from "~/components/web/external-link"
import { Featured } from "~/components/web/featured"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "About Us",
  description: `${config.site.name} is a community driven list of open source alternatives to proprietary software and applications.`,
  openGraph: { ...metadataConfig.openGraph, url: "/about" },
  alternates: { ...metadataConfig.alternates, canonical: "/about" },
}

export default function AboutPage() {
  return (
    <>
      <Intro>
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Featured />

      <Prose>
        <h3 id="what-is-it">What is {config.site.name}?</h3>

        <p>
          <Link href="/" title={config.site.tagline}>
            {config.site.name}
          </Link>{" "}
          is a community driven list of{" "}
          <strong>open source alternatives to proprietary software</strong> and applications. The
          goal of the site is to be your first stop when searching for open source services. It will
          help you find alternatives to the products you already use.
        </p>

        <h3 id="how-did-it-get-started">How did {config.site.name} get started?</h3>

        <p>
          The project started as a weekend project to learn a new technology and try something new
          and fun from scratch. It gained a lot of traction early on (
          <a href="https://kulp.in/launch" target="_blank" rel="noreferrer">
            100k unique visitors
          </a>{" "}
          in one week,{" "}
          <a
            href="https://news.ycombinator.com/item?id=39639386"
            target="_blank"
            rel="nofollow noreferrer"
          >
            #1 on Hacker News
          </a>
          ) so it was clear that there was a need for a site like this.
        </p>

        <p>
          I've always been a fan of open source software and I've always wanted to contribute to the
          community in some way. I thought that creating a list of open source alternatives to
          proprietary software and applications would be a great way to give back to the community.
        </p>

        <h3 id="how-are-rankings-calculated">How are rankings calculated?</h3>

        <p>
          {config.site.name} uses a sophisticated algorithm to calculate the health score of each
          open source project, which determines its ranking. The score is based on several factors:
        </p>

        <ol>
          <li>
            <strong>GitHub Metrics</strong>: We consider stars, forks, watchers, and contributors,
            with each metric weighted differently.
          </li>
          <li>
            <strong>Project Age</strong>: Newer projects get a slight boost to balance out the
            advantage of older, more established projects.
          </li>
          <li>
            <strong>Recent Activity</strong>: Projects with recent commits are ranked higher to
            ensure we're showcasing actively maintained alternatives.
          </li>
          <li>
            <strong>Manual Adjustments</strong>: In some cases, we may apply a small manual
            adjustment to account for factors our algorithm can't capture.
          </li>
        </ol>

        <p>Here's a breakdown of how the score is calculated:</p>

        <ul>
          <li>
            Stars, forks, and watchers each contribute 25% of their value to the score, adjusted for
            the project's age.
          </li>
          <li>
            The number of contributors has a higher impact, contributing 50% of its value to the
            score.
          </li>
          <li>
            We apply a penalty for projects that haven't been updated recently, with the penalty
            increasing for up to 90 days of inactivity.
          </li>
          <li>
            The project's age is factored in to give newer projects a fair chance. Very new projects
            get a full score, while older projects (5+ years) get about half the score for each
            metric.
          </li>
        </ul>

        <p>
          This approach helps us balance between popular, well-established projects and promising
          newcomers in the open source community.
        </p>

        <h3 id="tools-used">Tools Used</h3>

        <ul>
          {config.links.toolsUsed.map(link => (
            <li key={link.title}>
              <ExternalLink href={link.href} title={link.description}>
                {link.title}
              </ExternalLink>{" "}
              – {link.description}
            </li>
          ))}
        </ul>

        <h3 id="contribute">Contribute</h3>

        <p>
          If you have any suggestions for open source alternatives to proprietary software and
          applications, feel free to contribute to the list. You can also contribute by suggesting
          new categories or improving the website. The source code is available on{" "}
          <a href={config.links.github} target="_blank" rel="nofollow noreferrer">
            GitHub
          </a>
          .
        </p>

        <p>Enjoy and feel free to contribute!</p>

        <h3 id="affiliate-links">Affiliate links</h3>

        <p>
          The site participates in affiliate programs with select service providers, where some
          links are automatically tracked as affiliate links. I try to make sure that these services
          are not given preferential treatment.
        </p>

        <h3 id="about-the-author">About the Author</h3>

        <p>
          I'm a software developer and entrepreneur. I've been building web applications for over 15
          years. I'm passionate about software development and I love to contribute to the community
          in any way I can.
        </p>

        <p>Some of my other projects:</p>

        <ul>
          {config.links.family.map(({ href, title, description }) => (
            <li key={title}>
              <ExternalLink href={href} title={description} doFollow>
                {title}
              </ExternalLink>{" "}
              – {description}
            </li>
          ))}
        </ul>

        <p>
          I'm always looking for new projects to work on and new people to collaborate with. Feel
          free to reach out to me if you have any questions or suggestions.
        </p>

        <p>
          –{" "}
          <ExternalLink href={config.links.author} doFollow>
            Piotr Kulpinski
          </ExternalLink>
        </p>
      </Prose>
    </>
  )
}
