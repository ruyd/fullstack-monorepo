# Drawspace - TypeScript Sample Monorepo

Fullstack TypeScript Drawing Canvas App

[![Workflow](https://github.com/ruyd/fullstack-monorepo/actions/workflows/deploy-client.yml/badge.svg)](https://github.com/ruyd/fullstack-monorepo/actions/workflows/deploy-client.yml)
[![Demo](https://img.shields.io/badge/Deployment-GITHUB%20PAGES-GREEN.svg)](https://ruyd.github.io/fullstack-monorepo)

[![Workflow](https://github.com/ruyd/fullstack-monorepo/actions/workflows/deploy-server.yml/badge.svg)](https://github.com/ruyd/fullstack-monorepo/actions/workflows/deploy-server.yml)
[![Demo](https://img.shields.io/badge/Deployment-HEROKU-GREEN.svg)](https://drawspace-api.herokuapp.com/docs)

## Developer Experience 🙌💕😎✨

- Hot Reload Heaven
- Generic redux and react-query
- Automated NPM scripts
- Automated Backend

### Made with

- TypeScript
- React
- Redux
- React Query
- Material UI
- NodeJS/Express
- Swagger
- Sequelize

## TypeScript Configuration

```
yarn network timeout issue due to: @mui/icons-material
fix: yarn config set disable-self-update-check true
```

client

- No ts.config references due to github actions: TS6305: Output file has not been built from source, hot reload via webpack
- Modified CRA webpack
- Packages linked via paths

packages

- Composite: true
- package.json exports

server

- Composite: true with paths and references to packages
- Packages Hot Reload note: paths' need non-wildcarded dir names

NPM

```json
"workspaces": [
"packages/*",
"client",
"server"
],
```

### Setup

- Get/Create your Database connection URL
- Run npm start to create .env files
- Set server/.env DATABASE_URL ie: postgres://postgres:password@localhost:5432/draw
- For Auth0, set AUTH BASE_URL CLIENT_ID and SECRET with values from dashboard
- In dashboard/rules add enrichToken rule: /server/setup/Auth0.js
- Rerun npm start, it's ready

### About Sample App

> Challenge: Create a drawing web application that allows users to draw/sketch on an empty piece of “paper” and upload it to a public list of drawings.
> Each uploaded drawing will be saved in a persistence layer of your choosing on the backend.
> NOTE: The drawings should not be persisted as bitmaps.

### [Click for Demo](https://ruyd.github.io/fullstack-monorepo)

Backend might be sleeping, takes a bit to wake up

[![Image](https://raw.githubusercontent.com/ruyd/fullstack-monorepo/master/client/src/pages/Home/images/self.PNG)](https://ruyd.github.io/fullstack-monorepo/draw)

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
