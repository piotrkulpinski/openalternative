import type { graphql } from "@octokit/graphql/types"
import { githubClient } from "~/services/github"

interface TechStackSignature {
  required_files: string[]
  optional_files: string[]
  dependencies: string[]
  files_content: string[]
  topics?: string[]
}

interface FileNode {
  path: string
  type: string
  object?: {
    text?: string
  }
}

interface RepositoryContent {
  repository: {
    object: {
      tree: {
        entries: FileNode[]
      }
    }
    languages: {
      edges: {
        node: {
          name: string
        }
        size: number
      }[]
    }
    dependencyGraphManifests: {
      nodes: {
        dependencies: {
          nodes: {
            packageName: string
          }[]
        }
      }[]
    }
    repositoryTopics: {
      nodes: {
        topic: {
          name: string
        }
      }[]
    }
  }
}

interface AnalysisResult {
  repository: string
  detected_stacks: string[]
  primary_languages: string[]
  confidence_scores: Record<string, number>
  matched_topics: Record<string, string[]>
}

export class GitHubTechStackAnalyzer {
  private client: graphql
  private tech_stacks: Record<string, TechStackSignature>

  constructor() {
    this.client = githubClient

    this.tech_stacks = {
      React: {
        required_files: ["package.json"],
        optional_files: [
          "src/App.tsx",
          "src/App.jsx",
          "src/app.tsx",
          "src/app.jsx",
          "tsconfig.json",
        ],
        dependencies: ["react", "react-dom", "@types/react"],
        files_content: ["import React", 'from "react"', "React.Component", "useState", "useEffect"],
        topics: ["react", "reactjs", "react-components", "frontend"],
      },
      Vue: {
        required_files: ["package.json"],
        optional_files: ["src/App.vue", "src/app.vue", "vue.config.js", "vite.config.ts"],
        dependencies: ["vue", "@vue/cli-service", "@vitejs/plugin-vue"],
        files_content: ["createApp", "defineComponent", "<template>", "<script setup"],
        topics: ["vue", "vuejs", "vue3", "frontend"],
      },
      // ... similar pattern for other frameworks ...
      "Next.js": {
        required_files: ["package.json", "next.config.js"],
        optional_files: ["pages/_app.tsx", "pages/_app.js", "app/layout.tsx", "app/page.tsx"],
        dependencies: ["next", "@types/next"],
        files_content: ['from "next"', "GetStaticProps", "GetServerSideProps"],
        topics: ["nextjs", "react", "ssr", "frontend"],
      },
      // // Frontend Frameworks
      // React: {
      //   files: ["package.json"],
      //   dependencies: ["react", "react-dom", "@types/react"],
      //   files_content: ["import React", 'from "react"', "React.Component", "useState", "useEffect"],
      // },
      // Vue: {
      //   files: ["package.json", "vue.config.js"],
      //   dependencies: ["vue", "@vue/cli-service", "@vitejs/plugin-vue"],
      //   files_content: ["createApp", "defineComponent", "<template>", "<script setup"],
      // },
      // Angular: {
      //   files: ["angular.json", "package.json"],
      //   dependencies: ["@angular/core", "@angular/common", "@angular/cli"],
      //   files_content: ["@Component", "@Injectable", "implements OnInit"],
      // },
      // Svelte: {
      //   files: ["svelte.config.js", "package.json"],
      //   dependencies: ["svelte", "@sveltejs/kit"],
      //   files_content: ['<script lang="ts">', "export let", '<style lang="scss">'],
      // },

      // // Meta-Frameworks & SSG
      // "Next.js": {
      //   files: ["next.config.js", "package.json"],
      //   dependencies: ["next", "@types/next"],
      //   files_content: ['from "next"', "GetStaticProps", "GetServerSideProps"],
      // },
      // Nuxt: {
      //   files: ["nuxt.config.ts", "package.json"],
      //   dependencies: ["nuxt", "@nuxt/types"],
      //   files_content: ["defineNuxtConfig", "useNuxtApp", "useFetch"],
      // },
      // Astro: {
      //   files: ["astro.config.mjs", "package.json"],
      //   dependencies: ["astro"],
      //   files_content: ["---", "Astro.props", "getStaticPaths"],
      // },
      // Remix: {
      //   files: ["remix.config.js", "package.json"],
      //   dependencies: ["@remix-run/react", "@remix-run/node"],
      //   files_content: ["loader", "action", "useLoaderData"],
      // },
      // Gatsby: {
      //   files: ["gatsby-config.js", "package.json"],
      //   dependencies: ["gatsby", "@types/gatsby"],
      //   files_content: ["graphql`", "GatsbyNode", "createPages"],
      // },
      // Jekyll: {
      //   files: ["_config.yml", "Gemfile"],
      //   dependencies: ["jekyll"],
      //   files_content: ["---", "layout:", "permalink:"],
      // },
      // Hugo: {
      //   files: ["config.toml", "content/", "layouts/"],
      //   dependencies: [],
      //   files_content: ["{{ .Title }}", "{{ range .Pages }}", "baseURL ="],
      // },
      // Eleventy: {
      //   files: [".eleventy.js", "package.json"],
      //   dependencies: ["@11ty/eleventy"],
      //   files_content: ["module.exports = function(eleventyConfig)", "addPassthroughCopy"],
      // },
      // Vuepress: {
      //   files: [".vuepress/config.js", "package.json"],
      //   dependencies: ["vuepress"],
      //   files_content: ["module.exports = {", "sidebar:", "nav:"],
      // },
      // Gridsome: {
      //   files: ["gridsome.config.js", "package.json"],
      //   dependencies: ["gridsome"],
      //   files_content: ["GraphQL", "templates:", "plugins:"],
      // },
      // Hexo: {
      //   files: ["_config.yml", "package.json"],
      //   dependencies: ["hexo"],
      //   files_content: ["hexo", "theme:", "deploy:"],
      // },

      // // CSS Frameworks & UI Libraries
      // Tailwind: {
      //   files: ["tailwind.config.js", "postcss.config.js"],
      //   dependencies: ["tailwindcss", "@tailwindcss/typography"],
      //   files_content: ["@tailwind", "theme:", "plugins:"],
      // },
      // Bootstrap: {
      //   files: ["package.json"],
      //   dependencies: ["bootstrap", "@popperjs/core"],
      //   files_content: ['@import "bootstrap"', 'class="container"', 'class="row"'],
      // },
      // "Material UI": {
      //   files: ["package.json"],
      //   dependencies: ["@mui/material", "@emotion/react"],
      //   files_content: ["@mui/", "createTheme", "ThemeProvider"],
      // },
      // "Chakra UI": {
      //   files: ["package.json"],
      //   dependencies: ["@chakra-ui/react", "@emotion/react"],
      //   files_content: ["ChakraProvider", "useDisclosure", "extendTheme"],
      // },
      // "Shadcn UI": {
      //   files: ["components.json", "package.json"],
      //   dependencies: ["@radix-ui/react-icons", "class-variance-authority"],
      //   files_content: ["shadcn", "cn(", "cva("],
      // },

      // // Backend Frameworks
      // Express: {
      //   files: ["package.json"],
      //   dependencies: ["express", "@types/express"],
      //   files_content: ["app.use(", "express.Router()", "app.listen("],
      // },
      // Laravel: {
      //   files: ["composer.json", "artisan", "package.json"],
      //   dependencies: ["laravel/framework"],
      //   files_content: ["use Illuminate\\", "extends Model", "php artisan"],
      // },
      // Django: {
      //   files: ["manage.py", "requirements.txt", "settings.py"],
      //   dependencies: ["django", "djangorestframework"],
      //   files_content: ["from django", "INSTALLED_APPS", "MIDDLEWARE"],
      // },
      // "Ruby on Rails": {
      //   files: ["Gemfile"],
      //   dependencies: ["rails"],
      //   files_content: ["Rails.application", "ActiveRecord::", "class ApplicationController"],
      // },

      // // Build Tools & Bundlers
      // Vite: {
      //   files: ["vite.config.ts", "package.json"],
      //   dependencies: ["vite", "@vitejs/plugin-react"],
      //   files_content: ["defineConfig", "plugins:", "build:"],
      // },

      // // Lightweight Frameworks
      // "Alpine.js": {
      //   files: ["package.json"],
      //   dependencies: ["alpinejs", "@types/alpinejs"],
      //   files_content: ["x-data", "x-bind", "@click"],
      // },

      // // Database & Backend Services
      // Supabase: {
      //   files: ["package.json"],
      //   dependencies: ["@supabase/supabase-js"],
      //   files_content: ["createClient", "supabase", "auth.signIn"],
      // },
    }
  }

