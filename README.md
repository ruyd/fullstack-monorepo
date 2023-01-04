# Drawspace - Fullstack Canvas Drawing App

## TypeScript App Project Template

[![Workflow](https://github.com/ruyd/fullstack-monorepo/actions/workflows/client-deploy-ghpages.yml/badge.svg)](https://github.com/ruyd/fullstack-monorepo/actions/workflows/client-deploy-ghpages.yml)
[![Demo](https://img.shields.io/badge/Deployment-GITHUB%20PAGES-GREEN.svg)](https://ruyd.github.io/fullstack-monorepo)

[![Workflow](https://github.com/ruyd/fullstack-monorepo/actions/workflows/deploy-google.yml/badge.svg)](https://github.com/ruyd/fullstack-monorepo/actions/workflows/deploy-google.yml)
[![Demo](https://img.shields.io/badge/Deployment-GCLOUD-GREEN.svg)](https://api.drawspace.app/docs)

### Best Practices and Scalability Template 🙌

[![Image](https://raw.githubusercontent.com/ruyd/fullstack-monorepo/master/workspaces/client/src/features/home/images/lighthouse.png)](https://ruyd.github.io/fullstack-monorepo)

### Developer Experience 💕😎✨
- VSCode concurrent separate terminals debugging client, server and tests
- Super Fast Webpack Hot Reloading with Cache (except devServer cold start...)
- Git Pre-Push Hook that run tests and blocks bad commits
- Repositoryless shared code packages (bundled by webpack)
- Deploy Ready for Google Cloud (Bucket, Branch Container > Artifact Registry > Run, Compute, Function, GKE)
- [Automated Backend](https://github.com/ruyd/automated-express-backend)
### Made with

- TypeScript
- React, Redux and React Query
- Material UI
- Swagger
- Sequelize
- Postgres
- Webpack
- Jest and Docker
- Auth0
- socket.io

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

