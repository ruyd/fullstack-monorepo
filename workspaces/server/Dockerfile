FROM node:18
WORKDIR /app
ADD ./dist .
RUN yarn install --production
CMD ["node", "index.js"]
EXPOSE 80 8080 443

