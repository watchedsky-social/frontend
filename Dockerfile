FROM cgr.dev/chainguard/node:latest AS pnpm
USER root

RUN npm install -g pnpm

USER 65532
ENV PATH=$PATH:/usr/local/bin

FROM pnpm AS build

WORKDIR /app
COPY . /app/

ENV PATH=$PATH:/usr/local/bin
RUN ["pnpm", "install"]
RUN ["pnpm", "run", "build"]

FROM cgr.dev/chainguard/nginx:latest AS release
WORKDIR /www/data

COPY --from=build /app/dist/ .
COPY ./config/frontend.conf /etc/nginx/conf.d/
