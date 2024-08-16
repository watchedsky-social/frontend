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

FROM scratch AS release
WORKDIR /site

COPY --from=build /app/dist/* /site/

