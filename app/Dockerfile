FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN mkdir -p /data && chown -R node:node /data

USER node

EXPOSE 5000

ENV PORT=5000

CMD ["node", "server.js"]
