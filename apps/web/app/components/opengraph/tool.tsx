import { getExcerpt } from "@curiousleaf/utils"
import { Logo } from "~/components/ui/logo"
import type { ToolOne } from "~/services.server/api"
import { SITE_NAME } from "~/utils/constants"

type ToolOpenGraphProps = {
  tool: ToolOne
}

export const ToolOpenGraph = ({ tool }: ToolOpenGraphProps) => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#FAFAFA",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "3rem",
          margin: "2.5rem auto",
          height: "77.5%",
          width: "90%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24",
              fontSize: "3.6rem",
              fontWeight: "600",
            }}
          >
            {tool.faviconUrl && (
              <img
                src={tool.faviconUrl}
                alt=""
                width={64}
                height={64}
                style={{ borderRadius: "2px" }}
              />
            )}

            {tool.name}
          </p>

          <ul style={{ display: "flex", alignItems: "center", gap: "12" }}>
            {!!tool.stars && (
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6",
                  padding: "0.5rem 1rem",
                  border: "0.1em solid #D1D5DB",
                  borderRadius: "0.75rem",
                  color: "#71717A",
                  fontSize: "1.6rem",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ height: "1.75rem", width: "1.75rem" }}
                  role="img"
                  aria-label="Star icon"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <strong style={{ color: "#3F3F46" }}>{tool.stars.toLocaleString()}</strong>
                Stars
              </li>
            )}

            {!!tool.forks && (
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6",
                  padding: "0.5rem 1rem",
                  border: "0.1em solid #D1D5DB",
                  borderRadius: "0.75rem",
                  color: "#71717A",
                  fontSize: "1.6rem",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ height: "1.75rem", width: "1.75rem" }}
                  role="img"
                  aria-label="Star icon"
                >
                  <circle cx="12" cy="18" r="3" />
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="18" cy="6" r="3" />
                  <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" />
                  <path d="M12 12v3" />
                </svg>
                <strong style={{ color: "#3F3F46" }}>{tool.forks.toLocaleString()}</strong>
                Forks
              </li>
            )}
          </ul>
        </div>

        <p
          style={{
            color: "#52525B",
            fontSize: "3rem",
            lineHeight: "1.25",
            letterSpacing: "-0.015em",
            marginTop: "-1rem",
          }}
        >
          {getExcerpt(tool.description, 125)}
        </p>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: "12",
            fontSize: "2rem",
            letterSpacing: "-0.025em",
          }}
        >
          <Logo style={{ height: "2.5rem", width: "2.5rem" }} />
          <strong>{SITE_NAME}</strong> — Discover the best Open Source software
        </div>
      </div>
    </div>
  )
}
