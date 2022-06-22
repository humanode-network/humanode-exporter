FROM node:16 AS builder

WORKDIR /src

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .
RUN yarn build

FROM node:16

WORKDIR /app

COPY --from=builder /src/package.json ./
COPY --from=builder /src/build ./
COPY --from=builder /src/node_modules ./node_modules

RUN ls -al

STOPSIGNAL SIGTERM

CMD ["node", "index.js"]