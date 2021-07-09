FROM node:alpine

ENV CI=true

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn --network-concurrency 1

COPY ./ ./

CMD ["yarn", "start"]