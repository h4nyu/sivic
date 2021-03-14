FROM node:15-slim
WORKDIR /srv
COPY . .
RUN apt-get update \
    && apt-get install wait-for-it \
    && rm -rf /var/lib/apt/lists/* \
    && yarn install \
    && yarn build \
    && rm -rf node_modules \
    && yarn install --prod \
    && yarn cache clean