  private async getRepositoryContents(owner: string, repo: string): Promise<RepositoryContent> {
    const query = `
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          object(expression: "HEAD:") {
            ... on Tree {
              tree: entries {
                ... on TreeEntry {
                  path
                  type
                  object {
                    ... on Blob {
                      text
                    }
                    ... on Tree {
                      entries {
                        path
                        type
                        object {
                          ... on Blob {
                            text
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              node {
                name
              }
              size
            }
          }
          dependencyGraphManifests {
            nodes {
              dependencies {
                nodes {
                  packageName
                }
              }
            }
          }
          repositoryTopics(first: 50) {
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
    `

    return await this.client<RepositoryContent>(query, { owner, repo })
  }

  private getAllFiles(tree: { entries: FileNode[] }): Map<string, FileNode> {
    const files = new Map<string, FileNode>()

    const processEntries = (entries: FileNode[], basePath = "") => {
      for (const entry of entries) {
        const fullPath = basePath ? `${basePath}/${entry.path}` : entry.path

        if (entry.type === "blob") {
          files.set(fullPath, { ...entry, path: fullPath })
        } else if (entry.type === "tree" && entry.object) {
          processEntries((entry.object as any).entries, fullPath)
        }
      }
    }

    processEntries(tree.entries)
    return files
  }

