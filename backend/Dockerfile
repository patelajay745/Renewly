# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn global add @nestjs/cli
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app

COPY package.json  ./
RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist

USER node

EXPOSE 8083
CMD ["node", "dist/main"]
