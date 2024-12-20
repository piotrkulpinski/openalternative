import { execFileSync } from "node:child_process"
import path from "node:path"
import { createGithubClient, getRepositoryString } from "@openalternative/github"
import type { AnalyserJson } from "@specfy/stack-analyser"
import fs from "fs-extra"
import { env } from "./env"

const { GITHUB_TOKEN } = env()

const getRepoInfo = (url: string) => {
  const repo = getRepositoryString(url)

  const repoDir = path.join(process.cwd(), ".repositories", repo)
  const outputFile = path.join(`output-${repo.replace("/", "-")}.json`)

  return { repo, repoDir, outputFile }
}

const cloneRepository = async (repo: string, repoDir: string) => {
  console.time("Cloning repository")

  try {
    fs.ensureDirSync(repoDir)
    // execFileSync("bun", ["x", "tiged", `${repo}`, repoDir, "-f"])
    execFileSync("bun", ["x", "degit", `${repo}`, repoDir, "-f"])
  } catch (error) {
    console.error(`Error cloning ${repo}:`, error)
    throw new Error(`Error cloning ${repo}`)
  } finally {
    console.timeEnd("Cloning repository")
  }
}

const analyzeStack = async (repo: string, repoDir: string, outputFile: string) => {
  console.time("Analyzing stack")

  try {
    execFileSync("bun", ["x", "@specfy/stack-analyser", repoDir, "--flat", "-o", outputFile])
    const output = fs.readFileSync(outputFile, "utf-8")
    return JSON.parse(output) as AnalyserJson
  } catch (error) {
    console.error(`Error analyzing stack for ${repo}:`, error)
    throw error
  } finally {
    console.timeEnd("Analyzing stack")
  }
}

const cleanupDirectories = async (repo: string, repoDir: string, outputFile: string) => {
  console.time("Cleaning up directories")

  try {
    await fs.remove(repoDir)
    await fs.remove(outputFile)
  } catch (error) {
    console.error(`Cleanup error for ${repo}:`, error)
    throw error
  } finally {
    console.timeEnd("Cleaning up directories")
  }
}

export const analyzeRepositoryStack = async (url: string) => {
  const { repo, repoDir, outputFile } = getRepoInfo(url)
  const githubClient = createGithubClient(GITHUB_TOKEN)

  try {
    await cloneRepository(repo, repoDir)

    const [{ childs }, repository] = await Promise.all([
      // Get analysis
      analyzeStack(repo, repoDir, outputFile),

      // Get repository
      githubClient.queryRepository(repo),
    ])

    return { stack: [...new Set(childs.flatMap(({ techs }) => techs))], repository }
  } finally {
    await cleanupDirectories(repo, repoDir, outputFile).catch(() => {})
  }
}
