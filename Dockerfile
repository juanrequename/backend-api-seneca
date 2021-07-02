FROM node:lts-buster-slim

ARG NPM_TOKEN

WORKDIR /app

COPY . .

RUN npm install \
  && npm run build

#EXPOSE ${APP_HTTP_PORT}
EXPOSE 3000

#COPY ./src/uploads dist/uploads

CMD node dist/app.js
