FROM node:18
WORKDIR /usr/src
ADD ./dist .
RUN --mount=type=bind,source=./scripts,target=/scripts node /scripts/applySecrets.js index.js
RUN yarn install --production
CMD ["node", "index.js"]
