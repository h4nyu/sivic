FROM arm32v7/node:15-slim
WORKDIR /srv
COPY . .
RUN apt update \
    && apt install wait-for-it \
    && rm -rf /var/lib/apt/lists/* \
    && yarn install \
    && yarn build \
    && rm -rf node_modules \
    && yarn install --prod \
    && yarn cache clean
