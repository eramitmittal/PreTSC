const cwd = require("process").cwd;
const fs = require("fs");
const path = require("path");
const inMemoryFS = require("./inMemoryFS.js");

const prebuild = require(path.join(cwd(), ".tscPreBuildHook.js"), { encoding: "utf-8" });
if (typeof prebuild === "function") {
    prebuild.call(inMemoryFS, inMemoryFS);
} else {
    throw new Error(`.tscPreBuild.js should export a function accepting inMemoryFS object as argument`);
}

const origReadFileSync = fs.readFileSync;
fs.readFileSync = (path, options) => {
    const content = inMemoryFS.readFile(path);
    if (!content) {
        return origReadFileSync.call(fs, path, options);
    }
    return content;
}
// invoke TSC 
require("typescript/lib/tsc");