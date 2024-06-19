FROM node:lts AS base
RUN apt-get update && apt-get install  curl libc6-dev python3
RUN npm install -g bun

FROM base AS builder
WORKDIR /app
RUN bun add -g turbo
COPY . .
RUN turbo prune --scope=awaken-overlay --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/out/bun.lockb .
RUN bun install --frozen-lockfile 
# Build
RUN bun run build --filter=awaken-overlay


FROM oven/bun:1-alpine AS runner
ENV NODE_ENV production
EXPOSE 3000
WORKDIR /app
COPY --from=installer /app/packages/ ./packages/
COPY --from=installer /app/pnpm-workspace.yaml .
COPY --from=installer /app/package.json .
COPY --from=installer /app/node_modules .
COPY --from=installer /app/apps/awaken-overlay/build/ ./apps/awaken-overlay/build/
COPY --from=installer /app/apps/awaken-overlay/package.json ./apps/awaken-overlay/
COPY --from=installer /app/apps/awaken-overlay/wsServer.js ./apps/awaken-overlay/
COPY --from=installer /app/apps/awaken-overlay/prisma/ ./apps/awaken-overlay/prisma/
COPY --from=installer /app/apps/awaken-overlay/scripts/ ./apps/awaken-overlay/scripts/
RUN bun install --forzen-lockfile --production

WORKDIR /app/apps/awaken-overlay

CMD ["bun","run", "start"]
