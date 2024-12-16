import { execSync } from "node:child_process"
import path from "node:path"
import type { AnalyserJson } from "@specfy/stack-analyser"
import fs from "fs-extra"
import { getRepoOwnerAndName } from "./utils"

const getRepoInfo = (repository: string) => {
  const repo = getRepoOwnerAndName(repository)
  if (!repo) throw new Error("Invalid repository")

  const repoDir = path.join(process.cwd(), ".repositories", repo.owner, repo.name)
  const repoUrl = `${repo.owner}/${repo.name}`

  return { repoDir, repoUrl }
}

const cloneRepository = async (repoUrl: string, repoDir: string) => {
  console.time("Clone repository")
  try {
    fs.ensureDirSync(repoDir)
    execSync(`bun x degit ${repoUrl} ${repoDir} -f`)
    console.timeEnd("Clone repository")
  } catch (error) {
    console.error(`Error cloning ${repoUrl}:`, error)
    throw error
  }
}

const analyzeStack = async (repoUrl: string, repoDir: string) => {
  console.time("Analyze stack")
  try {
    execSync(`bun x @specfy/stack-analyser ${repoDir} --flat --output ./output.json`)
    const output = fs.readFileSync(path.join(process.cwd(), "output.json"), "utf-8")
    console.timeEnd("Analyze stack")
    return JSON.parse(output) as AnalyserJson
  } catch (error) {
    console.error(`Error analyzing stack for ${repoUrl}:`, error)
    throw error
  }
}

const cleanupDirectory = async (repoUrl: string, repoDir: string) => {
  console.time("Cleanup directory")
  try {
    await fs.remove(repoDir)
    console.timeEnd("Cleanup directory")
  } catch (error) {
    console.error(`Cleanup error for ${repoUrl}:`, error)
    throw error
  }
}

export const processRepository = async (repository: string) => {
  const { repoDir, repoUrl } = getRepoInfo(repository)

  try {
    await cloneRepository(repoUrl, repoDir)
    return await analyzeStack(repoUrl, repoDir)
  } catch (error) {
    console.error(`Error processing ${repoUrl}:`, error)
    throw error
  } finally {
    await cleanupDirectory(repoUrl, repoDir).catch(() => {})
  }
}
