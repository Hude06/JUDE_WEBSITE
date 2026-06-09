FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache git openssh-client

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Stamped by the deploy: docker build --build-arg BUILD_SHA=$(git rev-parse --short HEAD)
ARG BUILD_SHA=dev
ARG BUILD_TIME=
ENV BUILD_SHA=$BUILD_SHA
ENV BUILD_TIME=$BUILD_TIME

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV SKIP_TYPE_CHECK=1

EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]
