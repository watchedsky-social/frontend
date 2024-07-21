#!/usr/bin/env node
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

pkgJSONPath = process.env.CI ? "/src/package.json" : "../../package.json";
console.log(pkgJSONPath);

const pkg = require(pkgJSONPath);
const fs = require("fs");

fs.writeFileSync("/tmp/version.txt", pkg.version);
