FROM node:18
WORKDIR /app
ADD ./dist .
RUN npm install --production
EXPOSE 80 8080 443
CMD ["node", "index.js"]

