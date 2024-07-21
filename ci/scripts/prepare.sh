#!/bin/sh

apk add -U corepack

corepack install -g pnpm@9.4.0
corepack use pnpm@9.4.0
corepack enable pnpm
pnpm install
