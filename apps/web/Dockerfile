FROM node:20-alpine AS builder
RUN apk add --no-cache yarn
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --cache-folder ./.yarn-cache
COPY . .
ARG VITE_API_URL
ARG VITE_CLERK_PUBLISHABLE_KEY
RUN yarn build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
ARG VITE_API_URL
ARG VITE_CLERK_PUBLISHABLE_KEY

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]