import { execFileSync } from "node:child_process"
import path from "node:path"
import type { AnalyserJson } from "@specfy/stack-analyser"
import fs from "fs-extra"
import { getRepoOwnerAndName } from "./utils"

const getRepoInfo = (repository: string) => {
  const repo = getRepoOwnerAndName(repository)
  if (!repo) throw new Error("Invalid repository")

  const repoDir = path.join(process.cwd(), ".repositories", repo.owner, repo.name)
  const repoUrl = `${repo.owner}/${repo.name}`
  const outputFile = path.join(`output-${repo.owner}-${repo.name}.json`)

  return { repoDir, repoUrl, outputFile }
}

const cloneRepository = async (repoUrl: string, repoDir: string) => {
  console.time("Clone repository")
  try {
    fs.ensureDirSync(repoDir)
    execFileSync("bun", ["x", "degit", repoUrl, repoDir, "-f"])
    console.timeEnd("Clone repository")
  } catch (error) {
    console.error(`Error cloning ${repoUrl}:`, error)
    throw new Error(`Error cloning ${repoUrl}`)
  }
}

const analyzeStack = async (repoUrl: string, repoDir: string, outputFile: string) => {
  console.time("Analyze stack")
  try {
    execFileSync("bun", ["x", "@specfy/stack-analyser", repoDir, "--flat", "-o", outputFile])
    const output = fs.readFileSync(outputFile, "utf-8")
    console.timeEnd("Analyze stack")
    return JSON.parse(output) as AnalyserJson
  } catch (error) {
    console.error(`Error analyzing stack for ${repoUrl}:`, error)
    throw error
  }
}

const cleanupDirectories = async (repoUrl: string, repoDir: string, outputFile: string) => {
  console.time("Cleanup directory")
  try {
    await fs.remove(repoDir)
    await fs.remove(outputFile)
    console.timeEnd("Cleanup directory")
  } catch (error) {
    console.error(`Cleanup error for ${repoUrl}:`, error)
    throw error
  }
}

export const processRepository = async (repository: string) => {
  const { repoDir, repoUrl, outputFile } = getRepoInfo(repository)

  try {
    await cloneRepository(repoUrl, repoDir)
    return await analyzeStack(repoUrl, repoDir, outputFile)
  } finally {
    await cleanupDirectories(repoUrl, repoDir, outputFile).catch(() => {})
  }
}
