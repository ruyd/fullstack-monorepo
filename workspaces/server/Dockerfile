FROM node:18
WORKDIR /usr/app
ADD ./dist .
RUN yarn install --production
CMD ["node", "index.js"]
