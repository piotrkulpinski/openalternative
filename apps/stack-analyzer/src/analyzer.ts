import { execSync } from "node:child_process"
import path from "node:path"
import type { AnalyserJson } from "@specfy/stack-analyser"
import fs from "fs-extra"
import { getRepoOwnerAndName } from "./utils"

interface StackInfo {
  repo_full_name: string
  primary_languages: string[]
  frameworks: string[]
  technologies: string[]
  analysis_date: Date
}

export class StackAnalyzer {
  private repoDir: string
  private repoUrl: string

  constructor(repository: string) {
    const repo = getRepoOwnerAndName(repository)

    if (!repo) throw new Error("Invalid repository")

    this.repoDir = path.join(process.cwd(), ".repositories", repo.owner, repo.name)
    this.repoUrl = `${repo.owner}/${repo.name}`

    // Ensure working directory exists
    fs.ensureDirSync(this.repoDir)
  }

  public async processRepository() {
    try {
      // Clone repository
      await this.cloneRepository()

      // Analyze stack
      const result = await this.analyzeStack()

      // Clean up
      await this.cleanupDirectory()

      return result
    } catch (error) {
      console.error(`Error processing ${this.repoUrl}:`, error)
    }
  }

  private async cloneRepository() {
    console.time("Clone repository")

    try {
      execSync(`bun x degit ${this.repoUrl} ${this.repoDir} -f`)

      console.timeEnd("Clone repository")
    } catch (error) {
      console.error(`Error cloning ${this.repoUrl}:`, error)
    }
  }

  private async analyzeStack() {
    console.time("Analyze stack")

    try {
      execSync(`bun x @specfy/stack-analyser ${this.repoDir} --flat --output ./output.json`)

      const output = fs.readFileSync(path.join(process.cwd(), "output.json"), "utf-8")

      console.timeEnd("Analyze stack")

      return JSON.parse(output) as AnalyserJson
    } catch (error) {
      console.error(`Error analyzing stack for ${this.repoUrl}:`, error)
    }
  }

  private async cleanupDirectory() {
    console.time("Cleanup directory")

    try {
      await fs.remove(this.repoDir)

      console.timeEnd("Cleanup directory")
    } catch (error) {
      console.error(`Cleanup error for ${this.repoUrl}:`, error)
    }
  }
}
