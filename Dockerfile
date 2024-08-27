FROM cgr.dev/chainguard/node:latest-dev AS pnpm
USER root

RUN npm install -g pnpm

USER 65532
ENV PATH=$PATH:/usr/local/bin

FROM pnpm AS build

WORKDIR /app
COPY . /app/

ARG version=0.0.0-dev
ARG build_id=local

ENV FRONTEND_BUILD_VERSION=${version}
ENV FRONTEND_BUILD_ID=${build_id}

RUN /app/update-version.js

ENV PATH=$PATH:/usr/local/bin
RUN ["pnpm", "install"]
RUN ["pnpm", "run", "build"]

FROM cgr.dev/chainguard/nginx:latest AS release
WORKDIR /www/data

COPY --from=build /app/dist/ .
COPY ./config/frontend.conf /etc/nginx/conf.d/
