FROM node:lts-alpine3.20 AS build

RUN apk update && \
  apk upgrade && \
  apk add --no-cache bash git openssh

RUN mkdir /app

WORKDIR /app

COPY package.json .

RUN npm install -g --force npm@latest

RUN npm install

COPY . .

ARG AUTH0_DOMAIN
ARG AUTH0_CLIENT_ID
ARG AUTH0_AUDIENCE
ARG API_BASE_URL

RUN AUTH0_DOMAIN=${AUTH0_DOMAIN} \
  AUTH0_CLIENT_ID=${AUTH0_CLIENT_ID} \
  AUTH0_AUDIENCE=${AUTH0_AUDIENCE} \
  API_BASE_URL=${API_BASE_URL} \
  npm run build

# ---------------

FROM node:lts-alpine3.20

RUN mkdir -p /app/dist

RUN apk update && \
  apk upgrade && \
  apk add git

WORKDIR /app

COPY --from=build /app/package.json .

RUN npm install --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js .
COPY --from=build /app/api-server.js .

EXPOSE 3000
EXPOSE 3001

ENV SERVER_PORT=3000
ENV API_PORT=3001
ENV NODE_ENV=production

CMD ["npm", "run", "prod"]