  public async analyzeTechStack(owner: string, repo: string): Promise<AnalysisResult> {
    const data = await this.getRepositoryContents(owner, repo)
    const detected_stacks: string[] = []
    const confidence_scores: Record<string, number> = {}
    const matched_topics: Record<string, string[]> = {}

    // Get all files including nested ones
    const files = this.getAllFiles(data.repository.object.tree)

    // Extract repository topics
    const repoTopics = new Set(
      data.repository.repositoryTopics.nodes.map(node => node.topic.name.toLowerCase()),
    )

    // Get dependencies from manifests
    const dependencies = new Set<string>()
    for (const manifest of data.repository.dependencyGraphManifests.nodes) {
      if (manifest.dependencies) {
        for (const dep of manifest.dependencies.nodes) {
          dependencies.add(dep.packageName.toLowerCase())
        }
      }
    }

    // Check each tech stack's signatures
    for (const [stack, signatures] of Object.entries(this.tech_stacks)) {
      // First check if all required files exist
      const hasAllRequiredFiles = signatures.required_files.every(file => files.has(file))

      if (!hasAllRequiredFiles) {
        confidence_scores[stack] = 0
        continue
      }

      let score = signatures.required_files.length // Start with points for required files
      const maxScore =
        signatures.required_files.length +
        signatures.optional_files.length +
        signatures.dependencies.length +
        signatures.files_content.length +
        (signatures.topics?.length || 0)

      // Check optional files
      for (const file of signatures.optional_files) {
        if (files.has(file)) {
          score += 1
        }
      }

      // Check for dependencies
      for (const dep of signatures.dependencies) {
        if (dependencies.has(dep.toLowerCase())) {
          score += 1
        }
      }

      // Check file contents for specific patterns
      for (const [path, file] of files) {
        if (file.object?.text) {
          for (const pattern of signatures.files_content) {
            if (file.object.text.includes(pattern)) {
              score += 1
              break
            }
          }
        }
      }

      // Check topics
      const matchedTopics: string[] = []
      if (signatures.topics) {
        for (const topic of signatures.topics) {
          if (repoTopics.has(topic.toLowerCase())) {
            score += 1
            matchedTopics.push(topic)
          }
        }
        if (matchedTopics.length > 0) {
          matched_topics[stack] = matchedTopics
        }
      }

      const confidence = score / maxScore
      confidence_scores[stack] = Number.parseFloat(confidence.toFixed(2))

      // If more than 40% of signatures match, consider it as using this tech stack
      if (confidence > 0.4) {
        detected_stacks.push(stack)
      }
    }

    return {
      repository: `${owner}/${repo}`,
      detected_stacks: detected_stacks,
      primary_languages: data.repository.languages.edges.map(edge => edge.node.name).slice(0, 3),
      confidence_scores,
      matched_topics,
    }
  }

  public async batchAnalyzeRepositories(
    repositories: [string, string][],
  ): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = []
    for (const [owner, repo] of repositories) {
      try {
        const analysis = await this.analyzeTechStack(owner, repo)
        results.push(analysis)
      } catch (error) {
        console.error(`Error analyzing ${owner}/${repo}:`, error)
      }
    }
    return results
  }
}
