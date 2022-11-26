# Drawspace - Fullstack Canvas Drawing App

## TypeScript Starter

[![Workflow](https://github.com/ruyd/fullstack-monorepo/actions/workflows/deploy-client.yml/badge.svg)](https://github.com/ruyd/fullstack-monorepo/actions/workflows/deploy-client.yml)
[![Demo](https://img.shields.io/badge/Deployment-GITHUB%20PAGES-GREEN.svg)](https://ruyd.github.io/fullstack-monorepo)

[![Workflow](https://github.com/ruyd/fullstack-monorepo/actions/workflows/deploy-server.yml/badge.svg)](https://github.com/ruyd/fullstack-monorepo/actions/workflows/deploy-server.yml)
[![Demo](https://img.shields.io/badge/Deployment-HEROKU-GREEN.svg)](https://drawspace-api.herokuapp.com/docs)

### Best Practices with Scalability Template 🙌

[![Image](https://raw.githubusercontent.com/ruyd/fullstack-monorepo/master/workspaces/client/src/features/home/images/lighthouse.png)](https://ruyd.github.io/fullstack-monorepo)

### Developer Experience 💕😎✨
- VSCode concurrent separate terminals debugging client, server and tests
- Super Fast Webpack Hot Reloading with Cache (except devServer cold start...)
- Git Pre-Push Hook that run tests and blocks bad commits
- Repositoryless shared code packages (bundled by webpack)
- Deploy Ready Actions for AWS, GCP, Azure (Bucket + Functions|Container)
- [Automated Backend](https://github.com/ruyd/automated-express-backend)
### Made with

- TypeScript
- React, Redux and React Query
- Material UI
- Swagger
- Sequelize
- Webpack
- Jest and Docker
- Auth0
- socket.io
- pos

### Quick Start

- `git clone https://github.com/ruyd/fullstack-monorepo desiredName`
- `yarn dev` or open in vscode and run debug  
- For Auth0 Auto Setup, copy sample.env to workspaces/server/.env and populate with:
  Dashboard > Applications > API Explorer Application > Settings
  - AUTH_TENANT=`tenant` (ie: domain without .auth0.com)
  - AUTH_EXPLORER_ID=`Client ID`
  - AUTH_EXPLORER_SECRET=`Client Secret`


### Requirements
- [Docker](https://www.docker.com/) 
### About Drawspace App

A drawing web and mobile application that allows users to sketch on an empty piece of “paper” and upload it to a public list of drawings

### [Frontend Demo](https://ruyd.github.io/fullstack-monorepo)

Backend might be sleeping, takes a bit to wake up

[![Image](https://raw.githubusercontent.com/ruyd/fullstack-monorepo/master/workspaces/client/src/features/home/images/self.PNG)](https://ruyd.github.io/fullstack-monorepo/draw)

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

