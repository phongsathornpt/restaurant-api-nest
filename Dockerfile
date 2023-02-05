FROM node:16.19.0

WORKDIR /app

COPY . . 

ENV APP_URL https://restaurant-api-nest.fly.dev
ENV APP_PORT 8000
ENV GMAP_KEY AIzaSyCiJFmXqcdxExkFFWU4lGFxe08isdQ2Vfw

RUN yarn install
RUN yarn build

CMD [ "yarn", "start:prod"]

EXPOSE 8000
