FROM node:10-alpine as build

RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh yarn

RUN mkdir /app

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

# ---------------

FROM node:10-alpine

RUN mkdir -p /app/build

RUN apk update && apk upgrade && apk add yarn git

WORKDIR /app

COPY --from=build /app/build ./build
COPY --from=build /app/package.json .
COPY --from=build /app/server.js .

ENV NODE_ENV production

RUN yarn install --production

EXPOSE 3000

CMD ["node", "server.js"]