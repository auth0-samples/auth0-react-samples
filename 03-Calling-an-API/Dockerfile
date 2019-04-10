FROM node:10-alpine as build

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN mkdir /app

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# ---------------

FROM node:10-alpine

RUN mkdir -p /app/build

WORKDIR /app

COPY --from=build /app/package.json .

RUN npm install --production

COPY --from=build /app/build ./build
COPY --from=build /app/bin ./bin
COPY --from=build /app/src/auth_config.json ./src/auth_config.json
COPY --from=build /app/server.js .

EXPOSE 3000

ENV NODE_ENV production

CMD ["node", "server.js"]