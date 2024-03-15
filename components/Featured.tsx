import { Series, SeriesProps, Subheading } from "@curiousleaf/design"
import Link from "next/link"
import Image from "next/image"

export const Featured = ({ ...props }: SeriesProps) => {
  const links = [
    {
      href: "https://www.producthunt.com/posts/openalternative",
      target: "_blank",
      image: "/producthunt.svg",
      label: "Product Hunt",
    },
    {
      href: "https://news.ycombinator.com/item?id=39639386",
      target: "_blank",
      image: "/hackernews.svg",
      label: "Hacker News",
    },
    {
      href: "https://twitter.com/steventey/status/1765841867017437599",
      target: "_blank",
      image: "/twitter.svg",
      label: "Twitter",
    },
  ]

  return (
    <Series direction="column" {...props}>
      <Subheading className="text-[10px] text-gray-500">Featured on</Subheading>

      <Series className="md:gap-x-6">
        {links.map((link, index) => (
          <Series key={index} size="sm" asChild>
            <Link
              href={link.href}
              target={link.target}
              className="text-sm font-medium opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
            >
              <Image
                src={link.image}
                width="24"
                height="24"
                alt={link.label}
                className="rounded-full"
              />
              {link.label}
            </Link>
          </Series>
        ))}
      </Series>
    </Series>
  )
}
