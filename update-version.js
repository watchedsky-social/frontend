#!/usr/bin/env node
/* eslint-disable no-undef */

import { writeFileSync } from "fs";

const version = process.env["FRONTEND_BUILD_VERSION"];
const build_id = process.env["FRONTEND_BUILD_ID"];

const versionInfo = {
  version: version ?? "",
  build_id: build_id ?? ""
};

writeFileSync("./src/version.json", JSON.stringify(versionInfo));
