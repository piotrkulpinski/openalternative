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
  private workingDir: string

  constructor() {
    this.workingDir = path.join(process.cwd(), ".repositories")

    // Ensure working directory exists
    fs.ensureDirSync(this.workingDir)
  }

  public async processRepository(repository: string) {
    const repo = getRepoOwnerAndName(repository)

    if (!repo) return null

    const repoPath = path.join(this.workingDir, repo.owner, repo.name)

    try {
      // Clone repository
      await this.cloneRepository(`${repo.owner}/${repo.name}`, repoPath)

      // Analyze stack
      const result = await this.analyzeStack(repoPath)

      // Clean up
      await this.cleanupDirectory(this.workingDir)

      return result
    } catch (error) {
      console.error(`Error processing ${repository}:`, error)
    }
  }

  private async cloneRepository(repository: string, path: string) {
    console.time("Clone repository")

    try {
      const emitter = tiged(repository, { cache: false, force: true, verbose: true })

      await emitter.clone(path)

      console.timeEnd("Clone repository")
    } catch (error) {
      console.error(`Error cloning ${repository}:`, error)
    }
  }

  private async analyzeStack(path: string) {
    console.time("Analyze stack")

    try {
      // Load default rules
      rules.loadAll()

      // Create a provider for the repository
      const provider = new FSProvider({ path })

      // Analyze a folder
      const result = await analyser({ provider })

      // Output to JSON
      // const json = result.toJson()

      // De-nest the output and deduplicate childs
      const flat = flatten(result)

      console.timeEnd("Analyze stack")

      return flat.toJson()
    } catch (error) {
      console.error(`Error analyzing stack for ${path}:`, error)
    }
  }

  private async cleanupDirectory(path: string) {
    console.time("Cleanup directory")

    try {
      await fs.remove(path)

      console.timeEnd("Cleanup directory")
    } catch (error) {
      console.error(`Cleanup error for ${path}:`, error)
    }
  }
}
