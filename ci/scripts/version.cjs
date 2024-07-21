#!/usr/bin/env node
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs");
const {basename} = require("path");

console.log(process.env)

const eventJSON = JSON.parse(process.env.EVENT_JSON ?? '{"ref":"", "head_commit":{"id": "local"}}');
const pkgJSONPath = process.env.CI ? "/src/package.json" : "./package.json";

const isTag = eventJSON.ref.startsWith("refs/tags/");
const pkg = JSON.parse(fs.readFileSync(pkgJSONPath))
let version = "";

if (isTag) {
    version = basename(eventJSON.ref).substring(1);
} else {
    let commitID = eventJSON.head_commit.id;
    if (commitID.length > 8) {
        commitID = commitID.substring(0, 8);
    }
    version = `${pkg.version}-${commitID}`
}

console.log(version);
if (process.env.CI) {
    pkg.version = version;
    fs.writeFileSync("/tmp/package.json", JSON.stringify(pkg, null, 2), {encoding: "utf-8"});
    fs.copyFileSync("/tmp/package.json", pkgJSONPath);
    fs.writeFileSync("/tmp/version.txt", version);
}
