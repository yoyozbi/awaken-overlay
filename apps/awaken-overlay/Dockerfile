FROM oven/bun:1 AS base

FROM base AS builder
WORKDIR /app
RUN bun add -g turbo
COPY . .
RUN turbo prune --scope=awaken-overlay --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/out/bun.lock .
RUN bun install --frozen-lockfile 
# Build
RUN pnpm turbo run build --filter=awaken-overlay


FROM base AS runner
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
RUN bun install --frozen-lockfile --production

WORKDIR /app/apps/awaken-overlay

CMD ["bun", "start"]
