![OpenAlternative](https://openalternative.co/screen.png)

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

## About this project

OpenAlternative is a community driven list of open source alternatives to proprietary software and applications.

Our goal is to be your first stop when researching for a new open source service to help you grow your business. We will help you find alternatives and reviews of the products you already use.

Join us in creating the biggest directory of open source software.

## Recognition

<p align="center">
  <a href="https://www.producthunt.com/posts/openalternative?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-openalternative" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=443404&theme=light&period=daily" alt="OpenAlternative - Discover open source alternatives to popular software | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
  <a href="https://www.producthunt.com/posts/openalternative?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-openalternative" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=443404&theme=light" alt="OpenAlternative - Discover open source alternatives to popular software | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
</p>
## 🚀 Project Structure

Inside of the project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

Any static assets, like images, can be placed in the `public/` directory.

## Airtable

The project is built on top of [Airtable](https://airtable.com) database. This allows me to quickly make changes and make use of the vast amount of extensions that Airtable has to offer.

In order to build your own version of this project, you will need to create your own Airtable base and fill in the environment variables with the appropriate values.

Easiest way to start is to duplicate the base I have created:

```
https://airtable.com/appBvWPZiYx4MPh6J/shrSwSYHdS3H7W2wL
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
