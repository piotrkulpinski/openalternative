# OpenAlternative

This is a project to create a website for OpenAlternative, a non-profit organization that aims to provide alternative solutions to proprietary software.

[](https://openalternative.to/opengraph.png)

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
