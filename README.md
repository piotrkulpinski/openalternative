![OpenAlternative](https://openalternative.co/opengraph.png)

<p align="center"></p>

<p align="center">
  Discover open source alternatives to popular software.
  <br>
  <a href="https://openalternative.co"><strong>Learn more »</strong></a>
  <br />
  <br />
  <a href="https://openalternative.co">Website</a>
  ·
  <a href="https://github.com/piotrkulpinski/openalternative/issues">Issues</a>
</p>

<p align="center">
   <a href="https://github.com/piotrkulpinski/openalternative/stargazers"><img src="https://img.shields.io/github/stars/piotrkulpinski/openalternative" alt="Github Stars"></a>
   <a href="https://github.com/piotrkulpinski/openalternative/blob/main/LICENSE"><img src="https://img.shields.io/github/license/piotrkulpinski/openalternative" alt="License"></a>
   <a href="https://github.com/piotrkulpinski/openalternative/pulse"><img src="https://img.shields.io/github/commit-activity/m/piotrkulpinski/openalternative" alt="Commits-per-month"></a>
   <a href="https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/piotrkulpinski/openalternative">
   <img alt="open in devcontainer" src="https://img.shields.io/static/v1?label=Dev%20Containers&message=Enabled&color=blue&logo=visualstudiocode" />
   </a>
   <a href="https://news.ycombinator.com/item?id=39639386"><img src="https://img.shields.io/badge/Hacker%20News-156-%23FF6600" alt="Hacker News"></a>
</p>

<p align="center">
  <a href="https://www.producthunt.com/posts/openalternative?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-openalternative" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=443404&theme=light&period=daily" alt="OpenAlternative - Discover open source alternatives to popular software | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
  <a href="https://www.producthunt.com/posts/openalternative?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-openalternative" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=443404&theme=light" alt="OpenAlternative - Discover open source alternatives to popular software | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
</p>

## About this project

OpenAlternative is a community driven list of open source alternatives to proprietary software and applications.

Our goal is to be your first stop when researching for a new open source service to help you grow your business. We will help you find alternatives and reviews of the products you already use.

Join us in creating the biggest directory of open source software.

## Sponsors

OpenAlternative is an GPL-3.0-licensed open source project with its ongoing development made possible entirely by the support of these awesome backers. If you'd like to join them, please consider [sponsoring OpenAlternative's development](https://openalternative.co/sponsor).

<p align="center">
  <a target="_blank" href="https://openalternative.co/sponsor#sponsors">
    <img alt="Sponsors" src="https://openalternative.co/sponsors/sponsors.png">
  </a>
</p>

## Project Structure

OpenAlternative is a monorepo project with two main applications:

1. Web application (Remix) - located in `apps/web`
2. Admin panel (Next.js) - located in `apps/admin`

## Development

This project uses [Bun](https://bun.sh/) as the package manager and runtime. Make sure you have Bun installed before proceeding.

To set up the project for development:

1. Clone the repository
2. Run `bun install` in the root directory to install all dependencies
3. Set up the required environment variables (see below)
4. Run `bun run db:push` to push the Prisma schema to the database
5. Create symlinks for the .env file (see Environment Variables section)
6. Run `bun run dev` to start both the web and admin applications in development mode

### Environment Variables

Refer to the `.env.example` file for a complete list of required variables.

To manage environment variables across the monorepo, you have two options:

1. Create symlinks to the root .env file:
   - For Unix-based systems (macOS, Linux):
     ```
     ln -s ../../.env apps/web/.env
     ln -s ../../.env apps/admin/.env
     ln -s ../.env packages/database/.env
     ```
   - For Windows (run in Command Prompt as Administrator):
     ```
     mklink apps\web\.env ..\..\\.env
     mklink apps\admin\.env ..\..\\.env
     mklink packages\database\.env ..\.\.env
     ```

2. Create separate .env files for each app and package:
   - Copy the `.env.example` file to each app and package directory
   - Rename it to `.env`
   - Update the variables as needed for each app or package

Choose the method that best fits your development workflow and security requirements.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                                    |
| :---------------- | :-------------------------------------------------------- |
| `bun install`     | Installs dependencies                                     |
| `bun run dev`     | Starts both web and admin apps in development mode        |
| `bun run web dev` | Starts web app at `localhost:5173`                        |
| `bun run admin dev` | Starts admin app at `localhost:5174`                    |
| `bun run build`   | Build both apps for production                            |
| `bun run start`   | Preview production build locally                          |
| `bun run lint`    | Run linter                                                |
| `bun run format`  | Format code                                               |
| `bun run typecheck` | Run TypeScript type checking 
| `bun run db:generate` | Generate Prisma client
| `bun run db:studio` | Start Prisma Studio
| `bun run db:push` | Push Prisma schema to database
| `bun run db:pull` | Pull Prisma schema from database
| `bun run db:reset` | Reset Prisma schema

## Third-Party Services

OpenAlternative uses the following third-party services:

- Database: [Supabase](https://supabase.com)
- Analytics: [Plausible](https://plausible.io), [PostHog](https://posthog.com)
- Search: [Algolia](https://algolia.com)
- Newsletter: [Beehiiv](https://go.openalternative.co/beehiiv)
- Background Jobs: [Inngest](https://inngest.com)
- File Storage: [AWS S3](https://aws.amazon.com/s3)
- Payments: [Stripe](https://stripe.com)
- Screenshots: [ScreenshotOne](https://go.openalternative.co/screenshotone)

Make sure to set up accounts with these services and add the necessary environment variables to your `.env` file.

## Deployment

The project is set up for deployment on Vercel. Each app (web and admin) can be deployed separately.

To deploy manually:

1. Build the project: `bun run build`
2. For the web app: `bun run web start`
3. For the admin app: `bun run admin start`

Ensure all environment variables are properly set in your production environment.

## License

OpenAlternative is licensed under the [GPL-3.0 License](LICENSE).
