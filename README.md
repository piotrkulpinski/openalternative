![OpenAlternative](https://openalternative.co/opengraph.png)

<p align="center" style="margin-top: 20px">
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
</p>

<p align="center">
   <a href="https://github.com/piotrkulpinski/openalternative/stargazers"><img src="https://img.shields.io/github/stars/piotrkulpinski/openalternative" alt="Github Stars"></a>
   <a href="https://github.com/piotrkulpinski/openalternative/blob/main/LICENSE"><img src="https://img.shields.io/github/license/piotrkulpinski/openalternative" alt="License"></a>
   <a href="https://github.com/piotrkulpinski/openalternative/pulse"><img src="https://img.shields.io/github/commit-activity/m/piotrkulpinski/openalternative" alt="Commits-per-month"></a>
   <a href="https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/piotrkulpinski/openalternative">
   <img alt="open in devcontainer" src="https://img.shields.io/static/v1?label=Dev%20Containers&message=Enabled&color=blue&logo=visualstudiocode" />
   </a>
</p>

<p align="center">
  <a href="https://www.producthunt.com/posts/openalternative?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-openalternative" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=443404&theme=light&period=daily" alt="OpenAlternative - Discover open source alternatives to popular software | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
  <a href="https://www.producthunt.com/posts/openalternative?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-openalternative" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=443404&theme=light" alt="OpenAlternative - Discover open source alternatives to popular software | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
</p>

## About this project

OpenAlternative is a community driven list of open source alternatives to proprietary software and applications.

Our goal is to be your first stop when researching for a new open source service to help you grow your business. We will help you find alternatives and reviews of the products you already use.

Join us in creating the biggest directory of open source software.

## Development

OpenAlternative is currently written in [Remix](https://remix.run). Please refer to the [Remix documentation](https://docs.remix.run) for more information.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command         | Action                                       |
| :-------------- | :------------------------------------------- |
| `bun install`   | Installs dependencies                        |
| `bun run dev`   | Starts local dev server at `localhost:5173`  |
| `bun run build` | Build your production site to `./build/`     |
| `bun run start` | Preview your build locally, before deploying |

## Deployment

First, build your app for production:

```sh
bun run build
```

Then run the app in production mode:

```sh
bun start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `bun run build`

- `build/server`
- `build/client`
