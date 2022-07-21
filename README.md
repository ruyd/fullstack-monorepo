# Drawspace - TypeScript Sample Monorepo

Fullstack TypeScript App Template & Software Patterns Showcase

[![Workflow](https://github.com/ruyd/fullstack-monorepo/actions/workflows/deploy-client.yml/badge.svg)](https://github.com/ruyd/fullstack-monorepo/actions/workflows/deploy-client.yml)
[![Demo](https://img.shields.io/badge/Deployment-GITHUB%20PAGES-GREEN.svg)](https://ruyd.github.io/fullstack-monorepo)

[![Workflow](https://github.com/ruyd/fullstack-monorepo/actions/workflows/deploy-server.yml/badge.svg)](https://github.com/ruyd/fullstack-monorepo/actions/workflows/deploy-server.yml)
[![Demo](https://img.shields.io/badge/Deployment-HEROKU-GREEN.svg)](https://drawspace-api.herokuapp.com)

## Developer Experience 🙌💕😎✨

- Hot Reload and Debug Heaven
- Generic modern redux and react-query
- Web Workers for expensive computations
- Automated nodejs scripts
- Automated Backend with Sequelize

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

client

- Composite: false
- No references due to github actions: TS6305: Output file has not been built from source
- Uses Create React App's internal webpack untouched, module lookup directories modified with craco
- Packages linked via paths and workplace

packages

- Composite: true
- package.json exports

server

- Composite: true with references to packages, tsc bundled output
- Packages Hot Reload note: paths' need non-wildcarded dir names

NPM

```json
"workspaces": [
"packages/*",
"client",
"server"
],
``

### Setup
- Create Database and/or get connection URL
- Run npm start to create .env files
- Set server/.env DATABASE_URL ie: postgres://postgres:password@localhost:5432/draw
- For Auth0, set AUTH BASE_URL CLIENT_ID and SECRET with values from dashboard
- In dashboard/rules add enrichToken rule: /server/setup/Auth0.js
- Rerun npm start, it's ready

### About App

> Challenge: Create a drawing web application that allows users to draw/sketch on an empty piece of “paper” and upload it to a public list of drawings.
> Each uploaded drawing will be saved in a persistence layer of your choosing on the backend.
> NOTE: The drawings should not be persisted as bitmaps.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
```
