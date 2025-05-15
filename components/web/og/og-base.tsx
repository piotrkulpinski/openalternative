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
        backgroundColor: "#fff",
        color: "#1F1F1F",
        fontFamily: "Geist",
      }}
    >
      <LogoSymbol
        style={{
          height: "36em",
          width: "36em",
          position: "absolute",
          top: "-25%",
          right: "-10%",
          transform: "rotate(12deg)",
          opacity: 0.05,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "3rem",
          padding: "3rem 3.5rem",
          backgroundImage: "linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.2))",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24" }}>
          {faviconUrl && (
            <img
              src={faviconUrl}
              alt=""
              width={92}
              height={92}
              style={{ borderRadius: "0.5rem" }}
            />
          )}

          <p style={{ fontSize: "3.4rem", fontFamily: "GeistBold", lineHeight: "1.05" }}>{name}</p>

          {children}
        </div>

        <p
          style={{
            fontSize: "2.8rem",
            lineHeight: "1.33",
            letterSpacing: "-0.015em",
            marginTop: "-1rem",
            opacity: 0.65,
          }}
        >
          {getExcerpt(description, 125)}
        </p>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "12",
            fontSize: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12",
              fontSize: "2rem",
            }}
          >
            <LogoSymbol style={{ height: "1.25em", width: "1.25em" }} />
            <span>{config.site.name}</span>
          </div>

          <span style={{ opacity: 0.5, fontSize: "1.6rem" }}>Discover {config.site.tagline}</span>
        </div>
      </div>
    </div>
  )
}
