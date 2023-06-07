FROM node:18.16-alpine AS build

WORKDIR /app

RUN apk add --no-cache curl libc6-compat

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build


FROM node:18.16-alpine AS runner

ENV NODE_ENV production

EXPOSE 3000

WORKDIR /app

RUN apk add --no-cache curl

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY --from=build /app/package.json .
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/wsServer.js .
COPY --from=build /app/build ./build
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/scripts ./scripts




RUN pnpm install --no-frozen-lockfile --prod

CMD ["npm", "start"]