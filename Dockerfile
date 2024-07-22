FROM node:20-bookworm-slim AS base

RUN corepack enable

FROM base AS builder

WORKDIR /src

COPY package.json yarn.lock ./
COPY .yarn .yarn

RUN yarn install --immutable --immutable-cache

COPY . .
RUN yarn build

FROM base

WORKDIR /app

COPY --from=builder /src/package.json ./
COPY --from=builder /src/build ./
COPY --from=builder /src/node_modules ./node_modules

RUN ls -al

STOPSIGNAL SIGTERM

CMD ["node", "index.js"]