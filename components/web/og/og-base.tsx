import { getExcerpt } from "@curiousleaf/utils"
import type { PropsWithChildren } from "react"
import { LogoSymbol } from "~/components/web/ui/logo-symbol"
import { config } from "~/config"

type OgBaseProps = PropsWithChildren<{
  name: string
  description: string | null
  faviconUrl: string | null
}>

export const OgBase = ({ faviconUrl, name, description, children }: OgBaseProps) => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#FAFAFA",
        fontFamily: "Geist",
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
              gap: "24",
              fontSize: "3.2rem",
              fontFamily: "GeistBold",
            }}
          >
            {faviconUrl && (
              <img
                src={faviconUrl}
                alt=""
                width={64}
                height={64}
                style={{ borderRadius: "0.5rem" }}
              />
            )}

            {name}
          </p>

          {children}
        </div>

        <p
          style={{
            color: "#52525B",
            fontSize: "2.8rem",
            lineHeight: "1.25",
            letterSpacing: "-0.015em",
            marginTop: "-1rem",
          }}
        >
          {getExcerpt(description, 125)}
        </p>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: "12",
            fontSize: "2rem",
          }}
        >
          <LogoSymbol style={{ height: "2.5rem", width: "2.5rem" }} />
          <span>
            {config.site.name} — {config.site.tagline}
          </span>
        </div>
      </div>
    </div>
  )
}
