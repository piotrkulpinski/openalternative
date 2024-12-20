import { execFileSync } from "node:child_process"
import path from "node:path"
import { createGithubClient, getRepoOwnerAndName } from "@openalternative/github"
import type { AnalyserJson } from "@specfy/stack-analyser"
import fs from "fs-extra"
import { env } from "../env"

const { GITHUB_TOKEN } = env()

const getRepoInfo = (repository: string) => {
  const repo = getRepoOwnerAndName(repository)
  if (!repo) throw new Error("Invalid repository")

  const repoDir = path.join(process.cwd(), ".repositories", repo.owner, repo.name)
  const repoName = `${repo.owner}/${repo.name}`
  const outputFile = path.join(`output-${repo.owner}-${repo.name}.json`)

  return { repoDir, repoName, outputFile }
}

const cloneRepository = async (repo: string, repoDir: string) => {
  try {
    fs.ensureDirSync(repoDir)
    // execFileSync("bun", ["x", "tiged", `${repo}`, repoDir, "-f"])
    execFileSync("bun", ["x", "degit", `${repo}`, repoDir, "-f"])
  } catch (error) {
    console.error(`Error cloning ${repo}:`, error)
    throw new Error(`Error cloning ${repo}`)
  }
}

const analyzeStack = async (repo: string, repoDir: string, outputFile: string) => {
  try {
    execFileSync("bun", ["x", "@specfy/stack-analyser", repoDir, "--flat", "-o", outputFile])
    const output = fs.readFileSync(outputFile, "utf-8")
    return JSON.parse(output) as AnalyserJson
  } catch (error) {
    console.error(`Error analyzing stack for ${repo}:`, error)
    throw error
  }
}

const cleanupDirectories = async (repo: string, repoDir: string, outputFile: string) => {
  try {
    await fs.remove(repoDir)
    await fs.remove(outputFile)
  } catch (error) {
    console.error(`Cleanup error for ${repo}:`, error)
    throw error
  }
}

export const analyzeRepositoryStack = async (repo: string) => {
  const { repoDir, repoName, outputFile } = getRepoInfo(repo)
  const githubClient = createGithubClient(GITHUB_TOKEN)

  try {
    await cloneRepository(repoName, repoDir)
    const result = await analyzeStack(repoName, repoDir, outputFile)
    const repository = await githubClient.queryRepository(repo)

    return { stack: [...new Set(result.childs.flatMap(tech => tech.techs))], repository }
  } finally {
    await cleanupDirectories(repoName, repoDir, outputFile).catch(() => {})
  }
}
