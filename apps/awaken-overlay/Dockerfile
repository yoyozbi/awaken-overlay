FROM node:lts-alpine AS base
RUN apk add --no-cache curl libc6-compat python3
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=awaken-overlay --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/out/pnpm-lock.yaml .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
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
#COPY --from=installer /app/apps/awaken-overlay/wsServer.js .
#COPY --from=installer /app/apps/awaken-overlay/node_modules ./node_modules
#COPY --from=installer /app/apps/awaken-overlay/.svelte-kit ./svelte-kit
#COPY --from=installer /app/apps/awaken-overlay/prisma ./prisma
#COPY --from=installer /app/apps/awaken-overlay/scripts ./scripts

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod 

WORKDIR /app/apps/awaken-overlay

CMD ["npm", "start"]
