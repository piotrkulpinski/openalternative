import { getExcerpt } from "@curiousleaf/utils"
import { ToolOne } from "~/services.server/api"
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
          margin: "2rem auto",
          height: "80%",
          width: "90%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16",
              fontSize: "3rem",
              fontWeight: "bold",
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
            {tool.stars && (
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
                  style={{ width: "1.75rem", marginBottom: "-0.25rem" }}
                  role="img"
                  aria-label="Star icon"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <strong style={{ color: "#3F3F46" }}>{tool.stars.toLocaleString()}</strong>
                Stars
              </li>
            )}
            {tool.forks && (
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
                  style={{ width: "1.75rem", marginBottom: "-0.25rem" }}
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

        <p style={{ color: "#52525B", fontSize: "3rem", lineHeight: "1.2", marginTop: "-1rem" }}>
          {getExcerpt(tool.description, 125)}
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
          <svg
            width="48"
            height="50"
            viewBox="0 0 97 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={SITE_NAME}
            style={{ marginBottom: "-0.5rem" }}
          >
            <path
              fill="currentColor"
              d="M32.6602 78L43.6042 22.14H54.3962L65.3402 78H55.7642L53.8642 66.22H44.1362L42.2362 78H32.6602ZM52.5722 58.24L49.7602 40.76C49.6082 40 49.4562 39.2653 49.3042 38.556C49.2028 37.796 49.1015 37.036 49.0002 36.276C48.8988 37.036 48.7722 37.796 48.6202 38.556C48.5188 39.2653 48.3922 40 48.2402 40.76L45.4282 58.24H52.5722Z"
            />
            <path
              fill="currentColor"
              d="M82.1211 51.5781C82.1211 38.6953 78.8008 28.1367 72.1602 19.9023C65.5195 11.6237 57.1523 7.48438 47.0586 7.48438C37.3633 7.48438 29.5716 11.026 23.6836 18.1094C17.8398 25.1927 14.918 34.6667 14.918 46.5312C14.918 59.724 18.2383 70.5482 24.8789 79.0039C31.5638 87.4596 39.9089 91.6875 49.9141 91.6875C59.5651 91.6875 67.3346 88.0573 73.2227 80.7969C79.1549 73.4922 82.1211 63.7526 82.1211 51.5781ZM48.5195 0.046875C55.2487 0.046875 61.2474 1.02083 66.5156 2.96875C71.8281 4.8724 76.6315 7.83854 80.9258 11.8672C86.0612 16.737 89.9792 22.3815 92.6797 28.8008C95.4245 35.2201 96.7969 42.0378 96.7969 49.2539C96.7969 56.6029 95.3581 63.5534 92.4805 70.1055C89.6029 76.6576 85.5078 82.3021 80.1953 87.0391C75.9453 90.8464 70.987 93.8346 65.3203 96.0039C59.6979 98.1289 54.0534 99.1914 48.3867 99.1914C41.3034 99.1914 34.7734 97.8854 28.7969 95.2734C22.8646 92.6615 17.6185 88.7878 13.0586 83.6523C8.89714 78.9596 5.70964 73.6914 3.49609 67.8477C1.32682 62.0039 0.242188 55.8503 0.242188 49.3867C0.242188 42.3919 1.54818 35.7956 4.16016 29.5977C6.81641 23.3555 10.6458 17.888 15.6484 13.1953C20.1641 8.94531 25.2552 5.69141 30.9219 3.43359C36.5885 1.17578 42.4544 0.046875 48.5195 0.046875Z"
            />
          </svg>
          <strong>{SITE_NAME}</strong> – Discover the best Open Source software
        </div>
      </div>
    </div>
  )
}
