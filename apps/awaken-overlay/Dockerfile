FROM node:lts-alpine AS base
RUN apk add --no-cache curl libc6-compat python3
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

FROM base AS builder
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=awaken-overlay --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/out/pnpm-lock.yaml .
RUN pnpm install
# Build
RUN pnpm turbo run build --filter=awaken-overlay


FROM base AS runner
ENV NODE_ENV production
EXPOSE 3000
WORKDIR /app

COPY --from=installer /app/ .
#COPY --from=installer /app/apps/awaken-overlay/wsServer.js .
#COPY --from=installer /app/apps/awaken-overlay/node_modules ./node_modules
#COPY --from=installer /app/apps/awaken-overlay/.svelte-kit ./svelte-kit
#COPY --from=installer /app/apps/awaken-overlay/prisma ./prisma
#COPY --from=installer /app/apps/awaken-overlay/scripts ./scripts

RUN pnpm install --no-frozen-lockfile --prod

WORKDIR /app/apps/awaken-overlay

CMD ["npm", "start"]
