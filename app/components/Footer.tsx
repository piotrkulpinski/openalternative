import { HTMLAttributes } from "react"

export const Footer = ({ children, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <footer {...props}>
      <p className="text-sm text-neutral-500">
        © {new Date().getFullYear()} &middot;
        <a
          href="https://github.com/piotrkulpinski/openalternative"
          target="_blank"
          rel="nofollow noreferrer"
          className="hover:text-black hover:underline dark:hover:text-white"
        >
          Source
        </a>
      </p>

      {children}
    </footer>
  )
}
