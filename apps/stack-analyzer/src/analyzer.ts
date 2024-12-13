import path from "node:path"
import { FSProvider, analyser, flatten, rules } from "@specfy/stack-analyser"
import fs from "fs-extra"
import tiged from "tiged"
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
      const emitter = tiged(this.repoUrl, { cache: false, force: true, verbose: true })

      await emitter.clone(this.repoDir)

      console.timeEnd("Clone repository")
    } catch (error) {
      console.error(`Error cloning ${this.repoUrl}:`, error)
    }
  }

  private async analyzeStack() {
    console.time("Analyze stack")

    try {
      // Load default rules
      rules.loadAll()

      // Create a provider for the repository
      const provider = new FSProvider({ path: this.repoDir })

      // Analyze a folder
      const result = await analyser({ provider })

      // Output to JSON
      // const json = result.toJson()

      // De-nest the output and deduplicate childs
      const flat = flatten(result)

      console.timeEnd("Analyze stack")

      return flat.toJson()
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
