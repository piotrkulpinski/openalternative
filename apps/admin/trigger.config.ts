import type { TriggerConfig } from "@trigger.dev/sdk/v3"

export const config: TriggerConfig = {
  project: "proj_nowuzjubiaofqglyrdyr",
  retries: {
    enabledInDev: false,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  triggerDirectories: ["./trigger"],
  dependenciesToBundle: [
    /@t3-oss/,
    /@sindresorhus/,
    /@octokit/,
    "escape-string-regexp",
    "universal-user-agent",
  ],
}
